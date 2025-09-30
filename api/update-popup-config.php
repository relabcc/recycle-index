<?php
/**
 * PHP API for updating popup configuration
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get authorization header
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (!$authHeader || strpos($authHeader, 'Bearer ') !== 0) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$accessToken = substr($authHeader, 7);

// Verify Google OAuth token
$userResponse = file_get_contents(
    "https://www.googleapis.com/oauth2/v1/userinfo?access_token={$accessToken}",
    false,
    stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => 'Accept: application/json',
            'timeout' => 30
        ]
    ])
);

if ($userResponse === FALSE) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
    exit;
}

$userInfo = json_decode($userResponse, true);

// Check if user is authorized
$authorizedEmails = explode(',', $_ENV['AUTHORIZED_EMAILS'] ?? '');
if (!in_array($userInfo['email'], $authorizedEmails)) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

try {
    // Get the configuration from request body
    $input = file_get_contents('php://input');
    $config = json_decode($input, true);
    
    if (!$config) {
        throw new Exception('Invalid JSON data');
    }
    
    // Update Google Sheets
    $spreadsheetId = $_ENV['SPREADSHEET_ID'];
    $range = 'Popup!A1:Z2';
    
    // Prepare data for Google Sheets
    $headers = array_keys($config);
    $values = array_values($config);
    
    $updateData = [
        'range' => $range,
        'majorDimension' => 'ROWS',
        'values' => [$headers, $values]
    ];

    $context = stream_context_create([
        'http' => [
            'method' => 'PUT',
            'header' => [
                "Authorization: Bearer {$accessToken}",
                'Content-Type: application/json'
            ],
            'content' => json_encode($updateData),
            'timeout' => 30
        ]
    ]);

    $sheetsResponse = file_get_contents(
        "https://sheets.googleapis.com/v4/spreadsheets/{$spreadsheetId}/values/{$range}?valueInputOption=RAW",
        false,
        $context
    );

    if ($sheetsResponse === FALSE) {
        throw new Exception('Failed to update Google Sheets');
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    error_log('Error updating popup config: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>