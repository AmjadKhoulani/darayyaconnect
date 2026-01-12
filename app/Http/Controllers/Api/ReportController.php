namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Store a new citizen report
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'category' => 'required|in:electricity,water,sanitation,safety',
            'severity' => 'required|integer|min:1|max:5',
            'description' => 'required|string|max:1000',
            'location_id' => 'nullable|exists:locations,id',
        ]);

        $point = "POINT({$validated['longitude']} {$validated['latitude']})";

        $report = Report::create([
            'user_id' => $request->user()?->id,
            'location_id' => $validated['location_id'] ?? null,
            'coordinates' => DB::raw("ST_GeomFromText('$point')"),
            'category' => $validated['category'],
            'severity' => $validated['severity'],
            'description' => $validated['description'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'تم استلام البلاغ بنجاح',
            'id' => $report->id,
        ], 201);
    }
}
