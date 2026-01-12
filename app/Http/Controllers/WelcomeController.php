<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Foundation\Application;
use App\Models\InfrastructurePoint;

class WelcomeController extends Controller
{
    public function index()
    {
        // 1. Fetch Duty Pharmacies (Existing Logic)
        $dutyPharmacies = DB::table('directory_contacts')
            ->where('category', 'health')
            ->where('name', 'like', '%صيدلية%')
            ->where('status', 'open')
            ->get();

        // 2. Fetch City Statistics (New Logic)
        $stats = [
            'schools' => InfrastructurePoint::where('type', 'school')->count(),
            'clinics' => InfrastructurePoint::where('type', 'health_center')->count(),
            'wells' => InfrastructurePoint::where('type', 'well')->count(),
            'transformers' => InfrastructurePoint::where('type', 'transformer')->count(),
            'parks' => InfrastructurePoint::where('type', 'park')->count(),
        ];

        // 3. Fetch Dynamic Content (Feed)
        $initiatives_feed = \App\Models\Initiative::where('status', 'active')
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'initiative',
                    'author' => 'المجتمع المحلي',
                    'role' => 'مبادرة',
                    'time' => $item->created_at->diffForHumans(),
                    'title' => $item->title,
                    'content' => $item->description,
                    'color' => 'emerald',
                    'image' => $item->image ? asset('storage/' . $item->image) : null,
                ];
            });

        $books_feed = \App\Models\Book::where('status', 'available')
             ->latest()
             ->take(3)
             ->get()
             ->map(function($book) {
                 return [
                    'id' => $book->id,
                    'type' => 'book',
                    'author' => 'المكتبة التبادلية',
                    'role' => 'ثقافة',
                    'time' => $book->created_at->diffForHumans(),
                    'title' => "كتاب متاح: " . $book->title,
                    'content' => "المؤلف: {$book->author}. الحالة: {$book->condition}. التواصل: {$book->contact_info}",
                    'color' => 'blue',
                    'image' => $book->cover_image ? asset('storage/' . $book->cover_image) : null, 
                 ];
             });

        $alerts_feed = \App\Models\ServiceAlert::active()
            ->latest()
            ->take(2)
            ->get()
            ->map(function($alert) {
                 return [
                    'id' => $alert->id,
                    'type' => 'alert',
                    'author' => 'غرفة العمليات',
                    'role' => 'تنبيه هام',
                    'time' => $alert->created_at->diffForHumans(),
                    'title' => $alert->title,
                    'content' => $alert->body,
                    'color' => 'rose',
                    'image' => null
                 ];
            });

        $feed = collect([...$alerts_feed, ...$initiatives_feed, ...$books_feed]); 

        // 4. Fetch Detailed Section Data
        $studies = \App\Models\AiStudy::where('category', '!=', 'awareness')
            ->where('category', '!=', 'global')
            ->latest()
            ->take(4)
            ->get();

        $awareness = \App\Models\AiStudy::where('category', 'awareness')
            ->orWhere('category', 'education')
            ->latest()
            ->take(4)
            ->get();

        $globalExperiences = \App\Models\AiStudy::where('category', 'global')
            ->latest()
            ->take(4)
            ->get();

        $volunteerOpportunities = \App\Models\VolunteerOpportunity::where('status', 'active')
            ->latest()
            ->take(4)
            ->get();

        $allInitiatives = \App\Models\Initiative::latest()->take(4)->get();

        $lostFoundItems = \App\Models\LostFoundItem::active()
            ->latest()
            ->take(4)
            ->get();

        $latestBooks = \App\Models\Book::where('status', 'available')
            ->latest()
            ->take(4)
            ->get();

        // 5. Fetch Featured Content
        $featuredStudy = \App\Models\AiStudy::latest()->first();
        
        $latestDiscussions = \App\Models\Discussion::with('user')
            ->latest()
            ->take(3)
            ->get()
            ->map(function($d) {
                return [
                    'id' => $d->id,
                    'title' => $d->title,
                    'category' => $d->category,
                    'replies_count' => $d->replies()->count(),
                    'user' => $d->user ? $d->user->name : 'مستخدم محذوف',
                    'time' => $d->created_at->diffForHumans(),
                ];
            });

        // 6. Render Welcome Page
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'dutyPharmacies' => $dutyPharmacies,
            'cityStats' => $stats,
            'feed' => $feed,
            'featuredStudy' => $featuredStudy,
            'latestDiscussions' => $latestDiscussions,
            'sections' => [
                'studies' => $studies,
                'awareness' => $awareness,
                'global' => $globalExperiences,
                'opportunities' => $volunteerOpportunities,
                'initiatives' => $allInitiatives,
                'lostFound' => $lostFoundItems,
                'books' => $latestBooks,
            ]
        ]);
    }
}
