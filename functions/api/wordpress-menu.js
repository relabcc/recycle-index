/**
 * Fetch WordPress menu items
 * This is a server-side API that handles WordPress authentication securely
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const BACKUP_MENU_ITEMS = [
  {
    name: '家庭－居家生活',
    href: 'https://recycle.rethinktw.org/test_blog/category/home/',
    isExternal: false,
  },
  {
    name: '家庭－廚房',
    href: 'https://recycle.rethinktw.org/test_blog/category/kitchen/',
    isExternal: false,
  },
  {
    name: '家庭－衛浴',
    href: 'https://recycle.rethinktw.org/test_blog/category/bathroom/',
    isExternal: false,
  },
  {
    name: '環保知識',
    href: 'https://recycle.rethinktw.org/test_blog/category/knowledge/',
    isExternal: false,
  },
  {
    name: '辦公室',
    href: 'https://recycle.rethinktw.org/test_blog/category/office/',
    isExternal: false,
  },
  {
    name: '餐廳/夜市',
    href: 'https://recycle.rethinktw.org/test_blog/category/restarunt/',
    isExternal: false,
  },
];

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
    const wordpressPasswordRaw = context.env.WORDPRESS_PASSWORD;
    // WordPress Application Password 需要移除空格
    const wordpressPassword = wordpressPasswordRaw?.replace(/\s+/g, '');

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
    console.log('Password raw length:', wordpressPasswordRaw?.length);
    console.log('Password clean length:', wordpressPassword?.length);
    console.log('Password has spaces:', wordpressPasswordRaw?.includes(' '));
    
    // Debug: 显示 Authorization header 的尾部（用于验证）
    const authHeader = wordpressUsername && wordpressPassword
      ? `Basic ${btoa(`${wordpressUsername}:${wordpressPassword}`)}`
      : undefined;

    if (authHeader) {
      console.log('Auth base64 tail:', authHeader.slice(-8));
      console.log('Auth base64 length:', authHeader.length - 'Basic '.length);
    }

    const fetchWithFallback = async (primaryUrl, fallbackUrl) => {
      const primaryResponse = await fetch(primaryUrl, {
        headers: {
          'Authorization': authHeader,
        },
      });

      const contentType = primaryResponse.headers.get('content-type') || '';
      if (primaryResponse.status === 404 && contentType.includes('text/html') && fallbackUrl) {
        console.log('Primary REST route returned HTML 404, trying fallback:', fallbackUrl);
        return fetch(fallbackUrl, {
          headers: {
            'Authorization': authHeader,
          },
        });
      }

      return primaryResponse;
    };

    // 1. Get all menus
    const menusUrl = `${wordpressUrl}/wp-json/wp/v2/menus`;
    const menusFallbackUrl = `${wordpressUrl}/?rest_route=/wp/v2/menus`;
    console.log('WP menus URL:', menusUrl);
    const menusResponse = await fetchWithFallback(menusUrl, menusFallbackUrl);

    if (!menusResponse.ok) {
      const errorData = await menusResponse.text();
      console.error('Menus fetch status:', menusResponse.status, menusResponse.statusText);
      console.error('Menus fetch content-type:', menusResponse.headers.get('content-type'));
      console.error('Menus fetch error (first 500 chars):', errorData.slice(0, 500));
      throw new Error(`Failed to fetch menus: ${menusResponse.status} ${menusResponse.statusText}. Details: ${errorData}`);
    }

    const menus = await menusResponse.json();

    // 2. Find the menu named "文章分類"
    const articleMenu = menus.find(menu => menu.name === '文章分類');

    if (!articleMenu) {
      console.error('Menu "文章分類" not found. Using backup menu items.');
      return new Response(JSON.stringify({
        success: true,
        fallback: true,
        reason: 'Menu "文章分類" not found',
        availableMenus: menus.map(m => m.name),
        items: BACKUP_MENU_ITEMS,
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      });
    }

    // 3. Get all menu items for this menu
    const itemsUrl = `${wordpressUrl}/wp-json/wp/v2/menu-items?menus=${articleMenu.id}`;
    const itemsFallbackUrl = `${wordpressUrl}/?rest_route=/wp/v2/menu-items&menus=${articleMenu.id}`;
    console.log('WP menu items URL:', itemsUrl);
    const itemsResponse = await fetchWithFallback(itemsUrl, itemsFallbackUrl);

    if (!itemsResponse.ok) {
      const errorData = await itemsResponse.text();
      console.error('Menu items fetch status:', itemsResponse.status, itemsResponse.statusText);
      console.error('Menu items fetch content-type:', itemsResponse.headers.get('content-type'));
      console.error('Menu items fetch error (first 500 chars):', errorData.slice(0, 500));
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
      success: true,
      fallback: true,
      reason: error.message,
      items: BACKUP_MENU_ITEMS,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  }
}
