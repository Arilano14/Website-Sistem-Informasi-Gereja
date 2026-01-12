<?php
require_once '../db.php';

// KONFIGURASI ADMIN BARU
$email = 'admin@gbkp.com';
$password = 'admin123'; // Password sementara
$name = 'Super Admin';

try {
    // 1. Cek apakah tabel dan kolom password ada
    $pdo->query("SELECT password FROM auth_users LIMIT 1");

    // 2. Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // 3. Cek user
    $stmt = $pdo->prepare("SELECT id FROM auth_users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        // UPDATE jika user ada
        $update = $pdo->prepare("UPDATE auth_users SET password = ?, name = ? WHERE email = ?");
        $update->execute([$hashedPassword, $name, $email]);
        echo "<h1>SUKSES UPDATE</h1>";
        echo "User <b>$email</b> berhasil di-reset.<br>";
        echo "Password baru: <b>$password</b>";
    } else {
        // INSERT jika user tidak ada
        $insert = $pdo->prepare("INSERT INTO auth_users (name, email, password, role) VALUES (?, ?, ?, 'admin')");
        $insert->execute([$name, $email, $hashedPassword]);
        echo "<h1>SUKSES BUAT USER</h1>";
        echo "User <b>$email</b> berhasil dibuat.<br>";
        echo "Password: <b>$password</b>";
    }

} catch (Exception $e) {
    echo "<h1>ERROR</h1>";
    echo "Gagal: " . $e->getMessage() . "<br>";
    echo "Kemungkinan penyebab: Kolom 'password' belum ada di tabel 'auth_users'. Jalankan add_password_column.php dulu.";
}
?>
