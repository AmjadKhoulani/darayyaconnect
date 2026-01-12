<?php

namespace Tests\Feature;

use App\Models\Discussion;
use App\Models\DiscussionReply;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommunityEngagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_discussions()
    {
        $user = User::factory()->create();
        Discussion::create([
            'user_id' => $user->id,
            'title' => 'Test Discussion',
            'body' => 'This is a test discussion body.',
            'category' => 'general'
        ]);

        $response = $this->get('/api/portal/discussions');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['title' => 'Test Discussion']);
    }

    public function test_can_view_single_discussion()
    {
        $user = User::factory()->create();
        $discussion = Discussion::create([
            'user_id' => $user->id,
            'title' => 'Single Discussion',
            'body' => 'Details here.',
            'category' => 'general'
        ]);

        $response = $this->get("/api/portal/discussions/{$discussion->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Single Discussion']);
    }

    public function test_can_create_discussion()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/portal/discussions', [
            'title' => 'New Topic',
            'body' => 'Content of the new topic.',
            'category' => 'suggestions'
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['title' => 'New Topic']);

        $this->assertDatabaseHas('discussions', [
            'title' => 'New Topic',
            'user_id' => $user->id
        ]);
    }

    public function test_can_reply_to_discussion()
    {
        $user = User::factory()->create();
        $discussion = Discussion::create([
            'user_id' => $user->id,
            'title' => 'Discussion to Reply',
            'body' => 'Body',
            'category' => 'general'
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/portal/discussions/{$discussion->id}/reply", [
            'body' => 'This is a reply.'
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['body' => 'This is a reply.']);

        $this->assertDatabaseHas('discussion_replies', [
            'discussion_id' => $discussion->id,
            'body' => 'This is a reply.'
        ]);
    }

    public function test_can_vote_on_discussion()
    {
        $user = User::factory()->create();
        $discussion = Discussion::create([
            'user_id' => $user->id,
            'title' => 'Vote Me',
            'body' => 'Body',
            'category' => 'general'
        ]);

        // First vote (Upvote)
        $response = $this->actingAs($user, 'sanctum')->postJson("/api/portal/discussions/{$discussion->id}/vote");

        $response->assertStatus(200)
            ->assertJsonFragment(['status' => 'voted']);

        $this->assertEquals(1, $discussion->refresh()->votes_count);
        $this->assertTrue($discussion->current_user_vote);

        // Second vote (Unvote)
        $response = $this->actingAs($user, 'sanctum')->postJson("/api/portal/discussions/{$discussion->id}/vote");

        $response->assertStatus(200)
            ->assertJsonFragment(['status' => 'unvoted']);

        $this->assertEquals(0, $discussion->refresh()->votes_count);
        $this->assertFalse($discussion->current_user_vote);
    }
}
