<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index($channel)
    {
        return response()->json(
            ChatMessage::with('user:id,name') // Optimize user loading
                ->where('channel', $channel)
                ->latest()
                ->take(50)
                ->get()
                ->sortBy('created_at') // Return oldest first for chat flow
                ->values()
        );
    }

    public function store(Request $request, $channel)
    {
        $request->validate([
            'body' => 'required|string|max:1000',
            'reply_to_id' => 'nullable|exists:chat_messages,id'
        ]);

        $body = $request->body;
        $forbiddenWords = \App\Models\ForbiddenWord::pluck('word')->toArray();

        foreach ($forbiddenWords as $word) {
            if (empty($word)) continue;
            // Case-insensitive replacement
            $body = preg_replace('/' . preg_quote($word, '/') . '/iu', str_repeat('*', mb_strlen($word)), $body);
        }

        $message = ChatMessage::create([
            'user_id' => $request->user()->id,
            'channel' => $channel,
            'body' => $body,
            'reply_to_id' => $request->reply_to_id,
            'type' => 'text'
        ]);

        return response()->json($message->load('user:id,name'), 201);
    }
}
