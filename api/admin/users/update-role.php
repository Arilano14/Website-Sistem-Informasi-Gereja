<?php
require_once '../../db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->userId) || !isset($data->role)) {
    http_response_code(400);
    echo json_encode(["error" => "Data tidak lengkap"]);
    exit();
}

$userId = $data->userId;
$role = $data->role;

try {
    // Validate role
    if (!in_array($role, ['admin', 'user'])) {
        throw new Exception("Role tidak valid");
    }

    $stmt = $pdo->prepare("UPDATE auth_users SET role = ? WHERE id = ?");
    
    if ($stmt->execute([$role, $userId])) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Role berhasil diperbarui"]);
    } else {
        throw new Exception("Gagal memperbarui role");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
