<?php

namespace Database\Seeders;

use App\Models\ServiceState;
use Illuminate\Database\Seeder;

class ServiceStateSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'service_key' => 'electricity',
                'name' => 'الكهرباء',
                'status_text' => 'مستقر',
                'status_color' => 'emerald',
                'icon' => 'Zap',
            ],
            [
                'service_key' => 'water',
                'name' => 'المياه',
                'status_text' => 'ضخ',
                'status_color' => 'emerald',
                'icon' => 'Droplets',
            ],
            [
                'service_key' => 'internet',
                'name' => 'الإنترنت',
                'status_text' => 'جيد',
                'status_color' => 'emerald',
                'icon' => 'Wifi',
            ],
            [
                'service_key' => 'phone',
                'name' => 'الاتصالات',
                'status_text' => 'يعمل',
                'status_color' => 'emerald',
                'icon' => 'Phone',
            ],
            [
                'service_key' => 'bakery',
                'name' => 'الأفران',
                'status_text' => 'متوفر',
                'status_color' => 'emerald',
                'icon' => 'HardHat',
            ],
        ];

        foreach ($services as $service) {
            ServiceState::updateOrCreate(
                ['service_key' => $service['service_key']],
                array_merge($service, [
                    'is_active' => true,
                    'last_updated_at' => now(),
                ])
            );
        }
    }
}
