<?php

use App\Models\AiStudy;
use App\Models\CarouselItem;

// Sync all featured studies to carousel
$featuredStudies = AiStudy::where('is_featured', true)->where('is_published', true)->get();

echo "Found {$featuredStudies->count()} featured studies\n\n";

foreach ($featuredStudies as $study) {
    $exists = CarouselItem::where('type', 'ai_study')
        ->where('button_link', route('ai-studies'))
        ->where('title', $study->title)
        ->exists();
    
    if (!$exists) {
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
        
        echo "✓ Created carousel item for: {$study->title}\n";
    } else {
        echo "- Already exists: {$study->title}\n";
    }
}

echo "\nDone!\n";
