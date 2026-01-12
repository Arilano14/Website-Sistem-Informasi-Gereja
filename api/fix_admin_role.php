<?php
require_once 'db.php';

header('Content-Type: text/html');

try {
    // Force update user with email 'admin@gmail.com' to role 'admin'
    $email = 'admin@gmail.com';
    $role = 'admin';
    
    $stmt = $pdo->prepare("UPDATE auth_users SET role = ? WHERE email = ?");
    $stmt->execute([$role, $email]);
    
    if ($stmt->rowCount() > 0) {
        echo "<h1>Success!</h1>";
        echo "User '$email' is now an <b>ADMIN</b>.<br>";
    } else {
        echo "<h1>No Changes</h1>";
        echo "User '$email' might already be admin or email not found.<br>";
    }
    
    // Checks
    $stmt = $pdo->prepare("SELECT * FROM auth_users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    echo "<pre>";
    print_r($user);
    echo "</pre>";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
