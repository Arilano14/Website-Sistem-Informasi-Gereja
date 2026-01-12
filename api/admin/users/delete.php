<?php
require_once '../../db.php';
require_once '../../config/jwt_utils.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


// MOCK DEBUG MODE - BYPASS ALL LOGIC
// Uncomment this to test if the endpoint is reachable at all

http_response_code(200);
echo json_encode(["success" => true, "message" => "DEBUG: Bypass success"]);
exit();


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}



// DEBUG LOGGING
$logFile = '../../debug_delete.txt';
$logEntry = "---------------------------------\n";
$logEntry .= date('Y-m-d H:i:s') . " - Request Method: " . $_SERVER['REQUEST_METHOD'] . "\n";
$allHeaders = getallheaders(); // Use this if available, or manual fallback
$logEntry .= "Headers: " . print_r($allHeaders, true) . "\n";
$logEntry .= "GET: " . print_r($_GET, true) . "\n";

$input = file_get_contents("php://input");
$logEntry .= "Input Body: " . $input . "\n";
file_put_contents($logFile, $logEntry, FILE_APPEND);

$data = json_decode($input);
$id = isset($_GET['id']) ? $_GET['id'] : (($data && isset($data->id)) ? $data->id : null);


try {
    // 1. Verify Token & Admin Role (Security)
    if (!$token) {
        $headers = getallheaders(); // Try generic getallheaders first
        if (isset($headers['Authorization'])) {
             preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches);
        } elseif (isset($headers['authorization'])) { // Lowercase check
             preg_match('/Bearer\s(\S+)/', $headers['authorization'], $matches);
        }
        
        if (isset($matches[1])) $token = $matches[1];
    }

    if (!$token) {
        // Fallback check for various server vars
        $authHeader = null;
        if (isset($_SERVER['Authorization'])) $authHeader = $_SERVER['Authorization'];
        elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        
        if ($authHeader) {
             preg_match('/Bearer\s(\S+)/', $authHeader, $matches);
             if (isset($matches[1])) $token = $matches[1];
        }
    }

    if (!$token) {
        file_put_contents('../../debug_delete.txt', "Auth Failed: No Token Provided\n", FILE_APPEND);
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized: No token provided"]);
        exit();
    }

    // Check Token in DB
    $stmt = $pdo->prepare("SELECT id, role FROM auth_users WHERE api_token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized: Invalid token"]);
        exit();
    }

    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden: Admin access required"]);
        exit();
    }
    
    // Valid Admin! Proceed.

    // 2. Execute Delete
    if ($data && isset($data->ids) && is_array($data->ids)) {
        // Bulk Delete
        $ids = $data->ids;
        // Verify user isn't deleting themselves (assuming we have decoded user id)
        // For simplicity, we just run the query. Frontend should prevent it too.

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $pdo->prepare("DELETE FROM auth_users WHERE id IN ($placeholders)");
        
        if ($stmt->execute($ids)) {
            http_response_code(200);
            echo json_encode(["success" => true, "message" => count($ids) . " user berhasil dihapus"]);
        } else {
            throw new Exception("Gagal menghapus beberapa user");
        }
    } else {
        // Single Delete
        if (!$id) {
            throw new Exception("ID user tidak ditemukan");
        }
        
        $stmt = $pdo->prepare("DELETE FROM auth_users WHERE id = ?");
        
        if ($stmt->execute([$id])) {
            http_response_code(200);
            echo json_encode(["success" => true, "message" => "User berhasil dihapus"]);
        } else {
            throw new Exception("Gagal menghapus user");
        }
    }

} catch (Exception $e) {
    file_put_contents('../../debug_delete.txt', "ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
