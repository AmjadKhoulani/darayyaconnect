<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

// We need to simulate a PUT request to update a study
use App\Models\AiStudy;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\AiStudyController;

echo "Testing AiStudy Update Simulation...\n";

$study = AiStudy::first();
if (!$study) die("No study found\n");

echo "Updating Study ID: {$study->id}\n";
echo "Initial Featured Status: " . ($study->is_featured ? 'YES' : 'NO') . "\n";

// Toggle featured status
$newFeaturedStatus = !$study->is_featured;

// Create request data
$data = $study->toArray();
$data['is_featured'] = $newFeaturedStatus;
$data['is_published'] = true; // Ensure published
// Ensure array fields are present
$data['scenario'] = $data['scenario'] ?? ['current' => '.', 'withProject' => '.'];
$data['economics'] = $data['economics'] ?? ['investment' => '.', 'revenue' => '.', 'payback' => '.', 'jobs' => '.'];
$data['social'] = $data['social'] ?? ['beneficiaries' => '.', 'impact' => '.'];
$data['implementation'] = $data['implementation'] ?? ['phase1' => '.', 'phase2' => '.', 'phase3' => '.'];

// Create request
$request = Request::create(
    route('admin.ai-studies.update', $study->id),
    'PUT',
    $data
);

// We need to bypass auth middlewares for this test or mock auth
// Since we are running cli script, it's easier to manually instantiate controller
// But validation requires request cycle. 
// Let's manually validate and call update logic to see if it works.

$controller = new AiStudyController();

// Mock the validation manually properly
// Or better: Just call the sync logic directly to verify IT works
// But we want to verifiable the Update method FLOW.

echo "Simulating Controller Update...\n";

// We can't easily simulate the full request lifecycle with auth in a simple script without login.
// So let's test the sync logic specifically which we moved to separate methods.

// Reflection to access private methods
$reflection = new ReflectionClass(AiStudyController::class);
$syncMethod = $reflection->getMethod('syncCarouselItem');
$syncMethod->setAccessible(true);
$removeMethod = $reflection->getMethod('removeCarouselItem');
$removeMethod->setAccessible(true);

if ($newFeaturedStatus) {
    echo "Simulating: Marking as FEATURED\n";
    $study->is_featured = true;
    $study->save(); // Save first so model has new state
    $syncMethod->invoke($controller, $study);
    echo "Called syncCarouselItem\n";
} else {
    echo "Simulating: Marking as NOT FEATURED\n";
    $study->is_featured = false;
    $study->save();
    $removeMethod->invoke($controller, $study);
    echo "Called removeCarouselItem\n";
}

// Check result
$carouselExists = \App\Models\CarouselItem::where('type', 'ai_study')->where('title', $study->title)->exists();
echo "Carousel Item Exists? " . ($carouselExists ? 'YES' : 'NO') . "\n";

if ($newFeaturedStatus && $carouselExists) echo "SUCCESS: Added to carousel\n";
elseif (!$newFeaturedStatus && !$carouselExists) echo "SUCCESS: Removed from carousel\n";
else echo "FAILURE: State mismatch\n";

echo "Done.\n";
