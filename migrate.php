<?php
/**
 * Migration Script - Run once then DELETE this file!
 * Access via: https://daftar.mambaulhuda.ponpes.id/migrate.php?key=fix2026
 */

// Simple security - remove after use
if (($_GET['key'] ?? '') !== 'fix2026') {
    die('Unauthorized. Use ?key=fix2026');
}

echo "<pre>\n";
echo "=== SPMB Database Migration ===\n\n";

try {
    // Read DB config directly (avoid including config.php which triggers session/redirect)
    $configFile = file_get_contents(__DIR__ . '/api/config.php');
    preg_match("/define\('DB_HOST',\s*'(.+?)'\)/", $configFile, $m1);
    preg_match("/define\('DB_USER',\s*'(.+?)'\)/", $configFile, $m2);
    preg_match("/define\('DB_PASS',\s*'(.*?)'\)/", $configFile, $m3);
    preg_match("/define\('DB_NAME',\s*'(.+?)'\)/", $configFile, $m4);

    $conn = new mysqli($m1[1] ?? 'localhost', $m2[1] ?? 'root', $m3[1] ?? '', $m4[1] ?? 'spmb_db');
    if ($conn->connect_error) die("DB Error: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");
    echo "Connected to: " . ($m4[1] ?? 'spmb_db') . "\n\n";

    $migrations = [
        // 1. Add role column to admin
        [
            'check' => "SHOW COLUMNS FROM admin LIKE 'role'",
            'sql' => "ALTER TABLE admin ADD COLUMN role ENUM('super_admin','admin','panitia') NOT NULL DEFAULT 'panitia' AFTER nama",
            'desc' => 'Add role column to admin'
        ],
        [
            'check' => null,
            'sql' => "UPDATE admin SET role = 'super_admin' WHERE id = 1 AND role = 'panitia'",
            'desc' => 'Set admin id=1 as super_admin'
        ],

        // 2. Create missing tables
        [
            'check' => "SHOW TABLES LIKE 'perlengkapan_items'",
            'sql' => "CREATE TABLE IF NOT EXISTS perlengkapan_items (
                id int NOT NULL AUTO_INCREMENT,
                nama_item varchar(100) NOT NULL,
                nominal int NOT NULL DEFAULT 0,
                urutan int DEFAULT 0,
                aktif tinyint(1) DEFAULT 1,
                created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            'desc' => 'Create perlengkapan_items table'
        ],
        [
            'check' => "SHOW TABLES LIKE 'log_aktivitas'",
            'sql' => "CREATE TABLE IF NOT EXISTS log_aktivitas (
                id int NOT NULL AUTO_INCREMENT,
                user_id int DEFAULT NULL,
                user_name varchar(100) DEFAULT 'Admin',
                aksi varchar(50) NOT NULL,
                modul varchar(50) NOT NULL,
                detail text NOT NULL,
                created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            'desc' => 'Create log_aktivitas table'
        ],
        [
            'check' => "SHOW TABLES LIKE 'perlengkapan_pesanan'",
            'sql' => "CREATE TABLE IF NOT EXISTS perlengkapan_pesanan (
                id int NOT NULL AUTO_INCREMENT,
                pendaftaran_id int NOT NULL,
                perlengkapan_item_id int NOT NULL,
                status tinyint(1) DEFAULT 1,
                created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY unique_pesanan (pendaftaran_id, perlengkapan_item_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            'desc' => 'Create perlengkapan_pesanan table'
        ],
        [
            'check' => "SHOW TABLES LIKE 'transaksi_pemasukan'",
            'sql' => "CREATE TABLE IF NOT EXISTS transaksi_pemasukan (
                id int NOT NULL AUTO_INCREMENT,
                invoice varchar(50) NOT NULL,
                pendaftaran_id int NOT NULL,
                tanggal date NOT NULL,
                nominal int NOT NULL,
                jenis_pembayaran varchar(100) NOT NULL,
                keterangan text DEFAULT NULL,
                status enum('pending','approved','rejected') NOT NULL DEFAULT 'approved',
                created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY invoice (invoice)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            'desc' => 'Create transaksi_pemasukan table'
        ],
        [
            'check' => "SHOW TABLES LIKE 'transaksi_pengeluaran'",
            'sql' => "CREATE TABLE IF NOT EXISTS transaksi_pengeluaran (
                id int NOT NULL AUTO_INCREMENT,
                invoice varchar(50) NOT NULL,
                tanggal date NOT NULL,
                nominal int NOT NULL,
                kategori varchar(100) NOT NULL,
                keterangan text DEFAULT NULL,
                status enum('pending','approved','rejected') NOT NULL DEFAULT 'approved',
                created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY invoice (invoice)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            'desc' => 'Create transaksi_pengeluaran table'
        ],

        // 3. Add status to existing transaksi tables
        [
            'check' => "SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'transaksi_pemasukan' AND COLUMN_NAME = 'status'",
            'sql' => "ALTER TABLE transaksi_pemasukan ADD COLUMN status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'approved' AFTER keterangan",
            'desc' => 'Add status column to transaksi_pemasukan'
        ],
        [
            'check' => "SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'transaksi_pengeluaran' AND COLUMN_NAME = 'status'",
            'sql' => "ALTER TABLE transaksi_pengeluaran ADD COLUMN status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'approved' AFTER keterangan",
            'desc' => 'Add status column to transaksi_pengeluaran'
        ],

        // 4. Add approval columns to transaksi tables
        [
            'check' => "SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'transaksi_pemasukan' AND COLUMN_NAME = 'input_by'",
            'sql' => "ALTER TABLE transaksi_pemasukan ADD COLUMN input_by INT DEFAULT NULL AFTER status, ADD COLUMN input_at DATETIME DEFAULT NULL AFTER input_by, ADD COLUMN approved_by INT DEFAULT NULL AFTER input_at, ADD COLUMN approved_at DATETIME DEFAULT NULL AFTER approved_by, ADD COLUMN catatan_approval TEXT DEFAULT NULL AFTER approved_at",
            'desc' => 'Add approval columns to transaksi_pemasukan'
        ],
        [
            'check' => "SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'transaksi_pengeluaran' AND COLUMN_NAME = 'input_by'",
            'sql' => "ALTER TABLE transaksi_pengeluaran ADD COLUMN input_by INT DEFAULT NULL AFTER status, ADD COLUMN input_at DATETIME DEFAULT NULL AFTER input_by, ADD COLUMN approved_by INT DEFAULT NULL AFTER input_at, ADD COLUMN approved_at DATETIME DEFAULT NULL AFTER approved_by, ADD COLUMN catatan_approval TEXT DEFAULT NULL AFTER approved_at",
            'desc' => 'Add approval columns to transaksi_pengeluaran'
        ],

        // 5. Fix existing rows with NULL status
        [
            'check' => null,
            'sql' => "UPDATE transaksi_pemasukan SET status = 'approved' WHERE status IS NULL OR status = ''",
            'desc' => 'Fix NULL status in transaksi_pemasukan to approved'
        ],
        [
            'check' => null,
            'sql' => "UPDATE transaksi_pengeluaran SET status = 'approved' WHERE status IS NULL OR status = ''",
            'desc' => 'Fix NULL status in transaksi_pengeluaran to approved'
        ],
    ];

    foreach ($migrations as $m) {
        $skip = false;
        if ($m['check']) {
            $result = $conn->query($m['check']);
            if ($result && $result->num_rows > 0) {
                echo "SKIP: {$m['desc']} (already exists)\n";
                $skip = true;
            }
        }

        if (!$skip) {
            if ($conn->query($m['sql'])) {
                echo "OK: {$m['desc']}\n";
            } else {
                echo "ERROR: {$m['desc']} - " . $conn->error . "\n";
            }
        }
    }

    echo "\n=== Migration Complete ===\n";
    echo "\nDELETE THIS FILE after migration!\n";

    $conn->close();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
echo "</pre>";
