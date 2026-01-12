<?php
require_once '../db.php';

header('Content-Type: application/json');
// Handle CORS just in case
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['id']) ? $_GET['id'] : null;

// Helper to get input
function getJsonInput() {
    $input = file_get_contents("php://input");
    if (empty($input)) {
        return [];
    }
    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input: " . json_last_error_msg());
    }
    return $data;
}

function guidv4($data = null) {
    $data = $data ?? random_bytes(16);
    assert(strlen($data) == 16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

// Log Request for debugging
file_put_contents('../debug_api.txt', "[$method] " . date('Y-m-d H:i:s') . " Query: " . $_SERVER['QUERY_STRING'] . "\n", FILE_APPEND);

try {
    if ($method === 'GET') {
        if ($path) {
            $stmt = $pdo->prepare("SELECT * FROM jemaat WHERE id = ?");
            $stmt->execute([$path]);
            $data = $stmt->fetch();
            echo json_encode(['data' => $data]);
        } else {
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 15;
            $offset = ($page - 1) * $limit;
            
            $where = ["1=1"];
            $params = [];
            
            if (!empty($_GET['search'])) {
                $where[] = "nama LIKE ?";
                $params[] = "%" . $_GET['search'] . "%";
            }
            if (!empty($_GET['sektor'])) {
                $where[] = "sektor = ?";
                $params[] = $_GET['sektor'];
            }
            if (!empty($_GET['kategori'])) {
                $where[] = "kategori = ?";
                $params[] = $_GET['kategori'];
            }
            if (!empty($_GET['sidi'])) {
                if ($_GET['sidi'] === 'sudah') {
                    $where[] = "sdh_sidi = 1";
                } elseif ($_GET['sidi'] === 'belum') {
                    $where[] = "blm_sidi = 1";
                }
            }
            if (!empty($_GET['domisili'])) {
                if ($_GET['domisili'] === 'kbb') {
                    $where[] = "kbb = 1";
                } elseif ($_GET['domisili'] === 'luar_kbb') {
                    $where[] = "luar_kbb = 1";
                }
            }
            
            $whereSQL = implode(" AND ", $where);
            
            $countStmt = $pdo->prepare("SELECT COUNT(*) FROM jemaat WHERE $whereSQL");
            $countStmt->execute($params);
            $total = $countStmt->fetchColumn();
            
            $sql = "SELECT * FROM jemaat WHERE $whereSQL ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $items = $stmt->fetchAll();
            
            echo json_encode([
                'data' => $items,
                'pagination' => [
                    'total' => $total,
                    'page' => $page,
                    'totalPages' => ceil($total / $limit)
                ]
            ]);
        }
    } elseif ($method === 'POST') {
        $data = getJsonInput();
        
        // Log Input Data
        file_put_contents('../debug_api.txt', "POST Data: " . print_r($data, true) . "\n", FILE_APPEND);
        
        // Validation: Nama is required
        if (empty($data['nama'])) {
            throw new Exception("Nama is required");
        }

        $newId = guidv4();
        $sql = "INSERT INTO jemaat (id, nama, sektor, kategori, tgl_lahir, bln_lahir, thn_lahir, sdh_sidi, blm_sidi, kbb, luar_kbb, alamat_luar_kbb) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $newId,
            $data['nama'], 
            $data['sektor'], 
            $data['kategori'],
            !empty($data['tgl_lahir']) ? (int)$data['tgl_lahir'] : null,
            !empty($data['bln_lahir']) ? (int)$data['bln_lahir'] : null,
            !empty($data['thn_lahir']) ? (int)$data['thn_lahir'] : null,
            !empty($data['sdh_sidi']) ? 1 : 0,
            !empty($data['blm_sidi']) ? 1 : 0,
            !empty($data['kbb']) ? 1 : 0,
            !empty($data['luar_kbb']) ? 1 : 0,
            $data['alamat_luar_kbb'] ?? ''
        ]);
        
        file_put_contents('../debug_api.txt', "INSERT SUCCESS: ID=$newId\n", FILE_APPEND);
        echo json_encode(['message' => 'Success', 'id' => $newId]);
        
    } elseif ($method === 'PUT' && $path) {
        $data = getJsonInput();
        $sql = "UPDATE jemaat SET nama=?, sektor=?, kategori=?, tgl_lahir=?, bln_lahir=?, thn_lahir=?, sdh_sidi=?, blm_sidi=?, kbb=?, luar_kbb=?, alamat_luar_kbb=? WHERE id=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['nama'], 
            $data['sektor'], 
            $data['kategori'],
            $data['tgl_lahir'],
            $data['bln_lahir'],
            $data['thn_lahir'],
            !empty($data['sdh_sidi']) ? 1 : 0,
            !empty($data['blm_sidi']) ? 1 : 0,
            !empty($data['kbb']) ? 1 : 0,
            !empty($data['luar_kbb']) ? 1 : 0,
            $data['alamat_luar_kbb'] ?? '',
            $path
        ]);
        echo json_encode(['message' => 'Updated']);
        
    } elseif ($method === 'DELETE') {
        $data = getJsonInput();
        if ($path) {
            $stmt = $pdo->prepare("DELETE FROM jemaat WHERE id = ?");
            $stmt->execute([$path]);
        } elseif (!empty($data['ids'])) {
            $placeholders = implode(',', array_fill(0, count($data['ids']), '?'));
            $stmt = $pdo->prepare("DELETE FROM jemaat WHERE id IN ($placeholders)");
            $stmt->execute($data['ids']);
        }
        echo json_encode(['message' => 'Deleted']);
    }

} catch (Exception $e) {
    http_response_code(500);
    file_put_contents('../debug_api.txt', "ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
