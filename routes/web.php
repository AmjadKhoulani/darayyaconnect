<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InfrastructureManagerController;
use App\Http\Controllers\Admin\AiStudyController;
use App\Models\AiStudy;

Route::get('/', [\App\Http\Controllers\WelcomeController::class, 'index'])->name('welcome');

Route::get('/privacy-policy', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy-policy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\UserDashboardController::class, 'index'])->name('dashboard');

    // Service Logs (Citizens)
    Route::post('/service-logs', [\App\Http\Controllers\ServiceLogController::class, 'store'])->name('service-logs.store');

    // Community
    Route::get('/community', function () {
        return Inertia::render('Community/Index');
    })->name('community.index');
    
    Route::get('/community/{id}', [\App\Http\Controllers\CommunityController::class, 'show'])->name('community.show');
    Route::post('/community', [\App\Http\Controllers\CommunityController::class, 'store'])->name('community.store');

    // Infrastructure Control (Read Access for Map)
    Route::get('/infrastructure', [InfrastructureManagerController::class, 'index'])->name('infrastructure.index');

    // AI Studies (Public fetch from DB)
    Route::get('/ai-studies', [AiStudyController::class, 'publicIndex'])->name('ai-studies');
    Route::get('/initiatives', [\App\Http\Controllers\Admin\InitiativeController::class, 'publicIndex'])->name('initiatives.public');


    // Admin Panel
    Route::prefix('admin')
        ->middleware(['auth', 'verified', 'role:admin'])
        ->name('admin.')
        ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // AI Studies Management
        Route::resource('ai-studies', AiStudyController::class);
        Route::post('/alerts', [DashboardController::class, 'sendAlert'])->name('alerts.send');
        Route::post('/sos/{alert}/resolve', [DashboardController::class, 'resolveSos'])->name('sos.resolve');
        
        // The "Unknown" Registry
        // Route name becomes admin.missing-data
        Route::get('/missing-data', [\App\Http\Controllers\Admin\MissingDataController::class, 'index'])->name('missing-data');
        
        // Water Management
        Route::get('/infrastructure/water', [InfrastructureManagerController::class, 'waterManager'])->name('infrastructure.water');

        // User Management (Map must be before resource)
        Route::get('/users/map', [\App\Http\Controllers\Admin\UserController::class, 'map'])->name('users.map');
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->except(['create', 'store', 'show']);

        // Admin infrastructure updates
        Route::patch('/infrastructure/{id}/status', [InfrastructureManagerController::class, 'updateStatus'])->name('infrastructure.update-status');


        // Infrastructure Editor
        Route::get('/infrastructure/editor', function () {
            return Inertia::render('Admin/Infrastructure/Editor');
        })->name('infrastructure.editor');

        // New Resources
        Route::resource('generators', \App\Http\Controllers\Admin\GeneratorController::class);
        Route::resource('initiatives', \App\Http\Controllers\Admin\InitiativeController::class);
        Route::resource('lost-found', \App\Http\Controllers\Admin\LostFoundController::class);
        Route::resource('books', \App\Http\Controllers\Admin\BookController::class);

        // Infrastructure Controls (For Admins/Institutions)
        Route::post('/infrastructure/{id}/toggle', [InfrastructureManagerController::class, 'toggleStatus'])
            ->middleware('verified');

        // New Directory & Service Status Management
        Route::resource('directory', \App\Http\Controllers\Admin\DirectoryController::class)->except(['create', 'edit', 'show']);
        Route::get('/service-states', [\App\Http\Controllers\Admin\ServiceStateController::class, 'index'])->name('service-states.index');
        Route::put('/service-states/{key}', [\App\Http\Controllers\Admin\ServiceStateController::class, 'update'])->name('service-states.update');

        // Volunteering
        Route::get('/volunteering', [\App\Http\Controllers\Admin\VolunteeringController::class, 'index'])->name('volunteering.index');
        Route::post('/volunteering', [\App\Http\Controllers\Admin\VolunteeringController::class, 'store'])->name('volunteering.store');
        Route::put('/volunteering/{id}', [\App\Http\Controllers\Admin\VolunteeringController::class, 'update'])->name('volunteering.update');
        Route::delete('/volunteering/{id}', [\App\Http\Controllers\Admin\VolunteeringController::class, 'destroy'])->name('volunteering.destroy');
        // Reports Heatmap
        Route::get('/reports/heatmap', function () {
            return Inertia::render('Admin/ReportsHeatmap');
        })->name('reports.heatmap');

        // Moderation & Chat Filter
        Route::get('/moderation', [\App\Http\Controllers\Admin\ModerationController::class, 'index'])->name('moderation.index');
        Route::post('/moderation/approve/{type}/{id}', [\App\Http\Controllers\Admin\ModerationController::class, 'approve'])->name('moderation.approve');
        Route::post('/moderation/reject/{type}/{id}', [\App\Http\Controllers\Admin\ModerationController::class, 'reject'])->name('moderation.reject');
        Route::post('/moderation/forbidden-words', [\App\Http\Controllers\Admin\ModerationController::class, 'storeForbiddenWord'])->name('moderation.forbidden-words.store');
        Route::delete('/moderation/forbidden-words/{id}', [\App\Http\Controllers\Admin\ModerationController::class, 'deleteForbiddenWord'])->name('moderation.forbidden-words.destroy');

        Route::put('/volunteering/applications/{id}', [\App\Http\Controllers\Admin\VolunteeringController::class, 'updateApplicationStatus'])->name('volunteering.application.update');
    });

    // Voting
    // Voting moved to API/EngagementController
});


Route::middleware('auth')->group(function () {
    Route::get('/onboarding/location', [\App\Http\Controllers\OnboardingController::class, 'show'])->name('onboarding.location');
    Route::post('/onboarding/location', [\App\Http\Controllers\OnboardingController::class, 'store']);

    // Official Routes (Protected by official role)
    Route::middleware('role:official')->prefix('official')->name('official.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\OfficialDashboardController::class, 'index'])->name('dashboard');
        Route::post('/reports/{report}/update', [\App\Http\Controllers\OfficialDashboardController::class, 'updateReportStatus'])->name('report.update');
        Route::post('/services/update', [\App\Http\Controllers\OfficialDashboardController::class, 'updateServiceStatus'])->name('service.update');
        Route::post('/polls', [\App\Http\Controllers\OfficialPollController::class, 'store'])->name('polls.store');
    });

    // Poll Routes
    Route::post('/polls/{poll}/vote', [\App\Http\Controllers\PollController::class, 'vote'])->name('polls.vote');

    // Event Routes
    Route::post('/events/{event}/attend', [\App\Http\Controllers\EventController::class, 'attend'])->name('events.attend');

    // Institution Routes
    Route::get('/institution/dashboard', [\App\Http\Controllers\InstitutionController::class, 'dashboard'])->name('institution.dashboard');
    Route::post('/institution/status', [\App\Http\Controllers\InstitutionController::class, 'updateStatus'])->name('institution.status.update');
    Route::post('/institution/posts', [\App\Http\Controllers\InstitutionController::class, 'storePost'])->name('institution.posts.store');

    // Volunteer Routes - Admin
    Route::get('/admin/volunteers', [\App\Http\Controllers\VolunteerController::class, 'adminIndex'])->name('admin.volunteers.index'); // Separated Admin Route
    
    // Volunteer Routes - Public (Keep this if used by web, otherwise mobile uses API)
    Route::get('/volunteer', [\App\Http\Controllers\VolunteerController::class, 'index'])->name('volunteer.index');
    Route::post('/volunteer/apply', [\App\Http\Controllers\VolunteerController::class, 'store'])->name('volunteer.apply');

    // Pharmacy Routes
    Route::post('/pharmacy/duty/toggle', [\App\Http\Controllers\PharmacyController::class, 'toggleDuty'])->name('pharmacy.duty.toggle');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
