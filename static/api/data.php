<?php
require_once __DIR__ . '/services/GoogleSheetsService.php';

// Set standard headers and handle CORS
GoogleSheetsService::setStandardHeaders();
GoogleSheetsService::handleCORS();

try {
    // Create service instance
    $sheetsService = new GoogleSheetsService();

    // Get the range from query parameters
    $range = $_GET['range'] ?? $_REQUEST['range'] ?? '';

    if (empty($range)) {
        throw new Exception('Range parameter is required. Usage: ?range=info!A2:A2');
    }

    // Define processor function for sheet data (compatible with JS version)
    $processSheetData = function($responseData) {
        if (empty($responseData['values'])) {
            throw new Exception('No data returned from spreadsheet');
        }

        // First row is the header
        $header = $responseData['values'][0];
        // Remaining rows are data
        $data = array_slice($responseData['values'], 1);

        // Convert each row to an associative array using header as keys
        $result = array_map(function($row) use ($header) {
            $obj = [];
            foreach ($header as $index => $key) {
                $obj[$key] = $row[$index] ?? '';
            }
            return $obj;
        }, $data);

        return $result;
    };

    // Fetch and process the sheet data
    $result = $sheetsService->getSheetData($range, $processSheetData);

    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'details' => $e->getTraceAsString()
    ]);
}
?>
