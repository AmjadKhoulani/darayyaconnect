<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InfrastructureNode;
use App\Models\InfrastructureLine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InfrastructureInventoryController extends Controller
{
    public function index()
    {
        $nodes = InfrastructureNode::all()->map(function($node) {
            return [
                'id' => $node->id,
                'type' => 'node',
                'category' => $node->type,
                'serial_number' => $node->serial_number,
                'status' => $node->status,
                'meta' => $node->meta,
                'is_published' => $node->is_published,
                'created_at' => $node->created_at,
                'location' => $node->latitude . ', ' . $node->longitude
            ];
        });

        $lines = InfrastructureLine::all()->map(function($line) {
            return [
                'id' => $line->id,
                'type' => 'line',
                'category' => $line->type,
                'serial_number' => $line->serial_number,
                'status' => $line->status,
                'meta' => $line->meta,
                'is_published' => $line->is_published,
                'created_at' => $line->created_at,
                'location' => count($line->coordinates) . ' points'
            ];
        });

        $assets = $nodes->concat($lines)->sortByDesc('created_at')->values();

        return Inertia::render('Admin/Infrastructure/Inventory', [
            'assets' => $assets
        ]);
    }
}
