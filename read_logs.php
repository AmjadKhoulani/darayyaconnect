<?php

$logFile = __DIR__ . '/storage/logs/laravel.log';

if (!file_exists($logFile)) {
    die("Log file not found at $logFile\n");
}

$content = file_get_contents($logFile);
if (!$content) {
    die("Could not read log file.\n");
}

// Split into lines
$lines = explode("\n", $content);
$count = count($lines);
$maxLines = 200; // Look at last 200 lines
$start = max(0, $count - $maxLines);

echo "--- LAST $maxLines LINES OF LOG ---\n";

$buffer = [];
$foundError = false;

for ($i = $start; $i < $count; $i++) {
    $line = $lines[$i];
    
    // Simple detection of stack trace start or error declaration
    if (strpos($line, 'local.ERROR') !== false || strpos($line, 'production.ERROR') !== false) {
        $foundError = true;
        // Keep only the buffer from this error onwards if we want strict separation, 
        // but for now just print everything from the last few errors.
    }
    
    if ($foundError || $i > $count - 50) {
        echo $line . "\n";
    }
}

if (!$foundError) {
    echo "No recent 'local.ERROR' or 'production.ERROR' found in the last $maxLines lines.\n";
    echo "Here are the very last 10 lines just in case:\n";
    for ($i = $count - 10; $i < $count; $i++) {
        echo ($lines[$i] ?? '') . "\n";
    }
}
