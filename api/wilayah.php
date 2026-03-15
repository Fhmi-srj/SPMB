<?php
/**
 * API Wilayah Indonesia
 * Proxy untuk mengambil data wilayah dari API publik
 * Source: https://www.emsifa.com/api-wilayah-indonesia/
 */

header('Content-Type: application/json');

$type = $_GET['type'] ?? '';
$id = $_GET['id'] ?? '';

$baseUrl = 'https://www.emsifa.com/api-wilayah-indonesia/api';

$endpoints = [
    'provinsi' => '/provinces.json',
    'kota' => '/regencies/',
    'kecamatan' => '/districts/',
    'kelurahan' => '/villages/'
];

if (!array_key_exists($type, $endpoints)) {
    echo json_encode(['error' => 'Invalid type parameter']);
    exit;
}

// Build URL based on type
if ($type === 'provinsi') {
    $url = $baseUrl . $endpoints[$type];
} else {
    if (empty($id)) {
        echo json_encode(['error' => 'ID parameter required']);
        exit;
    }
    $url = $baseUrl . $endpoints[$type] . $id . '.json';
}

// Fetch data - try cURL first (works on most hosting), fallback to file_get_contents
$response = false;

if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_USERAGENT => 'Mozilla/5.0',
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode < 200 || $httpCode >= 300) {
        $response = false;
    }
}

if ($response === false) {
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'ignore_errors' => true
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);
    $response = @file_get_contents($url, false, $context);
}

if ($response === false) {
    echo json_encode(['error' => 'Failed to fetch data']);
    exit;
}

$data = json_decode($response, true);

if ($data === null) {
    echo json_encode(['error' => 'Invalid response from API']);
    exit;
}

echo json_encode($data);
?>