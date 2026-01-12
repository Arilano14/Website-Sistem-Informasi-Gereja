<?php
require_once 'db.php';
header('Content-Type: application/json');

try {
    $tables = ['jemaat'];
    $columns = ['kbb', 'luar_kbb', 'sdh_sidi', 'kategori'];
    
    $results = [];
    
    foreach ($columns as $col) {
        $stmt = $pdo->query("SELECT DISTINCT $col FROM jemaat");
        $results[$col] = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        // Also check column type if possible (naive check via valid values)
    }

    // Check count of rows where kbb is 1 vs 'Ya'
    $counts = [];
    $counts['kbb_is_1'] = $pdo->query("SELECT COUNT(*) FROM jemaat WHERE kbb = 1")->fetchColumn();
    $counts['kbb_is_Ya'] = $pdo->query("SELECT COUNT(*) FROM jemaat WHERE kbb = 'Ya'")->fetchColumn();
    $counts['kbb_is_0'] = $pdo->query("SELECT COUNT(*) FROM jemaat WHERE kbb = 0")->fetchColumn();
    
    // Check specific problematic query
    $counts['kbb_legacy_query_check'] = $pdo->query("SELECT COUNT(*) FROM jemaat WHERE kbb = 1 OR kbb = 'Ya'")->fetchColumn();

    echo json_encode(['distinct_values' => $results, 'counts' => $counts]);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
