<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ChatChannel;
use App\Models\UserChannelSetting;
use App\Notifications\ChatMessageReceived;
use Illuminate\Support\Facades\Notification;

class ChatController extends Controller
{
    public function channels()
    {
        $user = auth()->user();
        $channels = ChatChannel::all();
        $mutedChannels = UserChannelSetting::where('user_id', $user->id)
            ->where('is_muted', true)
            ->pluck('channel_id')
            ->toArray();

        return response()->json([
            'channels' => $channels->map(function ($channel) use ($mutedChannels) {
                $channel->is_muted = in_array($channel->id, $mutedChannels);
                return $channel;
            })
        ]);
    }

    public function index($channelSlug)
    {
        try {
            return response()->json(
                ChatMessage::with('user:id,name')
                    ->where('channel', $channelSlug)
                    ->latest()
                    ->take(50)
                    ->get()
                    ->sortBy('created_at')
                    ->values()
            );
        } catch (\Exception $e) {
             return response()->json(['message' => 'Fetch Error: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request, $channelSlug)
    {
        try {
            $request->validate([
                'body' => 'required|string|max:1000',
                'reply_to_id' => 'nullable|exists:chat_messages,id'
            ]);

            $channel = ChatChannel::where('slug', $channelSlug)->firstOrFail();

            $body = $request->body;
            $forbiddenWords = \App\Models\ForbiddenWord::pluck('word')->toArray();

            foreach ($forbiddenWords as $word) {
                if (empty($word)) continue;
                $body = preg_replace('/' . preg_quote($word, '/') . '/iu', str_repeat('*', mb_strlen($word)), $body);
            }

            $message = ChatMessage::create([
                'user_id' => $request->user()->id,
                'channel' => $channelSlug, // Using slug as the channel identifier in messages table
                'body' => $body,
                'reply_to_id' => $request->reply_to_id,
                'type' => 'text'
            ]);

            // Send Notifications to users who haven't muted this channel
            $mutedUserIds = UserChannelSetting::where('channel_id', $channel->id)
                ->where('is_muted', true)
                ->pluck('user_id')
                ->toArray();

            $usersToNotify = \App\Models\User::where('id', '!=', $request->user()->id)
                ->whereNotIn('id', $mutedUserIds)
                ->get();

            // TEMPORARY DISABLE: Notification system is causing crashes
            // Notification::send($usersToNotify, new ChatMessageReceived($message->load('user:id,name'), $channel));

            return response()->json($message->load('user:id,name'), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error: ' . $e->getMessage(), 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Message Server Error: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function toggleMute(Request $request, $channelId)
    {
        $setting = UserChannelSetting::firstOrNew([
            'user_id' => $request->user()->id,
            'channel_id' => $channelId
        ]);

        $setting->is_muted = !$setting->is_muted;
        $setting->save();

        return response()->json(['is_muted' => $setting->is_muted]);
    }

    public function storeChannel(Request $request)
    {
        try {
            if (!$request->user()->isAdmin()) {
                return response()->json(['message' => 'Unauthorized: Role is ' . $request->user()->role], 403);
            }

            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'icon' => 'nullable|string'
            ]);

            // Generate Slug
            $slug = \Illuminate\Support\Str::slug($request->name);
            
            // Fallback for Arabic/Empty slugs
            if (empty($slug)) {
                $slug = 'channel-' . uniqid();
            }

            // Ensure Uniqueness
            $originalSlug = $slug;
            $count = 1;
            while (\App\Models\ChatChannel::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }

            $channel = ChatChannel::create([
                'name' => $request->name,
                'slug' => $slug,
                'description' => $request->description,
                'icon' => $request->icon ?? 'Hash'
            ]);

            return response()->json($channel, 201);
        } catch (\Exception $e) {
             return response()->json([
                'message' => 'Channel Server Error: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}
