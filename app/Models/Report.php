<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\InfrastructureNode;
use App\Models\InfrastructureLine;
use App\Models\InfrastructurePoint;

class Report extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'category',
        'severity',
        'description',
        'location_id',
        'coordinates',
        'latitude',
        'longitude',
        'status',
        'images',
        'user_id',
        'department_id',
        'department_assigned',
        'infrastructure_node_id',
        'infrastructure_line_id'
    ];

    public function infrastructureNode()
    {
        return $this->belongsTo(InfrastructureNode::class);
    }

    public function infrastructureLine()
    {
        return $this->belongsTo(InfrastructureLine::class);
    }

    public function infrastructurePoint()
    {
        return $this->belongsTo(InfrastructurePoint::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
