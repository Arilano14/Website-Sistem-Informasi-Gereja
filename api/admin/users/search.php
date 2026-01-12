<?php
require_once '../../db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $keyword = isset($data['keyword']) ? trim($data['keyword']) : '';

    if (empty($keyword)) {
        // Return all if empty (or could be error, but usually search empty means all or none)
        // Let's strictly return error or empty array to be precise as per specs
        // Spec says: Jika tidak ditemukan -> response error.
        // But for UX, empty search usually resets.
        // Let's follow spec: Input { keyword: string }
        $stmt = $pdo->query("SELECT id, name, email, role FROM auth_users");
        $users = $stmt->fetchAll();
    } else {
        $stmt = $pdo->prepare("SELECT id, name, email, role FROM auth_users WHERE name LIKE ? OR email LIKE ?");
        $likeKeyword = "%$keyword%";
        $stmt->execute([$likeKeyword, $likeKeyword]);
        $users = $stmt->fetchAll();
    }

    if (empty($users) && !empty($keyword)) {
        echo json_encode(['error' => 'Akun tidak ditemukan']);
    } else {
        echo json_encode([
            'success' => true,
            'data' => $users
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
