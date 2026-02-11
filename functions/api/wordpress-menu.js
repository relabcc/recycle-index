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

    console.log('WP URL:', wordpressUrl);

    // 1. Get all menus
    const menusUrl = `${wordpressUrl}/wp-json/wp/v2/menus`;
    const menusUrlFallback = `${wordpressUrl}/?rest_route=/wp/v2/menus`;
    console.log('WP menus URL:', menusUrl);
    const menusResponse = await fetch(menusUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; recycle-index/1.0)',
        'Authorization': wordpressUsername && wordpressPassword
          ? `Basic ${btoa(`${wordpressUsername}:${wordpressPassword}`)}`
          : undefined,
      },
    });

    let menusResponseFinal = menusResponse;
    if (!menusResponseFinal.ok && menusResponseFinal.status === 404) {
      console.log('WP menus URL fallback:', menusUrlFallback);
      menusResponseFinal = await fetch(menusUrlFallback, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; recycle-index/1.0)',
          'Authorization': wordpressUsername && wordpressPassword
            ? `Basic ${btoa(`${wordpressUsername}:${wordpressPassword}`)}`
            : undefined,
        },
      });
    }

    if (!menusResponseFinal.ok) {
      const errorData = await menusResponse.text();
      console.error('Menus fetch status:', menusResponseFinal.status, menusResponseFinal.statusText);
      console.error('Menus fetch content-type:', menusResponseFinal.headers.get('content-type'));
      console.error('Menus fetch error (first 500 chars):', errorData.slice(0, 500));
      throw new Error(`Failed to fetch menus: ${menusResponseFinal.status} ${menusResponseFinal.statusText}. Details: ${errorData}`);
    }

    const menus = await menusResponseFinal.json();

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
    const itemsUrl = `${wordpressUrl}/wp-json/wp/v2/menu-items?menus=${articleMenu.id}`;
    const itemsUrlFallback = `${wordpressUrl}/?rest_route=/wp/v2/menu-items&menus=${articleMenu.id}`;
    console.log('WP menu items URL:', itemsUrl);
    const itemsResponse = await fetch(itemsUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; recycle-index/1.0)',
        'Authorization': wordpressUsername && wordpressPassword
          ? `Basic ${btoa(`${wordpressUsername}:${wordpressPassword}`)}`
          : undefined,
      },
    });

    let itemsResponseFinal = itemsResponse;
    if (!itemsResponseFinal.ok && itemsResponseFinal.status === 404) {
      console.log('WP menu items URL fallback:', itemsUrlFallback);
      itemsResponseFinal = await fetch(itemsUrlFallback, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; recycle-index/1.0)',
          'Authorization': wordpressUsername && wordpressPassword
            ? `Basic ${btoa(`${wordpressUsername}:${wordpressPassword}`)}`
            : undefined,
        },
      });
    }

    if (!itemsResponseFinal.ok) {
      const errorData = await itemsResponseFinal.text();
      console.error('Menu items fetch status:', itemsResponseFinal.status, itemsResponseFinal.statusText);
      console.error('Menu items fetch content-type:', itemsResponseFinal.headers.get('content-type'));
      console.error('Menu items fetch error (first 500 chars):', errorData.slice(0, 500));
      throw new Error(`Failed to fetch menu items: ${itemsResponseFinal.status} ${itemsResponseFinal.statusText}. Details: ${errorData}`);
    }

    const items = await itemsResponseFinal.json();

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
