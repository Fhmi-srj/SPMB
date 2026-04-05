<?php
require_once '../api/config.php';
requireRole(['super_admin', 'admin']);

$conn = getConnection();
$message = '';
$error = '';

// Handle AJAX toggle request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['ajax_toggle'])) {
    header('Content-Type: application/json');

    $pendaftaran_id = intval($_POST['pendaftaran_id']);
    $perlengkapan_id = intval($_POST['perlengkapan_id']);
    $status = intval($_POST['status']);

    // Check if record exists
    $checkStmt = $conn->prepare("SELECT id FROM perlengkapan_pesanan WHERE pendaftaran_id = ? AND perlengkapan_item_id = ?");
    $checkStmt->bind_param("ii", $pendaftaran_id, $perlengkapan_id);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows > 0) {
        // Update existing record
        $stmt = $conn->prepare("UPDATE perlengkapan_pesanan SET status = ? WHERE pendaftaran_id = ? AND perlengkapan_item_id = ?");
        $stmt->bind_param("iii", $status, $pendaftaran_id, $perlengkapan_id);
    } else {
        // Insert new record
        $stmt = $conn->prepare("INSERT INTO perlengkapan_pesanan (pendaftaran_id, perlengkapan_item_id, status) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $pendaftaran_id, $perlengkapan_id, $status);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }

    $conn->close();
    exit;
}

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
    // Get perlengkapan status for this pendaftaran
    $pesananQuery = "SELECT perlengkapan_item_id, status FROM perlengkapan_pesanan WHERE pendaftaran_id = " . $row['id'];
    $pesananResult = $conn->query($pesananQuery);

    $row['perlengkapan'] = [];
    while ($pesanan = $pesananResult->fetch_assoc()) {
        $row['perlengkapan'][$pesanan['perlengkapan_item_id']] = $pesanan['status'];
    }

    $pendaftaranList[] = $row;
}

$conn->close();

// Page config
$pageTitle = 'Kelola Perlengkapan - Admin SPMB';
$currentPage = 'perlengkapan';
?>
<?php include 'includes/header.php'; ?>

<div class="admin-wrapper">
    <?php include 'includes/sidebar.php'; ?>

    <!-- Main Content -->
    <main class="main-content p-4 md:p-6">
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Kelola Perlengkapan</h2>
            <p class="text-gray-500 text-sm">Catat pemesanan perlengkapan tambahan per peserta</p>
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

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
            <form method="GET" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Cari Nama</label>
                    <input type="text" name="search" value="<?= htmlspecialchars($searchNama) ?>"
                        placeholder="Nama peserta..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Lembaga</label>
                    <select name="lembaga"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                        <option value="">Semua Lembaga</option>
                        <option value="SMP NU BP" <?= $filterLembaga === 'SMP NU BP' ? 'selected' : '' ?>>SMP NU BP
                        </option>
                        <option value="MA ALHIKAM" <?= $filterLembaga === 'MA ALHIKAM' ? 'selected' : '' ?>>MA ALHIKAM
                        </option>
                    </select>
                </div>
                <div class="flex items-end gap-2">
                    <button type="submit"
                        class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition flex-1">
                        <i class="fas fa-search mr-2"></i>Filter
                    </button>
                    <a href="perlengkapan.php"
                        class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                        <i class="fas fa-redo"></i>
                    </a>
                    <button type="button" onclick="printPDF()"
                        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                        <i class="fas fa-file-pdf mr-2"></i>PDF
                    </button>
                </div>
            </form>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full" id="perlengkapanTable">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">
                                No</th>
                            <th
                                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-12 bg-gray-50">
                                Nama</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">JK</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lembaga</th>
                            <?php foreach ($perlengkapanItems as $item): ?>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                    <?= htmlspecialchars($item['nama_item']) ?>
                                </th>
                            <?php endforeach; ?>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <?php
                        $no = 1;
                        foreach ($pendaftaranList as $peserta):
                            ?>
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-3 text-sm text-gray-500 sticky left-0 bg-white">
                                    <?= $no++ ?>
                                </td>
                                <td class="px-4 py-3 text-sm font-medium text-gray-800 sticky left-12 bg-white">
                                    <?= htmlspecialchars($peserta['nama']) ?>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600 text-center">
                                    <?= $peserta['jenis_kelamin'] === 'L' ? 'L' : 'P' ?>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600">
                                    <?= $peserta['lembaga'] ?>
                                </td>
                                <?php foreach ($perlengkapanItems as $item):
                                    $isChecked = isset($peserta['perlengkapan'][$item['id']]) && $peserta['perlengkapan'][$item['id']] == 1;
                                    ?>
                                    <td class="px-4 py-3 text-center">
                                        <label class="toggle-switch">
                                            <input type="checkbox" <?= $isChecked ? 'checked' : '' ?>
                                                onchange="togglePerlengkapan(this, <?= $peserta['id'] ?>, <?= $item['id'] ?>, '<?= htmlspecialchars($peserta['nama']) ?>', '<?= htmlspecialchars($item['nama_item']) ?>')">
                                            <span class="toggle-slider"></span>
                                        </label>
                                    </td>
                                <?php endforeach; ?>
                            </tr>
                        <?php endforeach; ?>
                        <?php if (empty($pendaftaranList)): ?>
                            <tr>
                                <td colspan="<?= 4 + count($perlengkapanItems) ?>"
                                    class="px-4 py-8 text-center text-gray-500 text-sm">
                                    <i class="fas fa-inbox text-3xl mb-2 text-gray-300"></i>
                                    <p>Tidak ada data peserta</p>
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

<!-- Include SweetAlert2 -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
    function togglePerlengkapan(checkbox, pendaftaranId, perlengkapanId, namaPeserta, namaItem) {
        const newStatus = checkbox.checked ? 1 : 0;
        const actionText = newStatus ? 'menambahkan' : 'membatalkan';

        Swal.fire({
            title: 'Konfirmasi',
            html: `Yakin ingin <strong>${actionText}</strong> perlengkapan<br><strong>${namaItem}</strong><br>untuk <strong>${namaPeserta}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Lanjutkan',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                // Send AJAX request
                fetch('perlengkapan.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `ajax_toggle=1&pendaftaran_id=${pendaftaranId}&perlengkapan_id=${perlengkapanId}&status=${newStatus}`
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil!',
                                text: 'Status perlengkapan berhasil diupdate',
                                timer: 1500,
                                showConfirmButton: false
                            });
                        } else {
                            throw new Error(data.error || 'Terjadi kesalahan');
                        }
                    })
                    .catch(error => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal!',
                            text: error.message
                        });
                        checkbox.checked = !checkbox.checked; // Revert checkbox
                    });
            } else {
                checkbox.checked = !checkbox.checked; // Revert checkbox
            }
        });
    }

    function printPDF() {
        window.open('perlengkapan_pdf.php<?= $filterLembaga || $searchNama ? '?' . http_build_query(['lembaga' => $filterLembaga, 'search' => $searchNama]) : '' ?>', '_blank');
    }
</script>

<style>
    /* Toggle Switch Styles */
    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .3s;
        border-radius: 24px;
    }

    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .3s;
        border-radius: 50%;
    }

    input:checked+.toggle-slider {
        background-color: #10b981;
    }

    input:checked+.toggle-slider:before {
        transform: translateX(20px);
    }

    /* Sticky columns */
    .sticky {
        position: sticky;
        z-index: 10;
    }
</style>

</body>

</html>