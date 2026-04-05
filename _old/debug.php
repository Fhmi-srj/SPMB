<?php
/**
 * Debug Script - Shows actual PHP errors
 * Access via: https://daftar.mambaulhuda.ponpes.id/debug.php?key=fix2026
 */
if (($_GET['key'] ?? '') !== 'fix2026') {
    die('Unauthorized');
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<pre>\n=== SPMB Debug ===\n\n";

// 1. Test config
echo "1. Testing config...\n";
require_once __DIR__ . '/api/config.php';
echo "   ✅ Config loaded\n\n";

// 2. Test DB
echo "2. Testing database...\n";
$conn = getConnection();
echo "   ✅ Connected to database\n\n";

// 3. Test tables
echo "3. Testing tables...\n";
$tables = [
    'admin',
    'pendaftaran',
    'activity_log',
    'beasiswa',
    'biaya',
    'kontak',
    'pengaturan',
    'perlengkapan_items',
    'log_aktivitas',
    'perlengkapan_pesanan',
    'transaksi_pemasukan',
    'transaksi_pengeluaran'
];
foreach ($tables as $t) {
    $r = $conn->query("SELECT COUNT(*) as c FROM $t");
    if ($r) {
        echo "   ✅ $t (" . $r->fetch_assoc()['c'] . " rows)\n";
    } else {
        echo "   ❌ $t: " . $conn->error . "\n";
    }
}

// 4. Test admin columns
echo "\n4. Admin table columns...\n";
$r = $conn->query("SHOW COLUMNS FROM admin");
while ($row = $r->fetch_assoc()) {
    echo "   - " . $row['Field'] . " (" . $row['Type'] . ")\n";
}

// 5. Test transaksi columns
echo "\n5. transaksi_pemasukan columns...\n";
$r = $conn->query("SHOW COLUMNS FROM transaksi_pemasukan");
while ($row = $r->fetch_assoc()) {
    echo "   - " . $row['Field'] . " (" . $row['Type'] . ")\n";
}

echo "\n6. transaksi_pengeluaran columns...\n";
$r = $conn->query("SHOW COLUMNS FROM transaksi_pengeluaran");
while ($row = $r->fetch_assoc()) {
    echo "   - " . $row['Field'] . " (" . $row['Type'] . ")\n";
}

// 6. Test the actual dashboard queries
echo "\n7. Testing dashboard queries...\n";

try {
    $r = $conn->query("SELECT COUNT(*) as total FROM pendaftaran");
    echo "   ✅ Total pendaftar: " . $r->fetch_assoc()['total'] . "\n";
} catch (Exception $e) {
    echo "   ❌ " . $e->getMessage() . "\n";
}

try {
    $r = $conn->query("
        SELECT 
            SUM(CASE WHEN p.status_mukim = 'PONDOK PP MAMBAUL HUDA' THEN 
                (SELECT COALESCE(biaya_pondok, 0) FROM biaya WHERE nama_item = 'Registrasi' AND kategori = 'PENDAFTARAN' LIMIT 1)
            ELSE 0 END) as total_registrasi
        FROM pendaftaran p
        LEFT JOIN (SELECT pendaftaran_id, SUM(nominal) as total_pembayaran FROM transaksi_pemasukan WHERE status = 'approved' GROUP BY pendaftaran_id) tp ON p.id = tp.pendaftaran_id
    ");
    echo "   ✅ Pemasukan query OK\n";
} catch (Exception $e) {
    echo "   ❌ Pemasukan query: " . $e->getMessage() . "\n";
}

try {
    $r = $conn->query("SELECT kategori, SUM(nominal) as total FROM transaksi_pengeluaran WHERE status = 'approved' GROUP BY kategori");
    echo "   ✅ Pengeluaran query OK\n";
} catch (Exception $e) {
    echo "   ❌ Pengeluaran query: " . $e->getMessage() . "\n";
}

// 7. Try to include dashboard
echo "\n8. Testing dashboard include...\n";
echo "   Attempting to load dashboard.php...\n";

$conn->close();
echo "\n=== Debug Complete ===\n";
echo "\n⚠️  DELETE THIS FILE!\n</pre>";
