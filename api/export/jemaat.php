<?php
require_once '../db.php';

$format = $_GET['format'] ?? 'csv';
$sektor = $_GET['sektor'] ?? '';
$kategori = $_GET['kategori'] ?? '';
$sidi = $_GET['sidi'] ?? ''; // 'Ya' or 'Tidak'
$domisili = $_GET['domisili'] ?? ''; // 'kbb' or 'luar_kbb'

// Build Query
$sql = "SELECT * FROM jemaat WHERE 1=1";
$params = [];

if (!empty($sektor)) {
    $sql .= " AND sektor = ?";
    $params[] = $sektor;
}
if (!empty($kategori)) {
    $sql .= " AND kategori = ?";
    $params[] = $kategori;
}
if (!empty($sidi)) {
    $sql .= " AND sdh_sidi = ?";
    $params[] = $sidi;
}
if (!empty($domisili)) {
    if ($domisili === 'kbb') {
        $sql .= " AND kbb = 1";
    } elseif ($domisili === 'luar_kbb') {
        $sql .= " AND luar_kbb = 1";
    }
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$filename = 'data_jemaat_' . date('Y-m-d');

// PDF (Print Friendly HTML)
if ($format === 'pdf') {
    echo '<html><head><title>Data Jemaat</title>';
    echo '<style>body{font-family:sans-serif;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background-color:#f2f2f2;}</style>';
    echo '</head><body onload="window.print()">'; // Auto print
    echo '<h2>Data Jemaat GBKP</h2>';
    echo '<p>Total Data: ' . count($rows) . '</p>';
    echo '<table>';
    echo '<tr><th>Nama</th><th>Sektor</th><th>Kategori</th><th>Status Sidi</th><th>KBB</th><th>Luar KBB</th></tr>';
    foreach ($rows as $row) {
        echo '<tr>';
        echo '<td>' . htmlspecialchars($row['nama']) . '</td>';
        echo '<td>' . htmlspecialchars($row['sektor']) . '</td>';
        echo '<td>' . htmlspecialchars($row['kategori']) . '</td>';
        echo '<td>' . htmlspecialchars($row['sdh_sidi']) . '</td>';
        echo '<td>' . htmlspecialchars($row['kbb']) . '</td>';
        echo '<td>' . htmlspecialchars($row['luar_kbb']) . '</td>';
        echo '</tr>';
    }
    echo '</table></body></html>';
    exit();
}

// Excel
if ($format === 'xlsx') {
    header('Content-Type: application/vnd.ms-excel');
    header('Content-Disposition: attachment; filename="' . $filename . '.xls"'); // .xls is safer for HTML table
    
    echo '<table border="1">';
    echo '<tr><th>ID</th><th>Nama</th><th>Sektor</th><th>Kategori</th><th>Status Sidi</th><th>KBB</th><th>Luar KBB</th><th>No HP</th></tr>';
    foreach ($rows as $row) {
        echo '<tr>';
        echo '<td>' . $row['id'] . '</td>';
        echo '<td>' . $row['nama'] . '</td>';
        echo '<td>' . $row['sektor'] . '</td>';
        echo '<td>' . $row['kategori'] . '</td>';
        echo '<td>' . $row['sdh_sidi'] . '</td>';
        echo '<td>' . $row['kbb'] . '</td>';
        echo '<td>' . $row['luar_kbb'] . '</td>';
        echo '<td>' . ($row['no_hp'] ?? '-') . '</td>';
        echo '</tr>';
    }
    echo '</table>';
    exit();
}

// CSV
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="' . $filename . '.csv"');
$output = fopen('php://output', 'w');
fputcsv($output, ['ID', 'Nama', 'Sektor', 'Kategori', 'Status Sidi', 'KBB', 'Luar KBB', 'No HP']);

foreach ($rows as $row) {
    fputcsv($output, [
        $row['id'], $row['nama'], $row['sektor'], $row['kategori'], $row['sdh_sidi'], $row['kbb'], $row['luar_kbb'], $row['no_hp'] ?? ''
    ]);
}
fclose($output);
?>
