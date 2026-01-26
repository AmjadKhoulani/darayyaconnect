<?php

echo "--- V2 DIAGNOSTIC START ---\n";

require __DIR__.'/vendor/autoload.php';

echo "1. Autoload loaded.\n";

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "2. Laravel Bootstrapped.\n";

// Test Class Existence
$classes = [
    'App\Http\Controllers\Admin\ReportController',
    'App\Models\Report',
    'App\Models\User'
];

foreach ($classes as $class) {
    if (class_exists($class)) {
        echo "[OK] Class exists: $class\n";
    } else {
        echo "[FAIL] Class NOT FOUND: $class\n";
    }
}

// Test Route Registration
echo "3. Testing Route 'admin.reports.index'...\n";
if (\Route::has('admin.reports.index')) {
    echo "[OK] Route 'admin.reports.index' is registered.\n";
    $route = \Route::getRoutes()->getByName('admin.reports.index');
    echo "   Action: " . $route->getActionName() . "\n";
} else {
    echo "[FAIL] Route 'admin.reports.index' NOT FOUND.\n";
}

// Test Database Fetch
echo "4. Testing Report Model Fetch...\n";
try {
    $report = \App\Models\Report::with('user')->latest()->first();
    if ($report) {
        echo "[OK] Fetched Report ID: {$report->id}\n";
        echo "   User: " . ($report->user ? $report->user->name : 'NULL') . "\n";
    } else {
        echo "[INFO] No reports found, but query worked.\n";
    }
} catch (\Exception $e) {
    echo "[FAIL] Database Query Error: " . $e->getMessage() . "\n";
}

echo "--- V2 DIAGNOSTIC END ---\n";
