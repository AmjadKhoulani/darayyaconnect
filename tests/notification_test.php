<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;

$user = User::where('phone_number', '0912345678')->first(); 

if ($user) {
    echo "Running notification test for user: {$user->name} ({$user->id})\n";
    
    // Acting as the user to test the route
    $response = $this->actingAs($user)->get('/api/notifications/test');
    
    echo "Status: " . $response->status() . "\n";
    echo "Response: " . $response->content() . "\n";
} else {
    echo "User not found for testing.\n";
}
