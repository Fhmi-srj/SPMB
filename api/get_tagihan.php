<?php
require_once 'config.php';
requireLogin();

header('Content-Type: application/json');

$conn = getConnection();
$pendaftaran_id = intval($_GET['id'] ?? 0);

if (!$pendaftaran_id) {
    echo json_encode(['error' => 'Invalid ID']);
    exit;
}

// Get pendaftaran data
$stmt = $conn->prepare("SELECT lembaga, status_mukim FROM pendaftaran WHERE id = ?");
$stmt->bind_param("i", $pendaftaran_id);
$stmt->execute();
$peserta = $stmt->get_result()->fetch_assoc();

if (!$peserta) {
    echo json_encode(['error' => 'Peserta not found']);
    exit;
}

// Get biaya based on lembaga and status mukim
$biayaPondok = 0;
$biayaSekolah = 0;
$lembagaColumn = ($peserta['lembaga'] == 'SMP NU BP') ? 'biaya_smp' : 'biaya_ma';
$isPondok = ($peserta['status_mukim'] == 'PONDOK PP MAMBAUL HUDA');

// Calculate biaya sekolah
$biayaSekolahResult = $conn->query("SELECT SUM($lembagaColumn) as total FROM biaya");
$biayaSekolahRow = $biayaSekolahResult->fetch_assoc();
$biayaSekolah = $biayaSekolahRow['total'] ?? 0;

// Calculate biaya pondok if applicable
if ($isPondok) {
    $biayaPondokResult = $conn->query("SELECT SUM(biaya_pondok) as total FROM biaya");
    $biayaPondokRow = $biayaPondokResult->fetch_assoc();
    $biayaPondok = $biayaPondokRow['total'] ?? 0;
}

$biayaTotal = $biayaSekolah + $biayaPondok;

// Get perlengkapan cost
$perlengkapanQuery = "
    SELECT SUM(pi.nominal) as total 
    FROM perlengkapan_pesanan pp
    JOIN perlengkapan_items pi ON pp.perlengkapan_item_id = pi.id
    WHERE pp.pendaftaran_id = ? AND pp.status = 1
";
$stmt = $conn->prepare($perlengkapanQuery);
$stmt->bind_param("i", $pendaftaran_id);
$stmt->execute();
$perlengkapanRow = $stmt->get_result()->fetch_assoc();
$perlengkapanTotal = $perlengkapanRow['total'] ?? 0;

// Get total paid
$paidQuery = "SELECT SUM(nominal) as total FROM transaksi_pemasukan WHERE pendaftaran_id = ?";
$stmt = $conn->prepare($paidQuery);
$stmt->bind_param("i", $pendaftaran_id);
$stmt->execute();
$paidRow = $stmt->get_result()->fetch_assoc();
$totalPaid = $paidRow['total'] ?? 0;

$totalTagihan = $biayaTotal + $perlengkapanTotal;
$sisaKekurangan = $totalTagihan - $totalPaid;

echo json_encode([
    'success' => true,
    'total_tagihan' => $totalTagihan,
    'total_dibayar' => $totalPaid,
    'sisa_kekurangan' => $sisaKekurangan,
    'biaya_pondok' => $biayaPondok,
    'biaya_sekolah' => $biayaSekolah,
    'biaya_lembaga' => $biayaTotal,
    'biaya_perlengkapan' => $perlengkapanTotal,
    'lembaga' => $peserta['lembaga'],
    'status_mukim' => $peserta['status_mukim'],
    'is_pondok' => $isPondok
]);

$conn->close();
