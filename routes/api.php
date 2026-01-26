<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\PortalController;

// Auth Routes - Limited to 5 attempts per minute
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
    Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/sos/trigger', [\App\Http\Controllers\Api\SosController::class, 'trigger']);
    Route::get('/sos/status/{alert}', [\App\Http\Controllers\Api\SosController::class, 'status']);
    Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
});

use App\Http\Controllers\Api\EngagementController;
use App\Http\Controllers\Api\InfrastructureController;
use App\Http\Controllers\Api\AiRecommendationController;
use App\Http\Controllers\Admin\DashboardController;

// Public Routes - Limited to 60 requests per minute
Route::middleware('throttle:60,1')->group(function () {
    // Public Alerts & Polls
    Route::get('/alerts/active', [DashboardController::class, 'activeAlerts']);
    Route::get('/polls/active', [DashboardController::class, 'activePoll']);
    Route::prefix('analytics')->group(function () {
        Route::get('/heatmap', [\App\Http\Controllers\AnalyticsController::class, 'heatmap']);
        Route::get('/reports/heatmap', [\App\Http\Controllers\AnalyticsController::class, 'heatmap']); // Added specific route
        Route::get('/pulse', [\App\Http\Controllers\AnalyticsController::class, 'pulse']);
    });
    // Locations
    Route::get('/locations', [LocationController::class, 'index']);
    Route::post('/locations', [LocationController::class, 'store']);
});

// Infrastructure & Reporting (Urban Platform)
Route::get('/infrastructure/vector-layers', [\App\Http\Controllers\Api\VectorLayerController::class, 'index']); // RESTORED
Route::get('/infrastructure/layers', [InfrastructureController::class, 'getLayerPoints']);
Route::get('/infrastructure/public-reports', [InfrastructureController::class, 'publicReports']);
Route::post('/infrastructure/reports', [InfrastructureController::class, 'storeReport']);

// Portal
Route::get('/portal/services', [PortalController::class, 'getServices']);
Route::get('/portal/posts', [PortalController::class, 'getPosts']);
Route::get('/portal/directory', [PortalController::class, 'getDirectory']);

// Engagement
Route::get('/portal/discussions', [EngagementController::class, 'getDiscussions']);
Route::get('/portal/discussions/{id}', [EngagementController::class, 'showDiscussion']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/portal/discussions', [EngagementController::class, 'storeDiscussion']);
    Route::post('/portal/discussions/{id}/reply', [EngagementController::class, 'storeReply']);
    Route::post('/portal/discussions/{id}/vote', [EngagementController::class, 'voteDiscussion']);
    
    // Notifications (Mock for Pilot)
    Route::get('/notifications/unread', function (Request $request) {
        return $request->user()->unreadNotifications;
    });
    
    // AI Recommendations
    Route::get('/ai/recommendations', [AiRecommendationController::class, 'index']);
    Route::post('/ai/feedback', [AiRecommendationController::class, 'feedback']);
    
    // Polls
    Route::post('/polls/{id}/vote', [EngagementController::class, 'votePoll']);
});

Route::get('/portal/projects', [EngagementController::class, 'getProjects']);
Route::post('/portal/projects/{id}/vote', [EngagementController::class, 'voteProject']);

// Mobile App Sync Routes
Route::get('/ai-studies', [\App\Http\Controllers\Api\AiStudyController::class, 'index']);
Route::get('/ai-studies/{id}', [\App\Http\Controllers\Api\AiStudyController::class, 'show']);

Route::middleware('auth:sanctum')->post('/user/location', [\App\Http\Controllers\Api\UserController::class, 'updateLocation']);

// Specialized Infrastructure Route

// Infrastructure API
Route::get('/infrastructure', [App\Http\Controllers\Api\InfrastructureController::class, 'index']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/infrastructure/my-reports', [InfrastructureController::class, 'myReports']);
    });

// Crowdsourced Status Layer (Outside Auth for easy map access or same level as infrastructure)
Route::get('/infrastructure/status-heatmap', [App\Http\Controllers\Api\InfrastructureStatusController::class, 'getHeatmapData']);
Route::get('/infrastructure/status-summary', [App\Http\Controllers\Api\InfrastructureStatusController::class, 'getSummary']);

// Dashboard Stats for Mobile Home
Route::get('/dashboard/stats', [App\Http\Controllers\Api\DashboardController::class, 'getStats']);
Route::get('/dashboard/news', [App\Http\Controllers\Api\DashboardController::class, 'getRecentNews']);
Route::get('/dashboard/discussions', [App\Http\Controllers\Api\DashboardController::class, 'getDiscussionsPreview']);

// Initiatives
Route::get('/portal/projects', [App\Http\Controllers\Api\InitiativeController::class, 'index']);
Route::get('/portal/projects/{id}', [App\Http\Controllers\Api\InitiativeController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/portal/projects', [App\Http\Controllers\Api\InitiativeController::class, 'store']);
    Route::post('/portal/projects/{id}/vote', [App\Http\Controllers\Api\InitiativeController::class, 'vote']);
});

// Lost & Found
Route::get('/lost-found', [App\Http\Controllers\Api\LostFoundController::class, 'index']);
Route::get('/lost-found/stats', [App\Http\Controllers\Api\LostFoundController::class, 'stats']);
Route::get('/lost-found/{id}', [App\Http\Controllers\Api\LostFoundController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    // --- Chat System ---
    Route::get('/chat/{channel}', [App\Http\Controllers\Api\ChatController::class, 'index']);
    Route::post('/chat/{channel}', [App\Http\Controllers\Api\ChatController::class, 'store']);

    Route::post('/lost-found', [App\Http\Controllers\Api\LostFoundController::class, 'store']);
    Route::put('/lost-found/{id}', [App\Http\Controllers\Api\LostFoundController::class, 'update']);
    Route::post('/lost-found/{id}/resolve', [App\Http\Controllers\Api\LostFoundController::class, 'resolve']);
    Route::delete('/lost-found/{id}', [App\Http\Controllers\Api\LostFoundController::class, 'destroy']);
});

// Generators
Route::get('/generators', [App\Http\Controllers\Api\GeneratorController::class, 'index']);
Route::get('/generators/{id}', [App\Http\Controllers\Api\GeneratorController::class, 'show']);
Route::get('/generators/{id}/ratings', [App\Http\Controllers\Api\GeneratorController::class, 'getRatings']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/generators', [App\Http\Controllers\Api\GeneratorController::class, 'store']);
    Route::put('/generators/{id}', [App\Http\Controllers\Api\GeneratorController::class, 'update']);
    Route::put('/generators/{id}/price', [App\Http\Controllers\Api\GeneratorController::class, 'updatePrice']);
    Route::post('/generators/{id}/rate', [App\Http\Controllers\Api\GeneratorController::class, 'rate']);
    Route::post('/generators/{id}/subscribe', [App\Http\Controllers\Api\GeneratorController::class, 'subscribe']);
    Route::delete('/generators/{id}/subscribe', [App\Http\Controllers\Api\GeneratorController::class, 'unsubscribe']);
    Route::post('/generators/{id}/report-issue', [App\Http\Controllers\Api\GeneratorController::class, 'reportIssue']);
    Route::delete('/generators/{id}', [App\Http\Controllers\Api\GeneratorController::class, 'destroy']);
});

// Book Exchange
Route::get('/books', [App\Http\Controllers\Api\BookController::class, 'index']);

// Volunteering
Route::get('/volunteering', [App\Http\Controllers\Api\VolunteeringController::class, 'index']);
Route::get('/volunteering/{id}', [App\Http\Controllers\Api\VolunteeringController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/volunteering/{id}/apply', [App\Http\Controllers\Api\VolunteeringController::class, 'apply']);

    // Notifications
    Route::get('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [App\Http\Controllers\Api\NotificationController::class, 'unreadCount']);
    Route::post('/notifications/read/{id?}', [App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
});

// --- Dynamic Directory & Service Status ---
Route::get('/directory', [App\Http\Controllers\Api\DirectoryController::class, 'index']);
Route::get('/service-states', [App\Http\Controllers\Api\ServiceStateController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    // Directory Management
    Route::post('/directory', [App\Http\Controllers\Api\DirectoryController::class, 'store']);
    Route::put('/directory/{id}', [App\Http\Controllers\Api\DirectoryController::class, 'update']);
    Route::delete('/directory/{id}', [App\Http\Controllers\Api\DirectoryController::class, 'destroy']);

    // Service Status Management
    Route::put('/service-states/{key}', [App\Http\Controllers\Api\ServiceStateController::class, 'update']);
});
Route::get('/books/{id}', [App\Http\Controllers\Api\BookController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/books', [App\Http\Controllers\Api\BookController::class, 'store']);
    Route::put('/books/{id}', [App\Http\Controllers\Api\BookController::class, 'update']);
    Route::delete('/books/{id}', [App\Http\Controllers\Api\BookController::class, 'destroy']);
    Route::post('/books/{id}/request', [App\Http\Controllers\Api\BookController::class, 'requestBorrow']);
    Route::get('/my-books', [App\Http\Controllers\Api\BookController::class, 'myBooks']);
    Route::get('/my-requests', [App\Http\Controllers\Api\BookController::class, 'myRequests']);
    Route::get('/incoming-requests', [App\Http\Controllers\Api\BookController::class, 'incomingRequests']);
    Route::put('/book-requests/{id}/approve', [App\Http\Controllers\Api\BookController::class, 'approveRequest']);
    Route::put('/book-requests/{id}/reject', [App\Http\Controllers\Api\BookController::class, 'rejectRequest']);
    Route::put('/book-requests/{id}/return', [App\Http\Controllers\Api\BookController::class, 'markReturned']);
});
