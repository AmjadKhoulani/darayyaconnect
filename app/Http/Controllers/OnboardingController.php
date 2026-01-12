<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\InfrastructurePoint;
use Illuminate\Support\Facades\Auth;

class OnboardingController extends Controller
{
    public function show()
    {
        return Inertia::render('Onboarding/LocationPicker');
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
            ]);

            /** @var User $user */
            $user = Auth::user();
            
            if (!$user) {
                return redirect()->route('login');
            }

            $user->latitude = $request->latitude;
            $user->longitude = $request->longitude;

            // Auto-Detect Neighborhood
            $zones = InfrastructurePoint::where('type', 'neighborhood_zone')->get();
            $detectedNeighborhood = 'Unknown';

            foreach ($zones as $zone) {
                // Ensure geometry is an array and has coordinates
                if (isset($zone->geometry['coordinates'][0])) {
                    if ($this->pointInPolygon($request->longitude, $request->latitude, $zone->geometry['coordinates'][0])) {
                        $detectedNeighborhood = $zone->name;
                        break;
                    }
                }
            }

            // Fallback
            if ($detectedNeighborhood === 'Unknown' && $zones->count() > 0) {
                 $detectedNeighborhood = $zones->first()->name;
            }

            $user->neighborhood = $detectedNeighborhood;
            $user->save();

            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            \Log::error('Onboarding Error: ' . $e->getMessage());
            // Fail gracefully to dashboard even if detection fails
            return redirect()->route('dashboard');
        }
    }

    // Ray-Casting Algorithm to check if point is in polygon
    private function pointInPolygon($x, $y, $polygon)
    {
        $inside = false;
        $count = count($polygon);
        $j = $count - 1;

        for ($i = 0; $i < $count; $i++) {
            $xi = $polygon[$i][0];
            $yi = $polygon[$i][1];
            $xj = $polygon[$j][0];
            $yj = $polygon[$j][1];

            $intersect = (($yi > $y) != ($yj > $y))
                && ($x < ($xj - $xi) * ($y - $yi) / ($yj - $yi) + $xi);
            
            if ($intersect) $inside = !$inside;
            $j = $i;
        }

        return $inside;
    }
}
