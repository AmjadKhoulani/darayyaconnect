<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InfrastructureLine;
use App\Models\InfrastructureNode;
use Illuminate\Http\Request;

class InfrastructureController extends Controller
{
    public function index()
    {
        return response()->json([
            'lines' => InfrastructureLine::all(),
            'nodes' => InfrastructureNode::all()
        ]);
    }

    public function storeLine(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'coordinates' => 'required|array',
            'status' => 'nullable|string',
            'meta' => 'nullable|array'
        ]);

        $line = InfrastructureLine::create($validated);
        return response()->json($line, 201);
    }

    public function storeNode(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'status' => 'nullable|string',
            'meta' => 'nullable|array'
        ]);

        $node = InfrastructureNode::create($validated);
        return response()->json($node, 201);
    }

    public function destroyLine($id)
    {
        InfrastructureLine::destroy($id);
        return response()->json(null, 204);
    }

    public function destroyNode($id)
    {
        InfrastructureNode::destroy($id);
        return response()->json(null, 204);
    }
}
