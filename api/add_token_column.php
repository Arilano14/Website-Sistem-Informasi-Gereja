<?php
require_once 'db.php';

try {
    // Check if column exists
    $check = $pdo->query("SHOW COLUMNS FROM auth_users LIKE 'api_token'");
    if ($check->rowCount() == 0) {
        $pdo->exec("ALTER TABLE auth_users ADD COLUMN api_token VARCHAR(255) NULL AFTER role");
        echo "Column 'api_token' added successfully.";
    } else {
        echo "Column 'api_token' already exists.";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
