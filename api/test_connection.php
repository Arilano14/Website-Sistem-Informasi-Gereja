<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testing Database Connection...<br>";

// Manually define connection to avoid include path issues for testing
$host = 'localhost';
$db   = 'jemaat_gbkp';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "Connection Successful!<br>";

    // Test Query
    echo "Querying auth_users table...<br>";
    $stmt = $pdo->query("SELECT * FROM auth_users LIMIT 1");
    $users = $stmt->fetchAll();
    
    echo "Query Successful! Found " . count($users) . " rows.<br>";
    echo "<pre>";
    print_r($users);
    echo "</pre>";

} catch (\PDOException $e) {
    echo "Connection Failed: " . $e->getMessage();
} catch (Exception $e) {
    echo "General Error: " . $e->getMessage();
}
?>
