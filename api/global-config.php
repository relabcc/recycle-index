<?php
/**
 * PHP API for Global Config
 * Handles fetching configuration from Google Sheets
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

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Configuration
$GOOGLE_SHEETS_API_KEY = 'YOUR_GOOGLE_SHEETS_API_KEY';
$SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// Google Sheets ranges for different configurations
$RANGES = [
    'popup' => 'Popup!A:Z',
    'countdown' => 'Countdown!A:Z',
];

function fetchGoogleSheet($spreadsheetId, $range, $apiKey) {
    $url = "https://sheets.googleapis.com/v4/spreadsheets/{$spreadsheetId}/values/{$range}?key={$apiKey}";
    
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => 'Content-Type: application/json',
            'timeout' => 30
        ]
    ]);
    
    $response = file_get_contents($url, false, $context);
    
    if ($response === FALSE) {
        error_log('Error fetching Google Sheet: ' . $url);
        return null;
    }
    
    return json_decode($response, true);
}

function parseSheetData($data, $type) {
    if (!$data || !isset($data['values']) || count($data['values']) < 2) {
        return null;
    }
    
    $headers = $data['values'][0];
    $rows = array_slice($data['values'], 1);
    $config = [];
    
    // Convert the first row of data to configuration object
    if (count($rows) > 0) {
        $row = $rows[0];
        foreach ($headers as $index => $header) {
            $value = isset($row[$index]) ? $row[$index] : '';
            if ($value !== '') {
                // Handle boolean values
                if (strtolower($value) === 'true' || strtolower($value) === 'false') {
                    $config[$header] = strtolower($value) === 'true';
                }
                // Handle numbers
                elseif (is_numeric($value)) {
                    $config[$header] = floatval($value);
                }
                // Handle strings
                else {
                    $config[$header] = $value;
                }
            }
        }
    }
    
    return $config;
}

try {
    // Fetch both popup and countdown configurations
    $popupData = fetchGoogleSheet($SPREADSHEET_ID, $RANGES['popup'], $GOOGLE_SHEETS_API_KEY);
    $countdownData = fetchGoogleSheet($SPREADSHEET_ID, $RANGES['countdown'], $GOOGLE_SHEETS_API_KEY);
    
    $config = [
        'popup' => parseSheetData($popupData, 'popup'),
        'countdown' => parseSheetData($countdownData, 'countdown'),
    ];
    
    echo json_encode($config);
} catch (Exception $e) {
    error_log('Error in global-config API: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>