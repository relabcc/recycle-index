<?php
/**
 * WordPress Menu API
 * Fetches menu items from WordPress REST API
 */

// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            putenv($line);
            list($key, $value) = explode('=', $line, 2);
            $_ENV[$key] = $value;
        }
    }
}

// Set standard headers and handle CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Get environment variables
    $wordpressUrl = trim($_ENV['WORDPRESS_URL'] ?? getenv('WORDPRESS_URL'), '"\'');
    $wordpressUsername = trim($_ENV['WORDPRESS_USERNAME'] ?? getenv('WORDPRESS_USERNAME'), '"\'');
    $wordpressPassword = trim($_ENV['WORDPRESS_PASSWORD'] ?? getenv('WORDPRESS_PASSWORD'), '"\'');

    if (empty($wordpressUrl)) {
        throw new Exception('WordPress URL not configured');
    }

    // 1. Fetch all menus
    $menusUrl = $wordpressUrl . '/wp-json/wp/v2/menus';
    $authHeader = '';

    if (!empty($wordpressUsername) && !empty($wordpressPassword)) {
        $authHeader = 'Authorization: Basic ' . base64_encode($wordpressUsername . ':' . $wordpressPassword);
    }

    $menusResponse = fetchUrl($menusUrl, $authHeader);

    if (empty($menusResponse)) {
        throw new Exception('Failed to fetch menus from WordPress');
    }

    $menus = json_decode($menusResponse, true);

    if (!is_array($menus)) {
        $errorData = json_decode($menusResponse, true);
        $errorMessage = isset($errorData['message']) ? $errorData['message'] : 'Unknown error';
        throw new Exception('Failed to fetch menus: ' . $errorMessage);
    }

    // 2. Find the menu named "文章分類"
    $articleMenu = null;
    foreach ($menus as $menu) {
        if ($menu['name'] === '文章分類') {
            $articleMenu = $menu;
            break;
        }
    }

    if (empty($articleMenu)) {
        $availableMenus = array_map(function($m) { return $m['name']; }, $menus);
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'fallback' => true,
            'reason' => 'Menu "文章分類" not found',
            'availableMenus' => $availableMenus,
            'items' => getBackupMenuItems($wordpressUrl),
        ]);
        exit;
    }

    // 3. Fetch menu items for this menu
    $menuId = $articleMenu['id'];
    $itemsUrl = $wordpressUrl . '/wp-json/wp/v2/menu-items?menus=' . $menuId;

    $itemsResponse = fetchUrl($itemsUrl, $authHeader);

    if (empty($itemsResponse)) {
        throw new Exception('Failed to fetch menu items from WordPress');
    }

    $items = json_decode($itemsResponse, true);

    if (!is_array($items)) {
        $errorData = json_decode($itemsResponse, true);
        $errorMessage = isset($errorData['message']) ? $errorData['message'] : 'Unknown error';
        throw new Exception('Failed to fetch menu items: ' . $errorMessage);
    }

    // 4. Transform menu items to the format we need
    $menuItems = [];
    foreach ($items as $item) {
        $menuItems[] = [
            'name' => $item['title']['rendered'] ?? 'Untitled',
            'href' => $item['url'] ?? '#',
            'isExternal' => false,
        ];
    }

    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'items' => $menuItems,
    ]);

} catch (Exception $e) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'fallback' => true,
        'reason' => $e->getMessage(),
        'items' => getBackupMenuItems($wordpressUrl ?? ''),
    ]);
}

function getBackupMenuItems($wordpressUrl) {
    $baseUrl = rtrim((string)$wordpressUrl, '/');

    return [
        [
            'name' => '家庭－居家生活',
            'href' => $baseUrl . '/category/home/',
            'isExternal' => false,
        ],
        [
            'name' => '家庭－廚房',
            'href' => $baseUrl . '/category/kitchen/',
            'isExternal' => false,
        ],
        [
            'name' => '家庭－衛浴',
            'href' => $baseUrl . '/category/bathroom/',
            'isExternal' => false,
        ],
        [
            'name' => '環保知識',
            'href' => $baseUrl . '/category/knowledge/',
            'isExternal' => false,
        ],
        [
            'name' => '辦公室',
            'href' => $baseUrl . '/category/office/',
            'isExternal' => false,
        ],
        [
            'name' => '餐廳/夜市',
            'href' => $baseUrl . '/category/restarunt/',
            'isExternal' => false,
        ],
    ];
}

/**
 * Fetch content from URL with optional authentication
 */
function fetchUrl($url, $authHeader = '') {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => 'User-Agent: Mozilla/5.0' . ($authHeader ? "\r\n" . $authHeader : ''),
            'timeout' => 10,
        ],
    ]);

    $response = @file_get_contents($url, false, $context);

    if ($response === false) {
        // Get the HTTP response code
        if (!empty($http_response_header)) {
            $headerLine = $http_response_header[0];
            preg_match('{HTTP/? *(\d+\.?\d*) *(\d{3})}', $headerLine, $matches);
            $httpCode = isset($matches[2]) ? intval($matches[2]) : 0;

            if ($httpCode === 403) {
                throw new Exception('Failed to fetch: 403 Forbidden - User does not have permission to view menus');
            } elseif ($httpCode === 401) {
                throw new Exception('Failed to fetch: 401 Unauthorized - Check WordPress credentials');
            } elseif ($httpCode === 404) {
                throw new Exception('Failed to fetch: 404 Not Found - WordPress endpoint not available');
            } else {
                throw new Exception('Failed to fetch URL: HTTP ' . $httpCode);
            }
        }
        throw new Exception('Failed to fetch URL: ' . $url);
    }

    return $response;
}
?>
