<?php
require_once '../api/config.php';
requireLogin();

$conn = getConnection();

// Get biaya items that have biaya_pondok (excluding Infaq Bulan Pertama and Registrasi)
$biayaQuery = "
    SELECT nama_item, MIN(urutan) as urutan 
    FROM biaya 
    WHERE kategori = 'DAFTAR_ULANG' 
    AND biaya_pondok > 0 
    AND nama_item NOT IN ('Infaq Bulan Pertama', 'Registrasi')
    GROUP BY nama_item 
    ORDER BY urutan ASC
";
$biayaResult = $conn->query($biayaQuery);
$biayaItems = [];
while ($row = $biayaResult->fetch_assoc()) {
    $biayaItems[] = $row['nama_item'];
}

// Get Registrasi fee (from PENDAFTARAN category, not DAFTAR_ULANG)
$registrasiQuery = "SELECT biaya_pondok, biaya_smp, biaya_ma FROM biaya WHERE nama_item = 'Registrasi' AND kategori = 'PENDAFTARAN' LIMIT 1";
$registrasiResult = $conn->query($registrasiQuery);
$registrasiFee = $registrasiResult->fetch_assoc();


// Debug: Uncomment to check registrasi values
// echo "<pre>Registrasi Fee: ";
// print_r($registrasiFee);
// echo "</pre>";



// Get all registrants with their payment data
$query = "
    SELECT 
        p.id,
        p.nama,
        p.lembaga,
        p.status_mukim,
        
        -- Calculate total tagihan
        CASE 
            WHEN p.lembaga = 'MA' OR p.lembaga = 'MA ALHIKAM' THEN 
                (SELECT COALESCE(SUM(biaya_ma), 0) FROM biaya WHERE kategori = 'DAFTAR_ULANG')
            WHEN p.lembaga = 'SMP' OR p.lembaga = 'SMP NU BP' THEN 
                (SELECT COALESCE(SUM(biaya_smp), 0) FROM biaya WHERE kategori = 'DAFTAR_ULANG')
            ELSE 0
        END + 
        CASE 
            WHEN p.status_mukim = 'PONDOK PP MAMBAUL HUDA' THEN 
                (SELECT COALESCE(SUM(biaya_pondok), 0) FROM biaya WHERE kategori = 'DAFTAR_ULANG')
            ELSE 0
        END as total_tagihan,
        
        -- Total pembayaran
        (SELECT COALESCE(SUM(nominal), 0) FROM transaksi_pemasukan WHERE pendaftaran_id = p.id) as total_pembayaran,
        
        -- Biaya per kategori untuk pembagian (including all items)
        (SELECT COALESCE(SUM(biaya_ma), 0) FROM biaya WHERE kategori = 'DAFTAR_ULANG') as total_biaya_ma,
        (SELECT COALESCE(SUM(biaya_smp), 0) FROM biaya WHERE kategori = 'DAFTAR_ULANG') as total_biaya_smp,
        (SELECT COALESCE(biaya_pondok, 0) FROM biaya WHERE kategori = 'DAFTAR_ULANG' AND nama_item = 'Infaq Bulan Pertama' LIMIT 1) as biaya_infaq_pondok,
        
        -- Perlengkapan
        (SELECT COALESCE(SUM(pi.nominal), 0) 
         FROM perlengkapan_pesanan pp 
         JOIN perlengkapan_items pi ON pp.perlengkapan_item_id = pi.id 
         WHERE pp.pendaftaran_id = p.id AND pp.status = 1) as total_perlengkapan
        
    FROM pendaftaran p
    ORDER BY p.created_at DESC
";

$result = $conn->query($query);
$registrants = [];
while ($row = $result->fetch_assoc()) {
    $registrants[] = $row;
}

// Get individual biaya amounts for each item (biaya_pondok only)
function getBiayaAmount($conn, $namaItem)
{
    $query = "SELECT biaya_pondok as amount FROM biaya WHERE nama_item = ? AND kategori = 'DAFTAR_ULANG' LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $namaItem);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    return $row ? intval($row['amount']) : 0;
}

// Calculate distribution for each registrant
foreach ($registrants as &$reg) {
    $sisaPembayaran = $reg['total_pembayaran']; // Sisa uang yang belum dibagi

    // Initialize all positions to 0
    $reg['pos_ma'] = 0;
    $reg['pos_smp'] = 0;
    $reg['pos_pondok'] = 0;
    $reg['pos_registrasi'] = 0;

    $isPondok = ($reg['status_mukim'] === 'PONDOK PP MAMBAUL HUDA');

    // Priority 1: Registrasi (ONLY for pondok students)
    if ($isPondok && $registrasiFee && isset($registrasiFee['biaya_pondok'])) {
        $biayaReg = intval($registrasiFee['biaya_pondok']);
        if ($biayaReg > 0) {
            $reg['pos_registrasi'] = min($sisaPembayaran, $biayaReg);
            $sisaPembayaran -= $reg['pos_registrasi'];
        }
    }
    // Priority 2: Distribute to lembaga (MA or SMP)
    // For non-pondok: includes registrasi in lembaga total
    // For pondok: excludes registrasi (already separated above)
    if ($reg['lembaga'] === 'MA' || $reg['lembaga'] === 'MA ALHIKAM') {
        $biayaMA = $reg['total_biaya_ma'];
        // Add registrasi MA for all students
        if ($registrasiFee) {
            $biayaMA += intval($registrasiFee['biaya_ma']);
        }
        $reg['pos_ma'] = min($sisaPembayaran, $biayaMA);
        $sisaPembayaran -= $reg['pos_ma'];
    } elseif ($reg['lembaga'] === 'SMP' || $reg['lembaga'] === 'SMP NU BP') {
        $biayaSMP = $reg['total_biaya_smp'];
        // Add registrasi SMP for all students
        if ($registrasiFee) {
            $biayaSMP += intval($registrasiFee['biaya_smp']);
        }
        $reg['pos_smp'] = min($sisaPembayaran, $biayaSMP);
        $sisaPembayaran -= $reg['pos_smp'];
    }

    // Priority 3: Distribute to pondok (Infaq Bulan Pertama - only for pondok students)
    if ($isPondok && $sisaPembayaran > 0) {
        $biayaPondok = $reg['biaya_infaq_pondok'];
        $reg['pos_pondok'] = min($sisaPembayaran, $biayaPondok);
        $sisaPembayaran -= $reg['pos_pondok'];
    }

    // Priority 4: Distribute to other biaya items (only for pondok students)
    if ($isPondok) {
        foreach ($biayaItems as $item) {
            if ($sisaPembayaran <= 0)
                break; // Stop if no money left

            $itemAmount = getBiayaAmount($conn, $item);
            $key = 'pos_' . str_replace(' ', '_', strtolower($item));
            $reg[$key] = min($sisaPembayaran, $itemAmount);
            $sisaPembayaran -= $reg[$key];
        }
    } else {
        // Non-pondok students: set all item columns to 0
        foreach ($biayaItems as $item) {
            $key = 'pos_' . str_replace(' ', '_', strtolower($item));
            $reg[$key] = 0;
        }
    }

    // Priority 5: Perlengkapan (only if there are orders)
    if ($sisaPembayaran > 0 && $reg['total_perlengkapan'] > 0) {
        $reg['pos_perlengkapan'] = min($sisaPembayaran, $reg['total_perlengkapan']);
        $sisaPembayaran -= $reg['pos_perlengkapan'];
    } else {
        $reg['pos_perlengkapan'] = 0;
    }

    // Store remaining balance
    $reg['pos_sisa'] = $sisaPembayaran;
}
unset($reg);

$pageTitle = 'Pos Keuangan - Admin SPMB';
$currentPage = 'pos_keuangan';
?>
<?php include 'includes/header.php'; ?>

<div class="admin-wrapper">
    <?php include 'includes/sidebar.php'; ?>

    <!-- Main Content -->
    <main class="main-content p-4 md:p-6">
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Pos Keuangan</h2>
            <p class="text-gray-500 text-sm">Pembagian keuangan dari pembayaran pendaftar</p>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <?php
            $totalRegistrasi = 0;
            $totalMA = 0;
            $totalSMP = 0;
            $totalPondok = 0;
            $totalPerlengkapan = 0;
            $totalSisa = 0;

            foreach ($registrants as $reg) {
                $totalRegistrasi += $reg['pos_registrasi'];
                $totalMA += $reg['pos_ma'];
                $totalSMP += $reg['pos_smp'];
                $totalPondok += $reg['pos_pondok'];
                $totalPerlengkapan += $reg['pos_perlengkapan'];
                $totalSisa += $reg['pos_sisa'];
            }
            ?>
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <p class="text-blue-100 text-sm mb-1">Total MA</p>
                <h3 class="text-2xl font-bold">Rp<?= number_format($totalMA, 0, ',', '.') ?></h3>
            </div>
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <p class="text-green-100 text-sm mb-1">Total SMP</p>
                <h3 class="text-2xl font-bold">Rp<?= number_format($totalSMP, 0, ',', '.') ?></h3>
            </div>
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <p class="text-purple-100 text-sm mb-1">Total Pondok</p>
                <h3 class="text-2xl font-bold">Rp<?= number_format($totalPondok, 0, ',', '.') ?></h3>
            </div>
            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                <p class="text-orange-100 text-sm mb-1">Total Perlengkapan</p>
                <h3 class="text-2xl font-bold">Rp<?= number_format($totalPerlengkapan, 0, ',', '.') ?></h3>
            </div>
        </div>

        <!-- Search and Export Row -->
        <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div class="flex flex-col md:flex-row gap-3 items-center">
                <!-- Search Box -->
                <div class="flex-1 w-full relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-search text-gray-400"></i>
                    </div>
                    <input type="text" id="searchStudent" placeholder="Cari nama siswa..."
                        class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition">
                </div>

                <!-- Export Button -->
                <button onclick="exportToExcel()"
                    class="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 whitespace-nowrap">
                    <i class="fas fa-file-excel"></i>
                    <span>Export Excel</span>
                </button>
            </div>
        </div>


        <!-- Table -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table id="posKeuanganTable" class="w-full text-sm">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">
                                No</th>
                            <th
                                class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-12 bg-gray-50">
                                Nama</th>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lembaga</th>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Pondok
                            </th>
                            <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tagihan</th>
                            <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pembayaran</th>
                            <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-gray-50">
                                Registrasi</th>
                            <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-blue-50">MA
                            </th>
                            <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-green-50">SMP
                            </th>
                            <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-purple-50">
                                Pondok</th>
                            <?php foreach ($biayaItems as $item): ?>
                                <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-yellow-50">
                                    <?= htmlspecialchars(strtoupper($item)) ?>
                                </th>
                            <?php endforeach; ?>
                            <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-orange-50">
                                Perlengkapan</th>
                            <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-red-50">
                                Sisa</th>
                        </tr>

                        <!-- Total Row -->
                        <tr class="bg-primary text-white font-bold">
                            <td colspan="6" class="px-3 py-3">TOTAL</td>
                            <td class="px-3 py-3 text-right">Rp<?= number_format($totalRegistrasi, 0, ',', '.') ?></td>
                            <td class="px-3 py-3 text-right">Rp<?= number_format($totalMA, 0, ',', '.') ?></td>
                            <td class="px-3 py-3 text-right">Rp<?= number_format($totalSMP, 0, ',', '.') ?></td>
                            <td class="px-3 py-3 text-right">Rp<?= number_format($totalPondok, 0, ',', '.') ?></td>
                            <?php foreach ($biayaItems as $item):
                                $totalItem = 0;
                                foreach ($registrants as $reg) {
                                    $key = 'pos_' . str_replace(' ', '_', strtolower($item));
                                    $totalItem += isset($reg[$key]) ? $reg[$key] : 0;
                                }
                                ?>
                                <td class="px-3 py-3 text-right">Rp<?= number_format($totalItem, 0, ',', '.') ?></td>
                            <?php endforeach; ?>
                            <td class="px-3 py-3 text-right">Rp<?= number_format($totalPerlengkapan, 0, ',', '.') ?>
                            </td>
                            <td class="px-3 py-3 text-right">Rp<?= number_format($totalSisa, 0, ',', '.') ?>
                            </td>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <?php
                        $no = 1;
                        foreach ($registrants as $reg):
                            ?>
                            <tr class="hover:bg-gray-50">
                                <td class="px-3 py-3 text-gray-500 sticky left-0 bg-white"><?= $no++ ?></td>
                                <td class="px-3 py-3 font-medium text-gray-800 sticky left-12 bg-white">
                                    <?= htmlspecialchars($reg['nama']) ?>
                                </td>
                                <td class="px-3 py-3 text-gray-600"><?= htmlspecialchars($reg['lembaga']) ?></td>
                                <td class="px-3 py-3 text-gray-600"><?= htmlspecialchars($reg['status_mukim']) ?></td>
                                <td class="px-3 py-3 text-right text-gray-600">
                                    Rp<?= number_format($reg['total_tagihan'], 0, ',', '.') ?></td>
                                <td class="px-3 py-3 text-right font-semibold text-green-600">
                                    Rp<?= number_format($reg['total_pembayaran'], 0, ',', '.') ?></td>
                                <td class="px-3 py-3 text-right text-gray-700 bg-gray-50">
                                    Rp<?= number_format($reg['pos_registrasi'], 0, ',', '.') ?></td>
                                <td class="px-3 py-3 text-right text-blue-700 bg-blue-50">
                                    Rp<?= number_format($reg['pos_ma'], 0, ',', '.') ?></td>
                                <td class="px-3 py-3 text-right text-green-700 bg-green-50">
                                    Rp<?= number_format($reg['pos_smp'], 0, ',', '.') ?></td>
                                <td class="px-3 py-3 text-right text-purple-700 bg-purple-50">
                                    Rp<?= number_format($reg['pos_pondok'], 0, ',', '.') ?></td>
                                <?php foreach ($biayaItems as $item):
                                    $key = 'pos_' . str_replace(' ', '_', strtolower($item));
                                    $value = isset($reg[$key]) ? $reg[$key] : 0;
                                    ?>
                                    <td class="px-3 py-3 text-right text-yellow-700 bg-yellow-50">
                                        Rp<?= number_format($value, 0, ',', '.') ?></td>
                                <?php endforeach; ?>
                                <td class="px-3 py-3 text-right text-orange-700 bg-orange-50">
                                    Rp<?= number_format($reg['pos_perlengkapan'], 0, ',', '.') ?></td>
                                <td class="px-3 py-3 text-right text-red-700 bg-red-50">
                                    Rp<?= number_format($reg['pos_sisa'], 0, ',', '.') ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script>
    function exportToExcel() {
        const table = document.getElementById('posKeuanganTable');
        const wb = XLSX.utils.table_to_book(table, { sheet: "Pos Keuangan" });
        XLSX.writeFile(wb, 'Pos_Keuangan_' + new Date().toISOString().split('T')[0] + '.xlsx');
    }

    // Search functionality
    document.getElementById('searchStudent').addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        const table = document.getElementById('posKeuanganTable');
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

        for (let i = 0; i < rows.length; i++) {
            const nameCell = rows[i].getElementsByTagName('td')[1]; // Nama column is index 1
            if (nameCell) {
                const nameText = nameCell.textContent || nameCell.innerText;
                if (nameText.toLowerCase().indexOf(searchTerm) > -1) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            }
        }
    });
</script>

<?php $conn->close(); ?>
</body>

</html>