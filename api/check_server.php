<?php
// Script Diagnosa Server & Database
header('Content-Type: text/html; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>1. Cek PHP Basic</h2>";
echo "PHP is running! Version: " . phpversion() . "<br>";
echo "Current File: " . __FILE__ . "<br>";

echo "<h2>2. Cek File db.php</h2>";
$dbPath = __DIR__ . '/db.php';
if (file_exists($dbPath)) {
    echo "✅ File db.php DITEMUKAN di: $dbPath<br>";
    include $dbPath; // Coba include
    echo "✅ File db.php berhasil di-include.<br>";
} else {
    echo "❌ File db.php TIDAK DITEMUKAN di: $dbPath<br>";
    echo "Pastikan Anda mengupload file db.php ke folder <b>api</b>.<br>";
    exit();
}

echo "<h2>3. Cek Koneksi Database</h2>";
try {
    if (isset($pdo)) {
        $status = $pdo->getAttribute(PDO::ATTR_CONNECTION_STATUS);
        echo "✅ Koneksi Database Berhasil! Status: $status<br>";
        
        // Cek tabel
        echo "<h3>Daftar Tabel Database:</h3>";
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        if ($tables) {
            echo "<ul>";
            foreach ($tables as $table) {
                echo "<li>$table</li>";
            }
            echo "</ul>";
        } else {
            echo "⚠️ Koneksi sukses tapi TIDAK ADA TABEL (Database kosong).<br>";
        }

    } else {
        echo "❌ Variabel \$pdo tidak ditemukan. Cek isi db.php Anda.<br>";
    }
} catch (Exception $e) {
    echo "❌ GAGAL KONEKSI DATABASE:<br>";
    echo "Pesan Error: <b>" . $e->getMessage() . "</b><br><br>";
    echo "<b>SOLUSI:</b><br>";
    echo "1. Buka file <code>api/db.php</code> di hosting.<br>";
    echo "2. Pastikan username, password, dan nama database sudah BENAR sesuai cPanel.<br>";
}
?>
