<?php
require_once '../api/config.php';
requireRole(['super_admin', 'admin']);

$conn = getConnection();
$message = '';
$error = '';

// Wrapper function for transaction logging
function logTransaksi($conn, $aksi, $modul, $detail)
{
    $user_name = $_SESSION['username'] ?? 'Admin';
    $stmt = $conn->prepare("INSERT INTO log_aktivitas (user_name, aksi, modul, detail) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $user_name, $aksi, $modul, $detail);
    $stmt->execute();
}

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'add_pemasukan') {
        $pendaftaran_id = intval($_POST['pendaftaran_id']);
        $tanggal = sanitize($conn, $_POST['tanggal']);
        $nominal = intval($_POST['nominal']);
        $jenis_pembayaran = sanitize($conn, $_POST['jenis_pembayaran']);
        $keterangan = sanitize($conn, $_POST['keterangan'] ?? '');

        // Generate invoice
        $invoice = 'INV-IN-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

        // Get registrant name for logging
        $pendaftarData = $conn->query("SELECT nama FROM pendaftaran WHERE id = $pendaftaran_id")->fetch_assoc();
        $namaPendaftar = $pendaftarData['nama'] ?? 'Unknown';

        // Determine status based on role
        $inputBy = $_SESSION['admin_id'];
        $inputAt = date('Y-m-d H:i:s');
        if (isSuperAdmin()) {
            $status = 'approved';
            $approvedBy = $_SESSION['admin_id'];
            $approvedAt = date('Y-m-d H:i:s');
        } else {
            $status = 'pending';
            $approvedBy = null;
            $approvedAt = null;
        }

        $stmt = $conn->prepare("INSERT INTO transaksi_pemasukan (invoice, pendaftaran_id, tanggal, nominal, jenis_pembayaran, keterangan, status, input_by, input_at, approved_by, approved_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sisisssisis", $invoice, $pendaftaran_id, $tanggal, $nominal, $jenis_pembayaran, $keterangan, $status, $inputBy, $inputAt, $approvedBy, $approvedAt);

        if ($stmt->execute()) {
            $statusLabel = $status === 'approved' ? '' : ' (Menunggu ACC)';
            $message = 'Pemasukan berhasil ditambahkan!' . $statusLabel;
            logTransaksi($conn, 'CREATE', 'PEMASUKAN', "Tambah pemasukan $namaPendaftar - Rp" . number_format($nominal, 0, ',', '.') . $statusLabel);
        } else {
            $error = 'Gagal menambahkan pemasukan: ' . $conn->error;
        }
    }

    if ($action === 'edit_pemasukan') {
        $id = intval($_POST['id']);
        $pendaftaran_id = intval($_POST['pendaftaran_id']);
        $tanggal = sanitize($conn, $_POST['tanggal']);
        $nominal = intval($_POST['nominal']);
        $jenis_pembayaran = sanitize($conn, $_POST['jenis_pembayaran']);
        $keterangan = sanitize($conn, $_POST['keterangan'] ?? '');

        // Get registrant name for logging
        $pendaftarData = $conn->query("SELECT nama FROM pendaftaran WHERE id = $pendaftaran_id")->fetch_assoc();
        $namaPendaftar = $pendaftarData['nama'] ?? 'Unknown';

        $stmt = $conn->prepare("UPDATE transaksi_pemasukan SET pendaftaran_id=?, tanggal=?, nominal=?, jenis_pembayaran=?, keterangan=? WHERE id=?");
        $stmt->bind_param("isissi", $pendaftaran_id, $tanggal, $nominal, $jenis_pembayaran, $keterangan, $id);

        if ($stmt->execute()) {
            $message = 'Pemasukan berhasil diupdate!';
            logTransaksi($conn, 'UPDATE', 'PEMASUKAN', "Edit pemasukan $namaPendaftar - Rp" . number_format($nominal, 0, ',', '.'));
        } else {
            $error = 'Gagal mengupdate pemasukan!';
        }
    }

    if ($action === 'add_pengeluaran') {
        $tanggal = sanitize($conn, $_POST['tanggal']);
        $nominal = intval($_POST['nominal']);
        $kategori = sanitize($conn, $_POST['kategori']);
        $keterangan = sanitize($conn, $_POST['keterangan'] ?? '');

        // Generate invoice
        $invoice = 'INV-OUT-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

        // Determine status based on role
        $inputBy = $_SESSION['admin_id'];
        $inputAt = date('Y-m-d H:i:s');
        if (isSuperAdmin()) {
            $status = 'approved';
            $approvedBy = $_SESSION['admin_id'];
            $approvedAt = date('Y-m-d H:i:s');
        } else {
            $status = 'pending';
            $approvedBy = null;
            $approvedAt = null;
        }

        $stmt = $conn->prepare("INSERT INTO transaksi_pengeluaran (invoice, tanggal, nominal, kategori, keterangan, status, input_by, input_at, approved_by, approved_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssisssisis", $invoice, $tanggal, $nominal, $kategori, $keterangan, $status, $inputBy, $inputAt, $approvedBy, $approvedAt);

        if ($stmt->execute()) {
            $statusLabel = $status === 'approved' ? '' : ' (Menunggu ACC)';
            $message = 'Pengeluaran berhasil ditambahkan!' . $statusLabel;
            logTransaksi($conn, 'CREATE', 'PENGELUARAN', "Tambah pengeluaran $invoice - Rp" . number_format($nominal, 0, ',', '.') . " ($kategori)" . $statusLabel);
        } else {
            $error = 'Gagal menambahkan pengeluaran: ' . $conn->error;
        }
    }

    if ($action === 'edit_pengeluaran') {
        $id = intval($_POST['id']);
        $tanggal = sanitize($conn, $_POST['tanggal']);
        $nominal = intval($_POST['nominal']);
        $kategori = sanitize($conn, $_POST['kategori']);
        $keterangan = sanitize($conn, $_POST['keterangan'] ?? '');

        // Get old data for logging
        $oldData = $conn->query("SELECT invoice FROM transaksi_pengeluaran WHERE id = $id")->fetch_assoc();

        $stmt = $conn->prepare("UPDATE transaksi_pengeluaran SET tanggal=?, nominal=?, kategori=?, keterangan=? WHERE id=?");
        $stmt->bind_param("sissi", $tanggal, $nominal, $kategori, $keterangan, $id);

        if ($stmt->execute()) {
            $message = 'Pengeluaran berhasil diupdate!';
            logTransaksi($conn, 'UPDATE', 'PENGELUARAN', "Edit pengeluaran " . $oldData['invoice'] . " - Rp" . number_format($nominal, 0, ',', '.') . " ($kategori)");
        } else {
            $error = 'Gagal mengupdate pengeluaran!';
        }
    }

    if ($action === 'delete_pemasukan') {
        $id = intval($_POST['id']);

        // Get data for logging before delete
        $data = $conn->query("
            SELECT tp.nominal, p.nama 
            FROM transaksi_pemasukan tp
            JOIN pendaftaran p ON tp.pendaftaran_id = p.id
            WHERE tp.id = $id
        ")->fetch_assoc();

        $stmt = $conn->prepare("DELETE FROM transaksi_pemasukan WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            $message = 'Pemasukan berhasil dihapus!';
            $namaPendaftar = $data['nama'] ?? 'Unknown';
            logTransaksi($conn, 'DELETE', 'PEMASUKAN', "Hapus pemasukan $namaPendaftar - Rp" . number_format($data['nominal'], 0, ',', '.'));
        } else {
            $error = 'Gagal menghapus pemasukan!';
        }
    }

    if ($action === 'delete_pengeluaran') {
        $id = intval($_POST['id']);

        // Get data for logging before delete
        $data = $conn->query("SELECT invoice, nominal, kategori FROM transaksi_pengeluaran WHERE id = $id")->fetch_assoc();

        $stmt = $conn->prepare("DELETE FROM transaksi_pengeluaran WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            $message = 'Pengeluaran berhasil dihapus!';
            logTransaksi($conn, 'DELETE', 'PENGELUARAN', "Hapus pengeluaran " . $data['invoice'] . " - Rp" . number_format($data['nominal'], 0, ',', '.') . " (" . $data['kategori'] . ")");
        } else {
            $error = 'Gagal menghapus pengeluaran!';
        }
    }

    // Approve pemasukan
    if ($action === 'approve_pemasukan') {
        $id = intval($_POST['id']);
        $stmt = $conn->prepare("UPDATE transaksi_pemasukan SET status = 'approved', approved_by = ?, approved_at = NOW() WHERE id = ?");
        $stmt->bind_param("ii", $_SESSION['admin_id'], $id);
        if ($stmt->execute()) {
            $data = $conn->query("SELECT tp.nominal, p.nama FROM transaksi_pemasukan tp JOIN pendaftaran p ON tp.pendaftaran_id = p.id WHERE tp.id = $id")->fetch_assoc();
            $message = 'Pemasukan berhasil di-ACC!';
            logTransaksi($conn, 'APPROVE', 'PEMASUKAN', "ACC pemasukan " . ($data['nama'] ?? '') . " - Rp" . number_format($data['nominal'] ?? 0, 0, ',', '.'));
        } else {
            $error = 'Gagal meng-ACC pemasukan!';
        }
    }

    // Reject pemasukan
    if ($action === 'reject_pemasukan') {
        $id = intval($_POST['id']);
        $catatan = sanitize($conn, $_POST['catatan_approval'] ?? '');
        $stmt = $conn->prepare("UPDATE transaksi_pemasukan SET status = 'rejected', approved_by = ?, approved_at = NOW(), catatan_approval = ? WHERE id = ?");
        $stmt->bind_param("isi", $_SESSION['admin_id'], $catatan, $id);
        if ($stmt->execute()) {
            $message = 'Pemasukan ditolak.';
            logTransaksi($conn, 'REJECT', 'PEMASUKAN', "Tolak pemasukan ID $id" . ($catatan ? ": $catatan" : ''));
        } else {
            $error = 'Gagal menolak pemasukan!';
        }
    }

    // Approve pengeluaran
    if ($action === 'approve_pengeluaran') {
        $id = intval($_POST['id']);
        $stmt = $conn->prepare("UPDATE transaksi_pengeluaran SET status = 'approved', approved_by = ?, approved_at = NOW() WHERE id = ?");
        $stmt->bind_param("ii", $_SESSION['admin_id'], $id);
        if ($stmt->execute()) {
            $data = $conn->query("SELECT invoice, nominal FROM transaksi_pengeluaran WHERE id = $id")->fetch_assoc();
            $message = 'Pengeluaran berhasil di-ACC!';
            logTransaksi($conn, 'APPROVE', 'PENGELUARAN', "ACC pengeluaran " . ($data['invoice'] ?? '') . " - Rp" . number_format($data['nominal'] ?? 0, 0, ',', '.'));
        } else {
            $error = 'Gagal meng-ACC pengeluaran!';
        }
    }

    // Reject pengeluaran
    if ($action === 'reject_pengeluaran') {
        $id = intval($_POST['id']);
        $catatan = sanitize($conn, $_POST['catatan_approval'] ?? '');
        $stmt = $conn->prepare("UPDATE transaksi_pengeluaran SET status = 'rejected', approved_by = ?, approved_at = NOW(), catatan_approval = ? WHERE id = ?");
        $stmt->bind_param("isi", $_SESSION['admin_id'], $catatan, $id);
        if ($stmt->execute()) {
            $message = 'Pengeluaran ditolak.';
            logTransaksi($conn, 'REJECT', 'PENGELUARAN', "Tolak pengeluaran ID $id" . ($catatan ? ": $catatan" : ''));
        } else {
            $error = 'Gagal menolak pengeluaran!';
        }
    }
}

// Get filter parameters
$filterPeriode = $_GET['periode'] ?? 'semua';
$filterNama = $_GET['nama'] ?? '';
$filterJenis = $_GET['jenis'] ?? '';
$filterKategori = $_GET['kategori'] ?? '';

// Build date filter
$dateFilter = '';
switch ($filterPeriode) {
    case 'hari_ini':
        $dateFilter = " AND tanggal = CURDATE()";
        break;
    case 'minggu_ini':
        $dateFilter = " AND YEARWEEK(tanggal, 1) = YEARWEEK(CURDATE(), 1)";
        break;
    case 'bulan_ini':
        $dateFilter = " AND YEAR(tanggal) = YEAR(CURDATE()) AND MONTH(tanggal) = MONTH(CURDATE())";
        break;
}

// Get pemasukan data
$pemasukanQuery = "SELECT tp.*, p.nama, p.no_registrasi,
                   a_input.nama as input_nama, a_approve.nama as approve_nama
                   FROM transaksi_pemasukan tp
                   JOIN pendaftaran p ON tp.pendaftaran_id = p.id
                   LEFT JOIN admin a_input ON tp.input_by = a_input.id
                   LEFT JOIN admin a_approve ON tp.approved_by = a_approve.id
                   WHERE 1=1 $dateFilter";

if ($filterNama) {
    $pemasukanQuery .= " AND p.nama LIKE '%" . $conn->real_escape_string($filterNama) . "%'";
}
if ($filterJenis) {
    $pemasukanQuery .= " AND tp.jenis_pembayaran = '" . $conn->real_escape_string($filterJenis) . "'";
}

$pemasukanQuery .= " ORDER BY tp.tanggal DESC, tp.created_at DESC";
$pemasukanResult = $conn->query($pemasukanQuery);

// Get pengeluaran data
$pengeluaranQuery = "SELECT tp.*, a_input.nama as input_nama, a_approve.nama as approve_nama
                     FROM transaksi_pengeluaran tp
                     LEFT JOIN admin a_input ON tp.input_by = a_input.id
                     LEFT JOIN admin a_approve ON tp.approved_by = a_approve.id
                     WHERE 1=1 $dateFilter";

if ($filterKategori) {
    $pengeluaranQuery .= " AND tp.kategori = '" . $conn->real_escape_string($filterKategori) . "'";
}

$pengeluaranQuery .= " ORDER BY tp.tanggal DESC, tp.created_at DESC";
$pengeluaranResult = $conn->query($pengeluaranQuery);

// Calculate summary (approved + NULL status for backward compat with old data)
$summaryQuery = "
    SELECT 
        (SELECT COALESCE(SUM(nominal), 0) FROM transaksi_pemasukan WHERE (status = 'approved' OR status IS NULL) $dateFilter) as total_masuk,
        (SELECT COALESCE(SUM(nominal), 0) FROM transaksi_pengeluaran WHERE (status = 'approved' OR status IS NULL) $dateFilter) as total_keluar,
        (SELECT COUNT(*) FROM transaksi_pemasukan WHERE status = 'pending') as pending_masuk,
        (SELECT COUNT(*) FROM transaksi_pengeluaran WHERE status = 'pending') as pending_keluar
";
$summaryResult = $conn->query($summaryQuery);
$summary = $summaryResult->fetch_assoc();
$totalMasuk = $summary['total_masuk'];
$totalKeluar = $summary['total_keluar'];
$saldo = $totalMasuk - $totalKeluar;
$totalPending = $summary['pending_masuk'] + $summary['pending_keluar'];

// Get kategori list matching pos_keuangan columns
$kategoriList = ['Registrasi', 'MA', 'SMP', 'Pondok'];

// Add items from biaya (Seragam, Buku, etc)
$biayaItems = $conn->query("SELECT DISTINCT nama_item FROM biaya WHERE kategori = 'DAFTAR_ULANG' AND nama_item NOT IN ('Registrasi', 'Infaq Bulan Pertama') ORDER BY nama_item");
while ($item = $biayaItems->fetch_assoc()) {
    $kategoriList[] = $item['nama_item'];
}

// Add Perlengkapan and Lainnya
$kategoriList[] = 'Perlengkapan';
$kategoriList[] = 'Lainnya';

$pageTitle = 'Transaksi - Admin SPMB';
$currentPage = 'transaksi';
?>
<?php include 'includes/header.php'; ?>

<div class="admin-wrapper">
    <?php include 'includes/sidebar.php'; ?>

    <!-- Main Content -->
    <main class="main-content p-4 md:p-6">
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Transaksi Keuangan</h2>
            <p class="text-gray-500 text-sm">Kelola pemasukan dan pengeluaran SPMB</p>
        </div>

        <?php if ($message): ?>
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                <i class="fas fa-check-circle mr-2"></i>
                <?= $message ?>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <?= $error ?>
            </div>
        <?php endif; ?>

        <!-- Summary Boxes -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-green-100 text-sm mb-1">Total Pemasukan</p>
                        <h3 class="text-2xl font-bold">Rp
                            <?= number_format($totalMasuk, 0, ',', '.') ?>
                        </h3>
                    </div>
                    <div class="bg-white/20 p-3 rounded-lg">
                        <i class="fas fa-arrow-down text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-red-100 text-sm mb-1">Total Pengeluaran</p>
                        <h3 class="text-2xl font-bold">Rp
                            <?= number_format($totalKeluar, 0, ',', '.') ?>
                        </h3>
                    </div>
                    <div class="bg-white/20 p-3 rounded-lg">
                        <i class="fas fa-arrow-up text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-blue-100 text-sm mb-1">Saldo</p>
                        <h3 class="text-2xl font-bold">Rp
                            <?= number_format($saldo, 0, ',', '.') ?>
                        </h3>
                    </div>
                    <div class="bg-white/20 p-3 rounded-lg">
                        <i class="fas fa-wallet text-2xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter Periode -->
        <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
            <form method="GET" class="flex flex-wrap gap-2 items-center">
                <label class="text-sm font-medium text-gray-700">Periode:</label>
                <select name="periode"
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                    <option value="semua" <?= $filterPeriode === 'semua' ? 'selected' : '' ?>>Semua</option>
                    <option value="hari_ini" <?= $filterPeriode === 'hari_ini' ? 'selected' : '' ?>>Hari Ini</option>
                    <option value="minggu_ini" <?= $filterPeriode === 'minggu_ini' ? 'selected' : '' ?>>Minggu Ini</option>
                    <option value="bulan_ini" <?= $filterPeriode === 'bulan_ini' ? 'selected' : '' ?>>Bulan Ini</option>
                </select>
                <button type="submit"
                    class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    <i class="fas fa-filter mr-2"></i>Terapkan
                </button>
                <a href="transaksi.php"
                    class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    <i class="fas fa-redo"></i>
                </a>
            </form>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="border-b border-gray-200">
                <nav class="flex w-full">
                    <button onclick="switchTab('pemasukan')" id="tab-pemasukan"
                        class="tab-button flex-1 px-6 py-3 text-sm font-medium transition-all duration-200 bg-primary text-white border-b-2 border-primary">
                        <i class="fas fa-arrow-down mr-2"></i>Pemasukan
                    </button>
                    <button onclick="switchTab('pengeluaran')" id="tab-pengeluaran"
                        class="tab-button flex-1 px-6 py-3 text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 border-b-2 border-transparent">
                        <i class="fas fa-arrow-up mr-2"></i>Pengeluaran
                    </button>
                </nav>
            </div>

            <!-- Pemasukan Tab -->
            <div id="content-pemasukan" class="tab-content p-6">
                <button onclick="showModal('modalPemasukan')"
                    class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium mb-4 transition">
                    <i class="fas fa-plus mr-2"></i>Tambah Pemasukan
                </button>

                <!-- Pemasukan Table -->
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Input
                                </th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nominal
                                </th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status
                                </th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <?php while ($row = $pemasukanResult->fetch_assoc()): ?>
                                <tr class="hover:bg-gray-50 <?= $row['status'] === 'rejected' ? 'opacity-60' : '' ?>">
                                    <td class="px-4 py-3 text-sm font-mono text-gray-600">
                                        <?= htmlspecialchars($row['invoice']) ?>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-600">
                                        <div><?= date('d/m/Y', strtotime($row['tanggal'])) ?></div>
                                        <?php if ($row['input_nama']): ?>
                                            <div class="text-xs text-gray-400">oleh: <?= htmlspecialchars($row['input_nama']) ?>
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                    <td class="px-4 py-3 text-sm font-medium text-gray-800">
                                        <?= htmlspecialchars($row['nama']) ?>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-right font-semibold text-green-600">Rp
                                        <?= number_format($row['nominal'], 0, ',', '.') ?>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-600">
                                        <?= htmlspecialchars($row['jenis_pembayaran']) ?>
                                    </td>
                                    <td class="px-4 py-3 text-center">
                                        <?php
                                        $badgeClass = match ($row['status']) {
                                            'approved' => 'bg-green-100 text-green-700',
                                            'pending' => 'bg-yellow-100 text-yellow-700',
                                            'rejected' => 'bg-red-100 text-red-700',
                                            default => 'bg-gray-100 text-gray-700',
                                        };
                                        $badgeLabel = match ($row['status']) {
                                            'approved' => 'ACC',
                                            'pending' => 'Pending',
                                            'rejected' => 'Ditolak',
                                            default => $row['status'],
                                        };
                                        ?>
                                        <span
                                            class="inline-block px-2 py-1 text-xs font-semibold rounded-full <?= $badgeClass ?>"><?= $badgeLabel ?></span>
                                        <?php if ($row['status'] === 'approved' && $row['approved_at']): ?>
                                            <div class="text-xs text-gray-400 mt-1">
                                                <?= date('d/m/Y', strtotime($row['approved_at'])) ?>
                                            </div>
                                        <?php endif; ?>
                                        <?php if ($row['status'] === 'rejected' && $row['catatan_approval']): ?>
                                            <div class="text-xs text-red-500 mt-1">
                                                <?= htmlspecialchars($row['catatan_approval']) ?>
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                    <td class="px-4 py-3 text-center whitespace-nowrap">
                                        <?php if (isSuperAdmin() && $row['status'] === 'pending'): ?>
                                            <form method="POST" class="inline">
                                                <input type="hidden" name="action" value="approve_pemasukan">
                                                <input type="hidden" name="id" value="<?= $row['id'] ?>">
                                                <button type="submit" class="text-green-600 hover:text-green-800 mr-1"
                                                    title="ACC">
                                                    <i class="fas fa-check-circle"></i>
                                                </button>
                                            </form>
                                            <button onclick="rejectTransaksi(<?= $row['id'] ?>, 'pemasukan')"
                                                class="text-red-600 hover:text-red-800 mr-1" title="Tolak">
                                                <i class="fas fa-times-circle"></i>
                                            </button>
                                        <?php endif; ?>
                                        <?php if (isSuperAdmin()): ?>
                                            <button
                                                onclick="editPemasukan(<?= $row['id'] ?>, <?= $row['pendaftaran_id'] ?>, '<?= $row['tanggal'] ?>', <?= $row['nominal'] ?>, '<?= htmlspecialchars($row['jenis_pembayaran'], ENT_QUOTES) ?>', '<?= htmlspecialchars($row['keterangan'], ENT_QUOTES) ?>', '<?= htmlspecialchars($row['nama'], ENT_QUOTES) ?>')"
                                                class="text-blue-600 hover:text-blue-800 mr-1" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <form method="POST" class="inline"
                                                onsubmit="return confirm('Yakin ingin menghapus transaksi ini?')">
                                                <input type="hidden" name="action" value="delete_pemasukan">
                                                <input type="hidden" name="id" value="<?= $row['id'] ?>">
                                                <button type="submit" class="text-red-600 hover:text-red-800" title="Hapus">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </form>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pengeluaran Tab -->
            <div id="content-pengeluaran" class="tab-content p-6 hidden">
                <button onclick="showModal('modalPengeluaran')"
                    class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium mb-4 transition">
                    <i class="fas fa-plus mr-2"></i>Tambah Pengeluaran
                </button>

                <!-- Pengeluaran Table -->
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Input
                                </th>
                                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nominal
                                </th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori
                                </th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status
                                </th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <?php while ($row = $pengeluaranResult->fetch_assoc()): ?>
                                <tr class="hover:bg-gray-50 <?= $row['status'] === 'rejected' ? 'opacity-60' : '' ?>">
                                    <td class="px-4 py-3 text-sm font-mono text-gray-600">
                                        <?= htmlspecialchars($row['invoice']) ?>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-600">
                                        <div><?= date('d/m/Y', strtotime($row['tanggal'])) ?></div>
                                        <?php if ($row['input_nama']): ?>
                                            <div class="text-xs text-gray-400">oleh: <?= htmlspecialchars($row['input_nama']) ?>
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-right font-semibold text-red-600">Rp
                                        <?= number_format($row['nominal'], 0, ',', '.') ?>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-600">
                                        <?= htmlspecialchars($row['kategori']) ?>
                                    </td>
                                    <td class="px-4 py-3 text-center">
                                        <?php
                                        $badgeClass = match ($row['status']) {
                                            'approved' => 'bg-green-100 text-green-700',
                                            'pending' => 'bg-yellow-100 text-yellow-700',
                                            'rejected' => 'bg-red-100 text-red-700',
                                            default => 'bg-gray-100 text-gray-700',
                                        };
                                        $badgeLabel = match ($row['status']) {
                                            'approved' => 'ACC',
                                            'pending' => 'Pending',
                                            'rejected' => 'Ditolak',
                                            default => $row['status'],
                                        };
                                        ?>
                                        <span
                                            class="inline-block px-2 py-1 text-xs font-semibold rounded-full <?= $badgeClass ?>"><?= $badgeLabel ?></span>
                                        <?php if ($row['status'] === 'approved' && $row['approved_at']): ?>
                                            <div class="text-xs text-gray-400 mt-1">
                                                <?= date('d/m/Y', strtotime($row['approved_at'])) ?>
                                            </div>
                                        <?php endif; ?>
                                        <?php if ($row['status'] === 'rejected' && $row['catatan_approval']): ?>
                                            <div class="text-xs text-red-500 mt-1">
                                                <?= htmlspecialchars($row['catatan_approval']) ?>
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                    <td class="px-4 py-3 text-center whitespace-nowrap">
                                        <?php if (isSuperAdmin() && $row['status'] === 'pending'): ?>
                                            <form method="POST" class="inline">
                                                <input type="hidden" name="action" value="approve_pengeluaran">
                                                <input type="hidden" name="id" value="<?= $row['id'] ?>">
                                                <button type="submit" class="text-green-600 hover:text-green-800 mr-1"
                                                    title="ACC">
                                                    <i class="fas fa-check-circle"></i>
                                                </button>
                                            </form>
                                            <button onclick="rejectTransaksi(<?= $row['id'] ?>, 'pengeluaran')"
                                                class="text-red-600 hover:text-red-800 mr-1" title="Tolak">
                                                <i class="fas fa-times-circle"></i>
                                            </button>
                                        <?php endif; ?>
                                        <?php if (isSuperAdmin()): ?>
                                            <button
                                                onclick="editPengeluaran(<?= $row['id'] ?>, '<?= $row['tanggal'] ?>', <?= $row['nominal'] ?>, '<?= htmlspecialchars($row['kategori'], ENT_QUOTES) ?>', '<?= htmlspecialchars($row['keterangan'], ENT_QUOTES) ?>')"
                                                class="text-blue-600 hover:text-blue-800 mr-1" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <form method="POST" class="inline"
                                                onsubmit="return confirm('Yakin ingin menghapus transaksi ini?')">
                                                <input type="hidden" name="action" value="delete_pengeluaran">
                                                <input type="hidden" name="id" value="<?= $row['id'] ?>">
                                                <button type="submit" class="text-red-600 hover:text-red-800" title="Hapus">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </form>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- Modal Pemasukan -->
<div id="modalPemasukan"
    class="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-800">Tambah Pemasukan</h3>
        </div>
        <form method="POST" class="p-6">
            <input type="hidden" name="action" value="add_pemasukan">

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Peserta *</label>
                <input type="text" id="searchPeserta" placeholder="Ketik nama atau no. registrasi..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    autocomplete="off">
                <input type="hidden" name="pendaftaran_id" id="pendaftaran_id" required>
                <div id="searchResults" class="mt-2 border border-gray-200 rounded-lg hidden max-h-48 overflow-y-auto">
                </div>
            </div>

            <div id="tagihanInfo" class="hidden mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 class="font-semibold text-blue-800 mb-3">Rincian Tagihan</h4>
                <div class="space-y-2 text-sm">
                    <div id="biayaPondokRow" class="hidden flex justify-between">
                        <span class="text-gray-700">Biaya Pondok:</span>
                        <span class="font-semibold" id="biayaPondok">Rp 0</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-700">Biaya Sekolah:</span>
                        <span class="font-semibold" id="biayaSekolah">Rp 0</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-700">Biaya Perlengkapan:</span>
                        <span class="font-semibold" id="biayaPerlengkapan">Rp 0</span>
                    </div>
                    <div class="flex justify-between border-t border-blue-300 pt-2 mt-2">
                        <span class="font-semibold text-gray-800">Total Tagihan:</span>
                        <span class="font-bold text-blue-800" id="totalTagihan">Rp 0</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-700">Sudah Dibayar:</span>
                        <span class="font-semibold text-green-600" id="totalDibayar">Rp 0</span>
                    </div>
                    <div class="flex justify-between border-t border-blue-300 pt-2 mt-2">
                        <span class="font-semibold text-gray-800">Sisa Kekurangan:</span>
                        <span class="font-bold text-red-600" id="sisaKekurangan">Rp 0</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal *</label>
                    <input type="date" name="tanggal" value="<?= date('Y-m-d') ?>" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nominal *</label>
                    <input type="text" name="nominal" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="Masukkan nominal">
                </div>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Pembayaran *</label>
                <select name="jenis_pembayaran" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                    <option value="">Pilih Jenis</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Cash">Cash</option>
                </select>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                <textarea name="keterangan" rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"></textarea>
            </div>

            <div class="flex gap-2 justify-end">
                <button type="button" onclick="hideModal('modalPemasukan')"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Batal</button>
                <button type="submit"
                    class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition">Simpan</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Pengeluaran -->
<div id="modalPengeluaran"
    class="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-800">Tambah Pengeluaran</h3>
        </div>
        <form method="POST" class="p-6">
            <input type="hidden" name="action" value="add_pengeluaran">

            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal *</label>
                    <input type="date" name="tanggal" value="<?= date('Y-m-d') ?>" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nominal *</label>
                    <input type="text" name="nominal" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="Masukkan nominal">
                </div>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                <select name="kategori" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                    <option value="">Pilih Kategori</option>
                    <?php foreach ($kategoriList as $kat): ?>
                        <option value="<?= htmlspecialchars($kat) ?>">
                            <?= htmlspecialchars($kat) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                <textarea name="keterangan" rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"></textarea>
            </div>

            <div class="flex gap-2 justify-end">
                <button type="button" onclick="hideModal('modalPengeluaran')"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Batal</button>
                <button type="submit"
                    class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition">Simpan</button>
            </div>
        </form>
    </div>
</div>

<script>
    // Tab switching
    function switchTab(tab) {
        // Update buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('border-primary', 'text-primary');
            btn.classList.add('border-transparent', 'text-gray-500');
        });
        document.getElementById('tab-' + tab).classList.remove('border-transparent', 'text-gray-500');
        document.getElementById('tab-' + tab).classList.add('border-primary', 'text-primary');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById('content-' + tab).classList.remove('hidden');
    }

    // Modal functions
    function showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }

    function hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    // Auto-complete peserta
    let searchTimeout;
    const searchInput = document.getElementById('searchPeserta');
    const searchResults = document.getElementById('searchResults');
    const pendaftaranIdInput = document.getElementById('pendaftaran_id');

    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        const query = this.value;

        if (query.length < 2) {
            searchResults.classList.add('hidden');
            return;
        }

        searchTimeout = setTimeout(() => {
            fetch(`../api/search_peserta.php?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        searchResults.innerHTML = data.map(item => `
                        <div class="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0" onclick="selectPeserta(${item.id}, '${item.label}')">
                            <div class="font-medium text-gray-800">${item.nama}</div>
                            <div class="text-sm text-gray-500">${item.no_registrasi} - ${item.lembaga}</div>
                        </div>
                    `).join('');
                        searchResults.classList.remove('hidden');
                    } else {
                        searchResults.innerHTML = '<div class="p-3 text-gray-500 text-sm">Tidak ada hasil</div>';
                        searchResults.classList.remove('hidden');
                    }
                });
        }, 300);
    });

    function selectPeserta(id, label) {
        pendaftaranIdInput.value = id;
        searchInput.value = label;
        searchResults.classList.add('hidden');

        // Helper function to format numbers with thousand separators
        function formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        // Load tagihan info
        fetch(`../api/get_tagihan.php?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show/hide pondok row based on status
                    if (data.is_pondok && data.biaya_pondok > 0) {
                        document.getElementById('biayaPondokRow').classList.remove('hidden');
                        document.getElementById('biayaPondok').textContent = 'Rp ' + formatNumber(data.biaya_pondok);
                    } else {
                        document.getElementById('biayaPondokRow').classList.add('hidden');
                    }

                    document.getElementById('biayaSekolah').textContent = 'Rp ' + formatNumber(data.biaya_sekolah);
                    document.getElementById('biayaPerlengkapan').textContent = 'Rp ' + formatNumber(data.biaya_perlengkapan);
                    document.getElementById('totalTagihan').textContent = 'Rp ' + formatNumber(data.total_tagihan);
                    document.getElementById('totalDibayar').textContent = 'Rp ' + formatNumber(data.total_dibayar);
                    document.getElementById('sisaKekurangan').textContent = 'Rp ' + formatNumber(data.sisa_kekurangan);
                    document.getElementById('tagihanInfo').classList.remove('hidden');
                }
            });
    }

    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });
    });


    // Tab switching function
    function switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Show selected tab content
        document.getElementById('content-' + tabName).classList.remove('hidden');

        // Update tab button styles
        const allTabs = document.querySelectorAll('.tab-button');
        allTabs.forEach(tab => {
            tab.classList.remove('bg-primary', 'text-white', 'border-primary');
            tab.classList.add('bg-gray-100', 'text-gray-600', 'border-transparent');
        });

        // Set active tab style
        const activeTab = document.getElementById('tab-' + tabName);
        activeTab.classList.remove('bg-gray-100', 'text-gray-600', 'border-transparent');
        activeTab.classList.add('bg-primary', 'text-white', 'border-primary');
    }

    // Currency formatting for nominal inputs
    function formatRupiah(value) {
        if (!value) return '';
        // Remove all non-numeric characters
        const number = value.toString().replace(/[^0-9]/g, '');
        if (!number) return '';

        // Format with Indonesian locale (uses dots as thousand separators)
        const formatted = parseInt(number).toLocaleString('id-ID');
        return 'Rp ' + formatted;
    }

    function parseRupiah(rupiah) {
        return parseInt(rupiah.replace(/[^0-9]/g, '')) || 0;
    }

    // Apply to all nominal inputs
    const nominalInputs = document.querySelectorAll('input[name="nominal"]');
    nominalInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            const formatted = formatRupiah(this.value);
            this.value = formatted;
        });
    });

    // Handle form submission - convert formatted value back to number
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            const nominalInput = this.querySelector('input[name="nominal"]');
            if (nominalInput && nominalInput.value.includes('Rp')) {
                const rawValue = parseRupiah(nominalInput.value);

                // Create hidden input with raw numeric value
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'nominal';
                hiddenInput.value = rawValue;

                // Rename the formatted input to avoid conflict
                nominalInput.name = 'nominal_display';
                this.appendChild(hiddenInput);
            }
        });
    });

    // Reject modal
    function rejectTransaksi(id, tipe) {
        const catatan = prompt('Catatan alasan penolakan (opsional):');
        if (catatan === null) return; // User cancelled

        const form = document.createElement('form');
        form.method = 'POST';
        form.innerHTML = `
            <input type="hidden" name="action" value="reject_${tipe}">
            <input type="hidden" name="id" value="${id}">
            <input type="hidden" name="catatan_approval" value="${catatan}">
        `;
        document.body.appendChild(form);
        form.submit();
    }
</script>

<?php include 'transaksi_edit_modals.php'; ?>

<?php $conn->close(); ?>
</body>

</html>