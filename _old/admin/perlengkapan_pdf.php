<?php
require_once '../api/config.php';
requireLogin();

$conn = getConnection();

// Get filter parameters
$filterLembaga = $_GET['lembaga'] ?? '';
$searchNama = $_GET['search'] ?? '';

// Get all perlengkapan items
$perlengkapanItems = [];
$itemsResult = $conn->query("SELECT * FROM perlengkapan_items WHERE aktif = 1 ORDER BY urutan ASC");
while ($row = $itemsResult->fetch_assoc()) {
    $perlengkapanItems[] = $row;
}

// Build query for pendaftaran with filters
$query = "SELECT p.id, p.nama, p.jenis_kelamin, p.lembaga 
          FROM pendaftaran p 
          WHERE 1=1";

if ($filterLembaga) {
    $query .= " AND p.lembaga = '" . $conn->real_escape_string($filterLembaga) . "'";
}

if ($searchNama) {
    $query .= " AND p.nama LIKE '%" . $conn->real_escape_string($searchNama) . "%'";
}

$query .= " ORDER BY p.nama ASC";

$pendaftaranResult = $conn->query($query);
$pendaftaranList = [];

while ($row = $pendaftaranResult->fetch_assoc()) {
    // Get perlengkapan status for this pendaftaran (only active orders)
    $pesananQuery = "SELECT perlengkapan_item_id, status FROM perlengkapan_pesanan WHERE pendaftaran_id = " . $row['id'] . " AND status = 1";
    $pesananResult = $conn->query($pesananQuery);

    $row['perlengkapan'] = [];
    $hasOrder = false;

    while ($pesanan = $pesananResult->fetch_assoc()) {
        $row['perlengkapan'][$pesanan['perlengkapan_item_id']] = $pesanan['status'];
        $hasOrder = true;
    }

    // Only add to list if student has at least one order
    if ($hasOrder) {
        $pendaftaranList[] = $row;
    }
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Pemesanan Perlengkapan - SPMB</title>
    <style>
        @media print {
            .no-print {
                display: none;
            }

            @page {
                size: landscape;
                margin: 1cm;
            }
        }

        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h1 {
            margin: 5px 0;
            font-size: 18px;
        }

        .header p {
            margin: 3px 0;
            font-size: 14px;
        }

        .filter-info {
            font-style: italic;
            margin-bottom: 15px;
            font-size: 11px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 6px 4px;
            text-align: center;
        }

        th {
            background-color: #f0f0f0;
            font-weight: bold;
            font-size: 11px;
        }

        th.item-header {
            background-color: #e0e0e0;
            font-size: 10px;
            font-weight: bold;
        }

        th.sub-header {
            background-color: #f5f5f5;
            font-size: 9px;
            font-weight: normal;
        }

        td {
            font-size: 10px;
        }

        .nama-col {
            text-align: left;
        }

        .summary {
            margin-top: 20px;
        }

        .summary h3 {
            font-size: 14px;
            margin-bottom: 10px;
        }

        .summary-item {
            margin: 5px 0;
        }

        .footer {
            margin-top: 30px;
            font-style: italic;
            text-align: right;
            font-size: 10px;
        }

        .print-btn {
            background-color: #10b981;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin-bottom: 20px;
        }

        .print-btn:hover {
            background-color: #059669;
        }
    </style>
</head>

<body>
    <div class="no-print">
        <button onclick="window.print()" class="print-btn">
            🖨️ Print / Save as PDF
        </button>
        <button onclick="window.close()" class="print-btn" style="background-color: #6b7280;">
            ✕ Tutup
        </button>
    </div>

    <div class="header">
        <h1>DAFTAR PEMESANAN PERLENGKAPAN</h1>
        <p>SPMB Mambaul Huda</p>
    </div>

    <?php if ($filterLembaga || $searchNama): ?>
        <div class="filter-info">
            Filter:
            <?php if ($filterLembaga): ?>Lembaga: <?= $filterLembaga ?>     <?php endif; ?>
            <?php if ($searchNama): ?>Nama: <?= htmlspecialchars($searchNama) ?><?php endif; ?>
        </div>
    <?php endif; ?>

    <table>
        <thead>
            <tr>
                <th rowspan="2" style="width: 30px;">No</th>
                <th rowspan="2" style="width: 150px;">Nama</th>
                <th rowspan="2" style="width: 30px;">JK</th>
                <th rowspan="2" style="width: 60px;">Lembaga</th>
                <?php foreach ($perlengkapanItems as $item): ?>
                    <th colspan="2" class="item-header"><?= htmlspecialchars($item['nama_item']) ?></th>
                <?php endforeach; ?>
            </tr>
            <tr>
                <?php foreach ($perlengkapanItems as $item): ?>
                    <th class="sub-header" style="width: 40px;">Pesan</th>
                    <th class="sub-header" style="width: 40px;">Ambil</th>
                <?php endforeach; ?>
            </tr>
        </thead>
        <tbody>
            <?php
            $no = 1;
            foreach ($pendaftaranList as $peserta):
                ?>
                <tr>
                    <td><?= $no++ ?></td>
                    <td class="nama-col"><?= htmlspecialchars($peserta['nama']) ?></td>
                    <td><?= $peserta['jenis_kelamin'] ?></td>
                    <td><?= $peserta['lembaga'] ?></td>
                    <?php foreach ($perlengkapanItems as $item):
                        $isChecked = isset($peserta['perlengkapan'][$item['id']]) && $peserta['perlengkapan'][$item['id']] == 1;
                        ?>
                        <td><?= $isChecked ? '✓' : '' ?></td>
                        <td style="background-color: #fafafa;"></td>
                    <?php endforeach; ?>
                </tr>
            <?php endforeach; ?>
            <?php if (empty($pendaftaranList)): ?>
                <tr>
                    <td colspan="<?= 4 + (count($perlengkapanItems) * 2) ?>" style="text-align: center; padding: 20px;">
                        Tidak ada pesanan perlengkapan
                    </td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>

    <div class="summary">
        <h3>RINGKASAN PEMESANAN</h3>
        <?php foreach ($perlengkapanItems as $item):
            $count = 0;
            foreach ($pendaftaranList as $peserta) {
                if (isset($peserta['perlengkapan'][$item['id']]) && $peserta['perlengkapan'][$item['id']] == 1) {
                    $count++;
                }
            }
            ?>
            <div class="summary-item">
                <strong><?= htmlspecialchars($item['nama_item']) ?>:</strong> <?= $count ?> pesanan
                (Rp<?= number_format($item['nominal'], 0, ',', '.') ?> x <?= $count ?> =
                Rp<?= number_format($item['nominal'] * $count, 0, ',', '.') ?>)
            </div>
        <?php endforeach; ?>
    </div>

    <div class="footer">
        Dicetak pada: <?= date('d/m/Y H:i:s') ?>
    </div>

    <script>
        // Auto print when page loads (optional)
        // window.onload = function() { window.print(); }
    </script>
</body>

</html>