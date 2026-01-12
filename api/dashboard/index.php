<?php
require_once '../db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // 1. Total Jemaat
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM jemaat");
    $totalJemaat = $stmt->fetch()['total'];

    // 2. Breakdown Stats
    // 2. Breakdown Stats
    // User reported stats are swapped (KBB should be larger). Swapping the source columns to match visual expectation.
    // 2. Breakdown Stats
    // User reported stats are swapped (KBB should be larger). Swapping the source columns to match visual expectation.
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM jemaat WHERE luar_kbb = 1");
    $totalKBB = $stmt->fetch()['total'];

    $stmt = $pdo->query("SELECT COUNT(*) as total FROM jemaat WHERE kbb = 1");
    $totalLuarKBB = $stmt->fetch()['total'];

    $stmt = $pdo->query("SELECT COUNT(*) as total FROM jemaat WHERE sdh_sidi = 1");
    $totalSidi = $stmt->fetch()['total'];

    // 3. Per Sektor
    $sektorData = [];
    $stmt = $pdo->query("SELECT sektor, 
                                COUNT(*) as total,
                                SUM(CASE WHEN luar_kbb = 1 THEN 1 ELSE 0 END) as kbb,
                                SUM(CASE WHEN kbb = 1 THEN 1 ELSE 0 END) as luar_kbb
                         FROM jemaat GROUP BY sektor ORDER BY sektor ASC");
    while ($row = $stmt->fetch()) {
        // Get category breakdown for this sektor
        $catStmt = $pdo->prepare("SELECT kategori, COUNT(*) as total FROM jemaat WHERE sektor = ? GROUP BY kategori");
        $catStmt->execute([$row['sektor']]);
        $kategoriData = [];
        while($catRow = $catStmt->fetch()) {
            $kategoriData[$catRow['kategori']] = $catRow['total'];
        }
        $row['kategori'] = $kategoriData;
        $sektorData[] = $row;
    }

    // 4. Birthdays & Incomplete
    $currentDay = date('j');
    $currentMonth = date('n');
    $currentYear = date('Y');

    // Today
    $stmt = $pdo->prepare("SELECT nama, sektor, kategori, YEAR(CURDATE()) - thn_lahir as umur FROM jemaat WHERE bln_lahir = ? AND tgl_lahir = ?");
    $stmt->execute([$currentMonth, $currentDay]);
    $birthdaysToday = $stmt->fetchAll();

    // Tomorrow (Handle month rollover)
    $tomorrow = new DateTime('tomorrow');
    $tomorrowDay = $tomorrow->format('j');
    $tomorrowMonth = $tomorrow->format('n');
    
    $stmt = $pdo->prepare("SELECT nama, sektor, kategori, YEAR(CURDATE()) - thn_lahir as umur FROM jemaat WHERE bln_lahir = ? AND tgl_lahir = ?");
    $stmt->execute([$tomorrowMonth, $tomorrowDay]);
    $birthdaysTomorrow = $stmt->fetchAll();

    // Incomplete Data (Missing Birthdate Info)
    $stmt = $pdo->query("SELECT nama, sektor, kategori FROM jemaat WHERE tgl_lahir IS NULL OR bln_lahir IS NULL OR thn_lahir IS NULL LIMIT 10");
    $incompleteBirthdates = $stmt->fetchAll();

    echo json_encode([
        'totalStats' => [
            'totalJemaat' => $totalJemaat,
            'totalKBB' => $totalKBB,
            'totalLuarKBB' => $totalLuarKBB,
            'totalSidiTotal' => $totalSidi
        ],
        'sektorData' => $sektorData,
        'birthdayData' => [
            'birthdaysToday' => $birthdaysToday,
            'birthdaysTomorrow' => $birthdaysTomorrow,
            'incompleteBirthdates' => $incompleteBirthdates
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
