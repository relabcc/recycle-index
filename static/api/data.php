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

    // Define processor function for info data
    $processInfoData = function($responseData) {
        if (empty($responseData['values']) || empty($responseData['values'][0]) || !isset($responseData['values'][0][0])) {
            throw new Exception('No data returned from spreadsheet');
        }

        // Since INFO_SHEET_RANGE is "info!A2:A2", we expect a single cell value
        $infoText = $responseData['values'][0][0];
        return ['info' => $infoText];
    };

    // Fetch and process the sheet data
    $result = $sheetsService->getSheetData($range, $processInfoData);

    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'details' => $e->getTraceAsString()
    ]);
}
?>
