<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\AiStudy;
use App\Models\CarouselItem;

echo "Testing featured studies functionality...\n\n";

// Get first study
$study = AiStudy::first();

if (!$study) {
    echo "❌ No studies found in database\n";
    exit(1);
}

echo "Found study: {$study->title}\n";
echo "Current is_featured: " . ($study->is_featured ? 'true' : 'false') . "\n";
echo "Current is_published: " . ($study->is_published ? 'true' : 'false') . "\n\n";

// Mark as featured
$study->is_featured = true;
$study->is_published = true;
$study->save();

echo "✓ Marked study as featured\n\n";

// Check if carousel item was created
$carouselItem = CarouselItem::where('type', 'ai_study')
    ->where('title', $study->title)
    ->first();

if ($carouselItem) {
    echo "✓ Carousel item found!\n";
    echo "  - Title: {$carouselItem->title}\n";
    echo "  - Type: {$carouselItem->image_type}\n";
    echo "  - Gradient: {$carouselItem->gradient}\n";
    echo "  - Link: {$carouselItem->button_link}\n";
} else {
    echo "❌ No carousel item found - auto-sync only works on save via controller\n";
    echo "   Creating manually...\n";
    
    CarouselItem::create([
        'title' => $study->title,
        'description' => $study->summary,
        'image_type' => 'gradient',
        'gradient' => $study->gradient,
        'button_text' => 'اقرأ المزيد',
        'button_link' => route('ai-studies'),
        'type' => 'ai_study',
        'order' => $study->display_order ?? 0,
        'is_active' => $study->is_published,
    ]);
    
    echo "✓ Carousel item created manually\n";
}

echo "\n=== Summary ===\n";
echo "Featured studies: " . AiStudy::where('is_featured', true)->count() . "\n";
echo "Carousel items: " . CarouselItem::count() . "\n";
echo "AI study carousel items: " . CarouselItem::where('type', 'ai_study')->count() . "\n";
