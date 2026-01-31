<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general'); // general, modules, map
            $table->timestamps();
        });

        // Seed Default Settings
        $defaults = [
            // General
            ['key' => 'site_name', 'value' => 'داريا الرقمية', 'group' => 'general'],
            ['key' => 'city_name', 'value' => 'داريا', 'group' => 'general'],
            ['key' => 'governorate_name', 'value' => 'ريف دمشق', 'group' => 'general'],
            
            // Map
            ['key' => 'map_center_lat', 'value' => '33.4593', 'group' => 'map'],
            ['key' => 'map_center_lng', 'value' => '36.2366', 'group' => 'map'],
            ['key' => 'map_zoom', 'value' => '14', 'group' => 'map'],

            // Modules (Features Toggle)
            ['key' => 'module_discussions', 'value' => '1', 'group' => 'modules'], // Community Forum
            ['key' => 'module_sos', 'value' => '1', 'group' => 'modules'], // SOS Alerts
            ['key' => 'module_initiatives', 'value' => '1', 'group' => 'modules'], // Community Initiatives
            ['key' => 'module_volunteering', 'value' => '1', 'group' => 'modules'], // Volunteering
            ['key' => 'module_library', 'value' => '1', 'group' => 'modules'], // Books
            ['key' => 'module_lost_found', 'value' => '1', 'group' => 'modules'], // Lost & Found
            ['key' => 'module_chat', 'value' => '1', 'group' => 'modules'], // Public Chat
            ['key' => 'module_directory', 'value' => '1', 'group' => 'modules'], // Directory
            ['key' => 'module_knowledge', 'value' => '1', 'group' => 'modules'], // AI Studies / Knowledge Center
            ['key' => 'module_infrastructure', 'value' => '1', 'group' => 'modules'], // City Explorer
        ];

        foreach ($defaults as $setting) {
             \Illuminate\Support\Facades\DB::table('settings')->insert(array_merge($setting, [
                 'created_at' => now(), 
                 'updated_at' => now()
             ]));
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
