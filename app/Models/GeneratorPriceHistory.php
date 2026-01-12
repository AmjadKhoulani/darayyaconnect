<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GeneratorPriceHistory extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $table = 'generator_price_history';

    public $timestamps = false;

    protected $fillable = [
        'generator_id',
        'old_price',
        'new_price',
        'changed_by_user_id',
        'changed_at',
    ];

    protected $casts = [
        'old_price' => 'decimal:2',
        'new_price' => 'decimal:2',
        'changed_at' => 'datetime',
    ];

    public function generator()
    {
        return $this->belongsTo(Generator::class);
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by_user_id');
    }
}
