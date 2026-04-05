<?php
require_once '../api/config.php';
$conn = getConnection();
$hash = password_hash('admin123', PASSWORD_DEFAULT);
$stmt = $conn->prepare("UPDATE admin SET password = ? WHERE id = 1");
$stmt->bind_param("s", $hash);
$stmt->execute();
echo "Password untuk admin_spmb berhasil direset ke: admin123";
$conn->close();
