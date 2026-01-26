<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use App\Models\ChatChannel;
use App\Models\ChatMessage;
use App\Models\User;

class DebugChat extends Command
{
    protected $signature = 'debug:chat';
    protected $description = 'Debug Chat System Tables and Creation';

    public function handle()
    {
        $this->info('--- STARTING CHAT DEBUG ---');

        // 1. Check Tables
        $this->checkTable('chat_channels');
        $this->checkTable('chat_messages');
        $this->checkTable('user_channel_settings');

        // 2. Test Channel Creation
        $this->info("\n--- Testing Channel Creation ---");
        try {
            $slug = 'debug-' . time();
            $channel = ChatChannel::create([
                'name' => 'Debug Channel',
                'slug' => $slug,
                'description' => 'Created by debug command',
                'icon' => 'Bug'
            ]);
            $this->info("SUCCESS: Created Channel [ID: {$channel->id}, Slug: {$channel->slug}]");
        } catch (\Exception $e) {
            $this->error("FAIL: Could not create channel. Error: " . $e->getMessage());
            return;
        }

        // 3. Test Message Creation
        $this->info("\n--- Testing Message Creation ---");
        try {
            $user = User::first();
            if (!$user) {
                $this->error("FAIL: No users found in DB.");
                return;
            }
            $this->comment("Using User ID: {$user->id}");

            $msg = ChatMessage::create([
                'user_id' => $user->id,
                'channel' => $channel->slug,
                'body' => 'Debug Message Body',
                'type' => 'text'
            ]);
            $this->info("SUCCESS: Created Message [ID: {$msg->id}]");
            
            // Verify Count
            $count = ChatMessage::where('id', $msg->id)->count();
            if ($count > 0) {
                 $this->info("VERIFIED: Message found in DB via query.");
            } else {
                 $this->error("CRITICAL: Message ID returned but not found in DB query!");
            }

        } catch (\Exception $e) {
            $this->error("FAIL: Could not create message. Error: " . $e->getMessage());
        }

        $this->info("\n--- DEBUG COMPLETE ---");
    }

    private function checkTable($table)
    {
        if (Schema::hasTable($table)) {
            $this->info("OK: Table '$table' exists.");
        } else {
            $this->error("MISSING: Table '$table' does NOT exist.");
        }
    }
}
