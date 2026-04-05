<?php
// =============================================
// Database Configuration - Local Development
// =============================================

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'spmb_db');

// Create connection
function getConnection()
{
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $conn->set_charset("utf8mb4");
    return $conn;
}

// Start session with cookie that expires on browser close
session_set_cookie_params([
    'lifetime' => 0, // Expires when browser closes
    'path' => '/',
    'secure' => false, // Set to true if using HTTPS
    'httponly' => true,
    'samesite' => 'Strict'
]);
session_start();

// Load shared functions (auth, CSRF, helpers, RBAC)
require_once __DIR__ . '/functions.php';
?>