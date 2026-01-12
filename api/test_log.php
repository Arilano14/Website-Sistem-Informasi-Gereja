<?php
$logFile = 'debug_test.txt';
if (file_put_contents($logFile, "Test write at " . date('Y-m-d H:i:s'))) {
    echo "Write successful to $logFile";
} else {
    echo "Write failed";
}
?>
