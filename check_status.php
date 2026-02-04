<?php

use App\Models\InfrastructurePoint;
use App\Models\InfrastructureNode;
use App\Models\Report;

// Load Laravel application
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Infrastructure POINTS (Facilities) ---\n";
$counts = InfrastructurePoint::select('status', \DB::raw('count(*) as total'))
    ->groupBy('status')
    ->get();

foreach ($counts as $count) {
    echo "{$count->status}: {$count->total}\n";
}

echo "\n--- Infrastructure NODES (Network Elements) ---\n";
$nodeCounts = InfrastructureNode::select('type', \DB::raw('count(*) as total'))
    ->groupBy('type')
    ->get();

foreach ($nodeCounts as $count) {
    echo "{$count->type}: {$count->total}\n";
}

echo "\n--- REPORTS (Public Issues) ---\n";
$reportCounts = Report::select('category', 'status', \DB::raw('count(*) as total'))
    ->groupBy('category', 'status')
    ->get();

foreach ($reportCounts as $count) {
    echo "{$count->category} ({$count->status}): {$count->total}\n";
}
