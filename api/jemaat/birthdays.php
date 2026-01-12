<?php
require_once '../db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    $month = isset($_GET['month']) ? intval($_GET['month']) : intval(date('n'));
    
    // Fetch birthdays for the specified month
    $stmt = $pdo->prepare("SELECT id, nama, tgl_lahir, bln_lahir, thn_lahir, sektor, kategori FROM jemaat WHERE bln_lahir = ? ORDER BY tgl_lahir ASC");
    $stmt->execute([$month]);
    $birthdays = $stmt->fetchAll();

    echo json_encode(['birthdays' => $birthdays]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
