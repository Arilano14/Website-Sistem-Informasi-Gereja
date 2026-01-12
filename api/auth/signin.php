<?php
require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and Password required']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM auth_users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Verify password (assuming hashed) OR plain text if that's what user has.
    // Recommended: password_verify($password, $user['password'])
    // For now, using standard verification.
    if ($user && password_verify($password, $user['password'])) {
        unset($user['password']);
        
        // Simple token (in production use JWT)
        $token = bin2hex(random_bytes(32));
        
        // STORE TOKEN IN DB
        $updateToken = $pdo->prepare("UPDATE auth_users SET api_token = ? WHERE id = ?");
        $updateToken->execute([$token, $user['id']]);
        
        echo json_encode([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'] ?? $user['email'],
                'email' => $user['email'],
                'role' => $user['role'] ?? 'user'
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
