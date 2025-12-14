<?php

/**
 * Google Sheets API service for PHP
 * Handles authentication and data fetching from Google Sheets
 */
class GoogleSheetsService {
    private $clientEmail;
    private $privateKey;
    private $spreadsheetId;

    public function __construct() {
        $this->loadEnvironmentVariables();
        $this->clientEmail = trim($_ENV['GOOGLE_CLIENT_EMAIL'] ?? getenv('GOOGLE_CLIENT_EMAIL'), '"\'');
        $this->privateKey = trim($_ENV['GOOGLE_PRIVATE_KEY'] ?? getenv('GOOGLE_PRIVATE_KEY'), '"\'');
        $this->spreadsheetId = trim($_ENV['SHEET_ID'] ?? getenv('SHEET_ID'), '"\'');

        if (empty($this->clientEmail) || empty($this->privateKey) || empty($this->spreadsheetId)) {
            throw new Exception('Missing required Google Sheets environment variables');
        }

        // 處理私鑰格式
        $this->privateKey = str_replace('\\n', "\n", $this->privateKey);
        $this->privateKey = trim($this->privateKey, '"\'');
        $this->privateKey = str_replace(['\n', '\\n'], "\n", $this->privateKey);
    }

    /**
     * Load environment variables from .env file
     */
    private function loadEnvironmentVariables() {
        if (file_exists(__DIR__ . '/../.env')) {
            $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                    putenv($line);
                    list($key, $value) = explode('=', $line, 2);
                    $_ENV[$key] = $value;
                }
            }
        }
    }

    /**
     * Base64URL encode function
     */
    private function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Create and sign a JWT token for Google API authentication
     */
    private function createJWT() {
        $now = time();
        $header = [
            'alg' => 'RS256',
            'typ' => 'JWT'
        ];

        $claim = [
            'iss' => $this->clientEmail,
            'scope' => 'https://www.googleapis.com/auth/spreadsheets.readonly',
            'aud' => 'https://oauth2.googleapis.com/token',
            'exp' => $now + 3600,
            'iat' => $now
        ];

        $encodedHeader = $this->base64url_encode(json_encode($header));
        $encodedClaim = $this->base64url_encode(json_encode($claim));
        $signatureInput = "$encodedHeader.$encodedClaim";

        // 簽署 JWT
        $signature = '';
        if (!openssl_sign($signatureInput, $signature, $this->privateKey, OPENSSL_ALGO_SHA256)) {
            throw new Exception('JWT signing failed');
        }

        $encodedSignature = $this->base64url_encode($signature);
        return "$signatureInput.$encodedSignature";
    }

    /**
     * Get Google OAuth access token using JWT
     */
    private function getAccessToken($jwt) {
        $tokenData = http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt
        ]);

        $tokenContext = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/x-www-form-urlencoded',
                'content' => $tokenData
            ]
        ]);

        $tokenResponse = file_get_contents('https://oauth2.googleapis.com/token', false, $tokenContext);
        if ($tokenResponse === false) {
            $error = error_get_last();
            throw new Exception('Failed to get access token: ' . ($error['message'] ?? 'Unknown error'));
        }

        $tokenData = json_decode($tokenResponse, true);
        return $tokenData['access_token'];
    }

    /**
     * Fetch data from Google Sheets
     */
    private function fetchSheetData($accessToken, $range) {
        $sheetsUrl = "https://sheets.googleapis.com/v4/spreadsheets/{$this->spreadsheetId}/values/" . urlencode($range);
        $sheetsContext = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => "Authorization: Bearer $accessToken"
            ]
        ]);

        $sheetsResponse = file_get_contents($sheetsUrl, false, $sheetsContext);
        if ($sheetsResponse === false) {
            throw new Exception('Failed to fetch spreadsheet data');
        }

        return json_decode($sheetsResponse, true);
    }

    /**
     * Main service function to fetch and process Google Sheets data
     * @param string $range - Sheet range to fetch
     * @param callable $processor - Function to process the raw sheet data
     * @return mixed Processed data
     */
    public function getSheetData($range, $processor) {
        // Create JWT and get access token
        $jwt = $this->createJWT();
        $accessToken = $this->getAccessToken($jwt);

        // Fetch spreadsheet data
        $responseData = $this->fetchSheetData($accessToken, $range);

        // Process the data using the provided processor function
        return $processor($responseData);
    }

    /**
     * Set standard CORS headers
     */
    public static function setCORSHeaders() {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }

    /**
     * Handle CORS preflight requests
     * @return bool True if CORS preflight was handled, false otherwise
     */
    public static function handleCORS() {
        self::setCORSHeaders();
        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            header('Access-Control-Max-Age: 600');
            http_response_code(204);
            exit;
        }
        
        return false;
    }

    /**
     * Set standard headers for API responses
     */
    public static function setStandardHeaders() {
        header('Content-Type: application/json');
        header('Cache-Control: public, max-age=86400'); // 24 小時快取
        self::setCORSHeaders();
    }
}