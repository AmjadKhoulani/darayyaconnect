<?php

echo "--- ENCODING DIAGNOSTIC START ---\n";

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Report;

$chunkSize = 100;
$maxToCheck = 1000;
$checked = 0;

echo "Checking first $maxToCheck reports for invalid UTF-8 characters...\n";

Report::with('user')->latest()->chunk($chunkSize, function($reports) use (&$checked, $maxToCheck) {
    if ($checked >= $maxToCheck) return false;

    foreach ($reports as $report) {
        $checked++;
        
        // precise check for the report attributes
        $data = $report->toArray();
        
        // We try to json_encode this single report.
        $json = json_encode($data);
        
        if ($json === false) {
            echo "\n[FAIL] JSON Encode Error for Report ID: {$report->id}\n";
            echo "Error: " . json_last_error_msg() . "\n";
            
            // Allow recursive check to find the specific field
            foreach ($data as $key => $value) {
                if (is_string($value)) {
                    if (json_encode([$key => $value]) === false) {
                        echo "   !!! BAD FIELD: [$key]\n";
                        echo "   Value (Base64): " . base64_encode($value) . "\n";
                    }
                }
                // Check user
                if ($key === 'user' && is_array($value)) {
                     foreach ($value as $uKey => $uValue) {
                        if (is_string($uValue) && json_encode([$uKey => $uValue]) === false) {
                            echo "   !!! BAD USER FIELD: [$uKey]\n";
                            echo "   Value (Base64): " . base64_encode($uValue) . "\n";
                        }
                     }
                }
            }
        } else {
            // echo "."; // print dot for success to save space
        }
    }
});

echo "\nChecked $checked reports.\n";
echo "--- ENCODING DIAGNOSTIC END ---\n";
