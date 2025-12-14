<?php
/**
 * PHP API for image upload (alternative to Cloudflare R2)
 * Uploads images to local server directory
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
    // Check if file was uploaded
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('No file provided or upload error');
    }
    
    $file = $_FILES['image'];
    
    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $fileInfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($fileInfo, $file['tmp_name']);
    finfo_close($fileInfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        throw new Exception('Invalid file type');
    }
    
    // Validate file size (max 5MB)
    $maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if ($file['size'] > $maxSize) {
        throw new Exception('File too large');
    }
    
    // Create upload directory if it doesn't exist
    $uploadDir = '../uploads/admin-images/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = time() . '-' . uniqid() . '.' . $extension;
    $targetPath = $uploadDir . $filename;
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception('Failed to save file');
    }
    
    // Generate public URL
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $publicUrl = "{$protocol}://{$host}/uploads/admin-images/{$filename}";
    
    echo json_encode([
        'success' => true,
        'url' => $publicUrl,
        'filename' => $filename
    ]);
} catch (Exception $e) {
    error_log('Error uploading image: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>