<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Governorate;
use Illuminate\Database\Seeder;

class SyriaLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            [
                'name_en' => 'Damascus',
                'name_ar' => 'دمشق',
                'code' => 'DAM',
                'cities' => [
                    ['name_en' => 'Damascus', 'name_ar' => 'دمشق', 'code' => 'DAM-C'],
                    ['name_en' => 'Yarmouk', 'name_ar' => 'اليرموك', 'code' => 'YAR'],
                ]
            ],
            [
                'name_en' => 'Rif Dimashq',
                'name_ar' => 'ريف دمشق',
                'code' => 'RIF',
                'cities' => [
                    ['name_en' => 'Darayya', 'name_ar' => 'داريا', 'code' => 'DAR'],
                    ['name_en' => 'Douma', 'name_ar' => 'دوما', 'code' => 'DOU'],
                    ['name_en' => 'Harasta', 'name_ar' => 'حرستا', 'code' => 'HAR'],
                    ['name_en' => 'Zabadani', 'name_ar' => 'الزبداني', 'code' => 'ZAB'],
                    ['name_en' => 'Jaramana', 'name_ar' => 'جرمانا', 'code' => 'JAR'],
                ]
            ],
            [
                'name_en' => 'Aleppo',
                'name_ar' => 'حلب',
                'code' => 'ALE',
                'cities' => [
                    ['name_en' => 'Aleppo', 'name_ar' => 'حلب', 'code' => 'ALE-C'],
                    ['name_en' => 'Azaz', 'name_ar' => 'أعزاز', 'code' => 'AZA'],
                    ['name_en' => 'Afrin', 'name_ar' => 'عفرين', 'code' => 'AFR'],
                ]
            ],
            [
                'name_en' => 'Homs',
                'name_ar' => 'حمص',
                'code' => 'HOM',
                'cities' => [
                    ['name_en' => 'Homs', 'name_ar' => 'حمص', 'code' => 'HOM-C'],
                    ['name_en' => 'Al-Rastan', 'name_ar' => 'الرستن', 'code' => 'RAS'],
                    ['name_en' => 'Palmyra', 'name_ar' => 'تدمر', 'code' => 'PAL'],
                ]
            ],
            [
                'name_en' => 'Hama',
                'name_ar' => 'حماة',
                'code' => 'HAM',
                'cities' => [
                    ['name_en' => 'Hama', 'name_ar' => 'حماة', 'code' => 'HAM-C'],
                    ['name_en' => 'Salamiyah', 'name_ar' => 'سلمية', 'code' => 'SAL'],
                ]
            ],
            [
                'name_en' => 'Latakia',
                'name_ar' => 'اللاذقية',
                'code' => 'LAT',
                'cities' => [
                    ['name_en' => 'Latakia', 'name_ar' => 'اللاذقية', 'code' => 'LAT-C'],
                    ['name_en' => 'Jableh', 'name_ar' => 'جبلة', 'code' => 'JAB'],
                ]
            ],
            [
                'name_en' => 'Tartus',
                'name_ar' => 'طرطوس',
                'code' => 'TAR',
                'cities' => [
                    ['name_en' => 'Tartus', 'name_ar' => 'طرطوس', 'code' => 'TAR-C'],
                    ['name_en' => 'Baniyas', 'name_ar' => 'بانياس', 'code' => 'BAN'],
                ]
            ],
            // Add other governorates (Idlib, Raqqa, Deir ez-Zor, Hasakah, Daraa, Quneitra, As-Suwayda)
            [
                'name_en' => 'Daraa',
                'name_ar' => 'درعا',
                'code' => 'DRA',
                'cities' => [
                    ['name_en' => 'Daraa', 'name_ar' => 'درعا', 'code' => 'DRA-C'],
                    ['name_en' => 'Nawa', 'name_ar' => 'نوى', 'code' => 'NAW'],
                ]
            ],
        ];

        foreach ($locations as $govData) {
            $governorate = Governorate::firstOrCreate(
                ['name_en' => $govData['name_en']],
                [
                    'name_ar' => $govData['name_ar'],
                    'code' => $govData['code']
                ]
            );

            foreach ($govData['cities'] as $cityData) {
                City::firstOrCreate(
                    ['name_en' => $cityData['name_en'], 'governorate_id' => $governorate->id],
                    [
                        'name_ar' => $cityData['name_ar'],
                        'code' => $cityData['code'],
                        'is_active' => true
                    ]
                );
            }
        }
    }
}
