<?php

echo "--- V3 CONTROLER DIAGNOSTIC ---\n";

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\Admin\ReportController;
use Illuminate\Http\Request;

try {
    echo "1. Instantiating ReportController...\n";
    $controller = new ReportController();
    
    echo "2. Mocking Request...\n";
    $request = Request::create('/admin/reports', 'GET');
    
    echo "3. Executing index method...\n";
    $response = $controller->index($request);
    
    echo "4. Inspecting Response...\n";
    if ($response instanceof \Inertia\Response) {
        echo "[OK] Returned Inertia Response.\n";
        
        $props = $response->toResponse($request)->getData(true);
        // Depending on Inertia implementation, getting access to props might differ.
        // But if we got here, the fetch didn't crash.
        
        echo "[OK] Controller execution finished without exception.\n";
    } else {
        echo "[WARN] Returned unknown response type: " . get_class($response) . "\n";
    }

} catch (\Exception $e) {
    echo "\n[FATAL] Controller Crashed!\n";
    echo "Message: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "Trace:\n" . $e->getTraceAsString() . "\n";
}
echo "--- V3 END ---\n";
