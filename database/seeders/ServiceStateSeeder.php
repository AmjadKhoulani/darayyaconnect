<?php

namespace Database\Seeders;

use App\Models\ServiceState;
use Illuminate\Database\Seeder;

class ServiceStateSeeder extends Seeder
{
    public function run(): void
    {
        ServiceState::updateOrCreate(
            ['service_key' => 'electricity'],
            [
                'name' => 'الكهرباء',
                'status_text' => 'مستقر',
                'status_color' => 'emerald',
                'icon' => 'Zap',
                'is_active' => true,
                'last_updated_at' => now(),
            ]
        );

        ServiceState::updateOrCreate(
            ['service_key' => 'water'],
            [
                'name' => 'المياه',
                'status_text' => 'ضخ',
                'status_color' => 'blue',
                'icon' => 'Droplets',
                'is_active' => true,
                'last_updated_at' => now(),
            ]
        );
                 
        ServiceState::updateOrCreate(
            ['service_key' => 'internet'],
            [
                'name' => 'الإنترنت',
                'status_text' => 'جيد',
                'status_color' => 'emerald',
                'icon' => 'Wifi',
                'is_active' => true,
                'last_updated_at' => now(),
            ]
        );
    }
}
