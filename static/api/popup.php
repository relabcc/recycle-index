<?php
// Popup email submit endpoint -> WordPress Contact Form 7
// Configure via environment variables or edit defaults below.

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$wordpressUrl = getenv('WORDPRESS_URL') ?: '';
$formId = getenv('WORDPRESS_CF7_FORM_ID') ?: '353';
$defaultSubject = getenv('WORDPRESS_CF7_SUBJECT') ?: '新電子報訂閱';
$defaultName = getenv('WORDPRESS_CF7_NAME') ?: '訂閱會員';

if (!$wordpressUrl) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'WordPress URL not configured']);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
$email = isset($body['email']) ? trim($body['email']) : '';
$subject = isset($body['subject']) ? trim($body['subject']) : $defaultSubject;
$name = isset($body['name']) ? trim($body['name']) : $defaultName;
$unitTag = isset($body['unitTag']) ? trim($body['unitTag']) : 'wpcf7-f' . $formId . '-p0-o1';
$containerPost = isset($body['containerPost']) ? (string)$body['containerPost'] : '0';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid email']);
    exit;
}

$postFields = http_build_query([
    '_wpcf7' => (string)$formId,
    '_wpcf7_container_post' => $containerPost,
    '_wpcf7_unit_tag' => $unitTag,
    'your-email' => $email,
    'your-subject' => $subject,
    'your-name' => $name,
]);

$endpoint = rtrim($wordpressUrl, '/') . '/wp-json/contact-form-7/v1/contact-forms/' . $formId . '/feedback';

$ch = curl_init($endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
    'Accept: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);

$responseBody = curl_exec($ch);
$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

header('Content-Type: application/json');

if ($responseBody === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Request failed', 'details' => $curlError]);
    exit;
}

$responseData = json_decode($responseBody, true);
if ($responseData === null) {
    $responseData = ['raw' => $responseBody];
}

http_response_code($httpStatus ?: 200);
echo json_encode([
    'ok' => $httpStatus >= 200 && $httpStatus < 300,
    'status' => $httpStatus,
    'data' => $responseData,
]);
