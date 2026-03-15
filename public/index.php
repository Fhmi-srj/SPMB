<?php
/**
 * Front Controller for cPanel hosting
 * Domain document root points to public/, 
 * but the PHP app lives in the parent directory.
 * 
 * This script changes the working directory to the parent
 * and includes the appropriate PHP file based on the URL.
 */

// Change working directory to the parent (where the app lives)
chdir(dirname(__DIR__));

// Get the request URI path
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH);
$path = trim($path, '/');

// Route map: clean URL => PHP file
$routes = [
    ''               => 'index.php',
    'daftar'         => 'pendaftaran.php',
    'cek-status'     => 'cek-status.php',
    'data-pendaftar' => 'data-pendaftar.php',
    'kartu-peserta'  => 'kartu-peserta.php',
    'migrate.php'    => 'migrate.php',
    'debug.php'      => 'debug.php',
];

// Direct PHP file access (e.g., index.php, pendaftaran.php)
if (preg_match('/^[\w\-]+\.php$/', $path) && file_exists($path)) {
    require $path;
    exit;
}

// Clean URL routing
if (array_key_exists($path, $routes)) {
    require $routes[$path];
    exit;
}

// Admin routes
if (preg_match('#^admin(/.*)?$#', $path, $matches)) {
    $adminPath = 'admin' . ($matches[1] ?? '/index.php');
    if (is_dir($adminPath) || $adminPath === 'admin/') {
        $adminPath = 'admin/index.php';
    }
    if (file_exists($adminPath)) {
        require $adminPath;
        exit;
    }
}

// User routes
if (preg_match('#^user(/.*)?$#', $path, $matches)) {
    $userPath = 'user' . ($matches[1] ?? '/index.php');
    if (is_dir($userPath) || $userPath === 'user/') {
        $userPath = 'user/index.php';
    }
    if (file_exists($userPath)) {
        require $userPath;
        exit;
    }
}

// API routes
if (preg_match('#^api/(.+)$#', $path, $matches)) {
    $apiPath = 'api/' . $matches[1];
    if (file_exists($apiPath)) {
        require $apiPath;
        exit;
    }
}

// Static files in public/ - let Apache handle (this script won't reach here for existing files)
// If nothing matched, serve index.php as fallback
require 'index.php';
