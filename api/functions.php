<?php
// =============================================
// Shared Functions (DO NOT edit DB credentials here)
// DB credentials are in config.php
// =============================================

// =============================================
// CSRF Protection
// =============================================

function generateCsrfToken()
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrfField()
{
    return '<input type="hidden" name="csrf_token" value="' . generateCsrfToken() . '">';
}

function validateCsrf()
{
    if (!isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $_POST['csrf_token']);
}

function requireCsrf()
{
    if (!validateCsrf()) {
        die('Invalid CSRF token. Please refresh the page and try again.');
    }
}

// =============================================
// Auth Functions
// =============================================

function isLoggedIn()
{
    return isset($_SESSION['admin_id']);
}

function requireLogin()
{
    if (!isLoggedIn()) {
        header('Location: index.php');
        exit;
    }
}

// =============================================
// Role-Based Access Control
// =============================================

function getRole()
{
    return $_SESSION['admin_role'] ?? 'panitia';
}

/**
 * Check if current user has one of the given roles
 * @param string|array $roles Single role or array of roles
 */
function hasRole($roles)
{
    if (is_string($roles)) {
        $roles = [$roles];
    }
    return in_array(getRole(), $roles);
}

/**
 * Require specific role(s) or redirect to dashboard
 * @param string|array $roles Single role or array of roles
 */
function requireRole($roles)
{
    requireLogin();
    if (!hasRole($roles)) {
        header('Location: dashboard.php');
        exit;
    }
}

/**
 * Shortcut: can access administrasi pages (non-panitia)
 */
function canAccessAdmin()
{
    return hasRole(['super_admin', 'admin']);
}

/**
 * Shortcut: is super admin
 */
function isSuperAdmin()
{
    return hasRole('super_admin');
}

// =============================================
// Helper Functions
// =============================================

function sanitize($conn, $input)
{
    return mysqli_real_escape_string($conn, trim($input));
}

function jsonResponse($success, $message, $data = null)
{
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

function getSetting($conn, $key)
{
    $stmt = $conn->prepare("SELECT nilai FROM pengaturan WHERE kunci = ?");
    $stmt->bind_param("s", $key);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    return $row ? $row['nilai'] : null;
}

function formatRupiah($number)
{
    return 'Rp' . number_format($number, 0, ',', '.');
}

// =============================================
// Activity Log
// =============================================

function logActivity($action, $description = '')
{
    if (!isLoggedIn())
        return;

    $conn = getConnection();
    $adminId = $_SESSION['admin_id'];
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

    $stmt = $conn->prepare("INSERT INTO activity_log (admin_id, action, description, ip_address) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $adminId, $action, $description, $ip);
    $stmt->execute();
    $stmt->close();
    $conn->close();
}
