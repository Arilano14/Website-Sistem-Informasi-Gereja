<?php
require_once 'db.php';
try {
    $stmt = $pdo->query("ALTER TABLE auth_users ADD COLUMN password VARCHAR(255) DEFAULT NULL");
    echo "Column 'password' added successfully.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
