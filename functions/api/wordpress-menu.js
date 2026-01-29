/**
 * Fetch WordPress menu items
 * This is a server-side API that handles WordPress authentication securely
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function handleCORS(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: CORS_HEADERS,
    });
  }
}

export async function onRequest(context) {
  try {
    // Handle CORS preflight requests
    const corsResponse = handleCORS(context.request);
    if (corsResponse) {
      return corsResponse;
    }

    const wordpressUrl = context.env.WORDPRESS_URL;
    const wordpressUsername = context.env.WORDPRESS_USERNAME;
    const wordpressPassword = context.env.WORDPRESS_PASSWORD;

    if (!wordpressUrl) {
      return new Response(JSON.stringify({
        error: 'WordPress URL not configured',
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      });
    }

    // 1. Get all menus
    const menusResponse = await fetch(`${wordpressUrl}/wp-json/wp/v2/menus`, {
      headers: {
        'Authorization': wordpressUsername && wordpressPassword
          ? `Basic ${btoa(`${wordpressUsername}:${wordpressPassword}`)}`
          : undefined,
      },
    });

    if (!menusResponse.ok) {
      const errorData = await menusResponse.text();
      console.error('Menus fetch error:', errorData);
      throw new Error(`Failed to fetch menus: ${menusResponse.status} ${menusResponse.statusText}. Details: ${errorData}`);
    }

    const menus = await menusResponse.json();

    // 2. Find the menu named "文章分類"
    const articleMenu = menus.find(menu => menu.name === '文章分類');

    if (!articleMenu) {
      return new Response(JSON.stringify({
        error: 'Menu "文章分類" not found',
        availableMenus: menus.map(m => m.name),
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      });
    }

    // 3. Get all menu items for this menu
    const itemsResponse = await fetch(
      `${wordpressUrl}/wp-json/wp/v2/menu-items?menus=${articleMenu.id}`,
      {
        headers: {
          'Authorization': wordpressUsername && wordpressPassword
            ? `Basic ${btoa(`${wordpressUsername}:${wordpressPassword}`)}`
            : undefined,
        },
      }
    );

    if (!itemsResponse.ok) {
      const errorData = await itemsResponse.text();
      console.error('Menu items fetch error:', errorData);
      throw new Error(`Failed to fetch menu items: ${itemsResponse.status} ${itemsResponse.statusText}. Details: ${errorData}`);
    }

    const items = await itemsResponse.json();

    // 4. Transform menu items to the format we need
    const menuItems = items.map(item => ({
      name: item.title.rendered,
      href: item.url,
      isExternal: false,
    }));

    return new Response(JSON.stringify({
      success: true,
      items: menuItems,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error('Error fetching WordPress menu:', error);
    return new Response(JSON.stringify({
      error: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  }
}
