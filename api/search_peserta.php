<?php
require_once 'config.php';
requireLogin();

header('Content-Type: application/json');

$conn = getConnection();
$search = $_GET['q'] ?? '';

if (strlen($search) < 2) {
    echo json_encode([]);
    exit;
}

// Search by nama or no_registrasi
$query = "SELECT id, no_registrasi, nama, lembaga 
          FROM pendaftaran 
          WHERE (nama LIKE ? OR no_registrasi LIKE ?)
          ORDER BY nama ASC 
          LIMIT 10";

$searchTerm = '%' . $search . '%';
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

$pesertaList = [];
while ($row = $result->fetch_assoc()) {
    $pesertaList[] = [
        'id' => $row['id'],
        'no_registrasi' => $row['no_registrasi'],
        'nama' => $row['nama'],
        'lembaga' => $row['lembaga'],
        'label' => $row['no_registrasi'] . ' - ' . $row['nama'] . ' (' . $row['lembaga'] . ')'
    ];
}

echo json_encode($pesertaList);
$conn->close();
