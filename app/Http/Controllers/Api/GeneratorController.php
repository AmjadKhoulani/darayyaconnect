<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Generator;
use App\Models\GeneratorRating;
use App\Models\GeneratorPriceHistory;
use App\Models\GeneratorSubscription;
use App\Notifications\GeneratorPriceUpdateNotification;
use App\Notifications\GeneratorIssueNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GeneratorController extends Controller
{
    // Get all generators
    public function index(Request $request)
    {
        $query = Generator::with(['ratings']);

        // Filter by neighborhood
        if ($request->has('neighborhood')) {
            $query->byNeighborhood($request->neighborhood);
        }

        // Filter by status
        if ($request->has('status') && in_array($request->status, ['active', 'down', 'maintenance'])) {
            $query->where('status', $request->status);
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('ampere_price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('ampere_price', '<=', $request->max_price);
        }

        $generators = $query->latest()->get();

        return response()->json($generators);
    }

    // Get single generator
    public function show($id)
    {
        $generator = Generator::with([
            'ratings' => function($q) {
                $q->latest()->limit(10);
            },
            'priceHistory' => function($q) {
                $q->limit(5);
            }
        ])->findOrFail($id);

        // Check if user is subscribed
        $isSubscribed = false;
        if (Auth::check()) {
            $isSubscribed = GeneratorSubscription::where('user_id', Auth::id())
                ->where('generator_id', $id)
                ->exists();
        }

        $generator->is_subscribed = $isSubscribed;

        return response()->json($generator);
    }

    // Create new generator (admin only)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'owner_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'neighborhood' => 'required|string',
            'street_address' => 'nullable|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'ampere_price' => 'required|numeric|min:0',
            'operating_hours' => 'nullable|integer|min:0|max:24',
            'status' => 'sometimes|in:active,down,maintenance',
        ]);

        $validated['last_price_update'] = now();

        $generator = Generator::create($validated);

        return response()->json([
            'message' => 'تم إضافة المولدة بنجاح',
            'generator' => $generator
        ], 201);
    }

    // Update generator
    public function update(Request $request, $id)
    {
        $generator = Generator::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'owner_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'neighborhood' => 'sometimes|string',
            'street_address' => 'nullable|string',
            'operating_hours' => 'nullable|integer|min:0|max:24',
            'status' => 'sometimes|in:active,down,maintenance',
        ]);

        $generator->update($validated);

        return response()->json([
            'message' => 'تم تحديث المعلومات',
            'generator' => $generator
        ]);
    }

    // Update price (triggers notification)
    public function updatePrice(Request $request, $id)
    {
        $generator = Generator::findOrFail($id);

        $request->validate([
            'new_price' => 'required|numeric|min:0'
        ]);

        $oldPrice = $generator->ampere_price;
        $newPrice = $request->new_price;

        if ($oldPrice == $newPrice) {
            return response()->json(['message' => 'السعر لم يتغير']);
        }

        // Update generator price
        $generator->update([
            'ampere_price' => $newPrice,
            'last_price_update' => now()
        ]);

        // Save price history
        GeneratorPriceHistory::create([
            'generator_id' => $generator->id,
            'old_price' => $oldPrice,
            'new_price' => $newPrice,
            'changed_by_user_id' => Auth::id(),
            'changed_at' => now()
        ]);

        // Send notifications to subscribers
        $this->notifyPriceChange($generator, $oldPrice, $newPrice);

        return response()->json([
            'message' => 'تم تحديث السعر بنجاح',
            'generator' => $generator
        ]);
    }

    // Rate a generator
    public function rate(Request $request, $id)
    {
        $generator = Generator::findOrFail($id);

        $validated = $request->validate([
            'overall_rating' => 'required|integer|min:1|max:5',
            'service_quality' => 'nullable|integer|min:1|max:5',
            'punctuality' => 'nullable|integer|min:1|max:5',
            'power_stability' => 'nullable|integer|min:1|max:5',
            'customer_service' => 'nullable|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        $validated['generator_id'] = $generator->id;
        $validated['user_id'] = Auth::id();
        $validated['is_anonymous'] = true;

        // Update or create rating
        $rating = GeneratorRating::updateOrCreate(
            [
                'generator_id' => $generator->id,
                'user_id' => Auth::id()
            ],
            $validated
        );

        return response()->json([
            'message' => 'شكراً لتقييمك!',
            'rating' => $rating
        ]);
    }

    // Get ratings for a generator
    public function getRatings($id)
    {
        $generator = Generator::findOrFail($id);
        
        $ratings = $generator->ratings()->latest()->paginate(20);
        
        $stats = [
            'average' => $generator->average_rating,
            'count' => $generator->ratings_count,
            'breakdown' => [
                'service_quality' => round($generator->ratings()->avg('service_quality'), 1),
                'punctuality' => round($generator->ratings()->avg('punctuality'), 1),
                'power_stability' => round($generator->ratings()->avg('power_stability'), 1),
                'customer_service' => round($generator->ratings()->avg('customer_service'), 1),
            ],
            'distribution' => [
                5 => $generator->ratings()->where('overall_rating', 5)->count(),
                4 => $generator->ratings()->where('overall_rating', 4)->count(),
                3 => $generator->ratings()->where('overall_rating', 3)->count(),
                2 => $generator->ratings()->where('overall_rating', 2)->count(),
                1 => $generator->ratings()->where('overall_rating', 1)->count(),
            ]
        ];

        return response()->json([
            'stats' => $stats,
            'ratings' => $ratings
        ]);
    }

    // Subscribe to notifications
    public function subscribe(Request $request, $id)
    {
        $generator = Generator::findOrFail($id);

        $subscription = GeneratorSubscription::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'generator_id' => $generator->id
            ],
            [
                'notify_price_change' => $request->input('notify_price_change', true),
                'notify_issues' => $request->input('notify_issues', true),
            ]
        );

        return response()->json([
            'message' => 'تم الاشتراك بالإشعارات',
            'subscription' => $subscription
        ]);
    }

    // Unsubscribe
    public function unsubscribe($id)
    {
        $generator = Generator::findOrFail($id);

        GeneratorSubscription::where('user_id', Auth::id())
            ->where('generator_id', $generator->id)
            ->delete();

        return response()->json(['message' => 'تم إلغاء الاشتراك']);
    }

    // Report issue
    public function reportIssue(Request $request, $id)
    {
        $generator = Generator::findOrFail($id);

        $request->validate([
            'issue_type' => 'required|in:power_outage,maintenance,other',
            'description' => 'nullable|string|max:500'
        ]);

        // Update status if power outage
        if ($request->issue_type === 'power_outage') {
            $generator->update(['status' => 'down']);
        }

        // Send notifications to subscribers
        $this->notifyIssue($generator, $request->description ?? $request->issue_type);

        return response()->json(['message' => 'تم الإبلاغ عن المشكلة']);
    }

    // Delete generator
    public function destroy($id)
    {
        $generator = Generator::findOrFail($id);
        $generator->delete();

        return response()->json(['message' => 'تم حذف المولدة']);
    }

    /**
     * Notify subscribers about price change
     */
    private function notifyPriceChange(Generator $generator, float $oldPrice, float $newPrice)
    {
        $subscribers = GeneratorSubscription::where('generator_id', $generator->id)
            ->where('notify_price_change', true)
            ->with('user')
            ->get();

        foreach ($subscribers as $subscription) {
            $subscription->user->notify(new GeneratorPriceUpdateNotification($generator, $oldPrice, $newPrice));
        }
    }

    /**
     * Notify subscribers about generator issue
     */
    private function notifyIssue(Generator $generator, string $issue)
    {
        $subscribers = GeneratorSubscription::where('generator_id', $generator->id)
            ->where('notify_issues', true)
            ->with('user')
            ->get();

        foreach ($subscribers as $subscription) {
            $subscription->user->notify(new GeneratorIssueNotification($generator, Auth::user(), $issue));
        }
    }
}
