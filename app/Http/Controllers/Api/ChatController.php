<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
        return response()->json(
            ChatMessage::with('user:id,name')
                ->where('channel', $channelSlug)
                ->latest()
                ->take(50)
                ->get()
                ->sortBy('created_at')
                ->values()
        );
    }

    public function store(Request $request, $channelSlug)
    {
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
            'channel' => $channelSlug,
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

        Notification::send($usersToNotify, new ChatMessageReceived($message->load('user:id,name'), $channel));

        return response()->json($message->load('user:id,name'), 201);
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
        // Remove try-catch to allow proper validation/server error handling
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
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
    }
}
