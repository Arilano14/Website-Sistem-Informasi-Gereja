<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? $_GET['id'] : null;

// Logging
file_put_contents('../debug_api.txt', "[DATA_PELAYAN][$method] " . date('Y-m-d H:i:s') . " Q: " . $_SERVER['QUERY_STRING'] . "\n", FILE_APPEND);

try {
    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM data_pelayan WHERE id = ?");
            $stmt->execute([$id]);
            $data = $stmt->fetch();
            echo json_encode($data ?: null);
        } else {
            $stmt = $pdo->query("SELECT * FROM data_pelayan ORDER BY gelar_penggelaran ASC");
            $data = $stmt->fetchAll();
            echo json_encode($data);
        }
    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) throw new Exception("Invalid Input");
        
        file_put_contents('../debug_api.txt', "POST Payload: " . print_r($input, true) . "\n", FILE_APPEND);

        $stmt = $pdo->prepare("INSERT INTO data_pelayan (gelar_penggelaran, jabatan, serayan_sektor, no_hp_wa) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $input['gelar_penggelaran'],
            $input['jabatan'],
            $input['serayan_sektor'] ?? '-',
            $input['no_hp_wa'] ?? ''
        ]);
        echo json_encode(['message' => 'Success', 'id' => $pdo->lastInsertId()]);
        
    } elseif ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$id || !$input) throw new Exception("ID and Input required");

        $stmt = $pdo->prepare("UPDATE data_pelayan SET gelar_penggelaran=?, jabatan=?, serayan_sektor=?, no_hp_wa=? WHERE id=?");
        $stmt->execute([
            $input['gelar_penggelaran'],
            $input['jabatan'],
            $input['serayan_sektor'],
            $input['no_hp_wa'],
            $id
        ]);
        echo json_encode(['message' => 'Updated']);
        
    } elseif ($method === 'DELETE') {
        if (!$id) throw new Exception("ID required");
        $stmt = $pdo->prepare("DELETE FROM data_pelayan WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Deleted']);
    }
} catch (Exception $e) {
    http_response_code(500);
    file_put_contents('../debug_api.txt', "ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

