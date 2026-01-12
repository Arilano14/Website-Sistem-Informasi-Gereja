<?php
require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and Password required']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id FROM auth_users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already exists']);
        exit();
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Default role 'user' as per strict requirement
    $stmt = $pdo->prepare("INSERT INTO auth_users (name, email, password, role) VALUES (?, ?, ?, 'user')");
    $stmt->execute([$name, $email, $hashedPassword]);
    
    echo json_encode(['message' => 'User created successfully']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
