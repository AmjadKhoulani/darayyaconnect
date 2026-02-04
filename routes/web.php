<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InfrastructureManagerController;
use App\Http\Controllers\Admin\AiStudyController;
use App\Models\AiStudy;



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [\App\Http\Controllers\WelcomeController::class, 'index'])->name('welcome');

    Route::get('/privacy-policy', function () {
        return Inertia::render('PrivacyPolicy');
    })->name('privacy-policy');
    
    Route::get('/dashboard', [\App\Http\Controllers\UserDashboardController::class, 'index'])->name('dashboard');

    // Service Logs (Citizens)
    Route::post('/service-logs', [\App\Http\Controllers\ServiceLogController::class, 'store'])->name('service-logs.store');

    // Community / Discussions
    Route::middleware('module:discussions')->group(function () {
        Route::get('/community', function () {
            return Inertia::render('Community/Index');
        })->name('community.index');
        Route::get('/community/{id}', [\App\Http\Controllers\CommunityController::class, 'show'])->name('community.show');
        Route::post('/community', [\App\Http\Controllers\CommunityController::class, 'store'])->name('community.store');
    });

    // Infrastructure Control (Read Access for Map)
    Route::get('/infrastructure', [InfrastructureManagerController::class, 'index'])->middleware('module:infrastructure')->name('infrastructure.index');

    // AI Studies (Knowledge Base)
    Route::middleware('module:knowledge')->group(function () {
        Route::get('/ai-studies', [AiStudyController::class, 'publicIndex'])->name('ai-studies');
        Route::get('/ai-studies/{id}', [AiStudyController::class, 'publicShow'])->name('ai-studies.show');
    });

    // Initiatives
    Route::get('/initiatives', [\App\Http\Controllers\Admin\InitiativeController::class, 'publicIndex'])->middleware('module:initiatives')->name('initiatives.public');

    // Missing Pages Routes (Under Construction)
    // Lost & Found
    Route::get('/lost-found', function () {
        return Inertia::render('UnderConstruction', [
            'title' => 'مركز المفقودات والموجودات',
            'icon' => '🔍',
            'description' => 'نعمل حالياً على تطوير مركز المفقودات لتسهيل الإبلاغ والبحث عن المفقودات في المدينة.'
        ]);
    })->middleware('module:lost_found')->name('lost-found.index');

    // Library (Books)
    Route::get('/books', function () {
        return Inertia::render('UnderConstruction', [
            'title' => 'مكتبة المجتمع',
            'icon' => '📚',
            'description' => 'مكتبة مجتمعية رقمية تتيح تبادل الكتب والمعرفة بين الأهالي. قريباً ستكون متاحة!'
        ]);
    })->middleware('module:library')->name('books.index');

    // Directory
    Route::get('/directory', function () {
        return Inertia::render('UnderConstruction', [
            'title' => 'دليل الخدمات الشامل',
            'icon' => '📒',
            'description' => 'دليل شامل لكافة الخدمات والمحلات والمهن في داريا. نعمل على جمع وتوثيق البيانات حالياً.'
        ]);
    })->middleware('module:directory')->name('directory.index');


    // Admin Panel
    Route::prefix('admin')
        ->middleware(['auth', 'verified', 'role:admin,official'])
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

        Route::get('/users/map', [\App\Http\Controllers\Admin\UserController::class, 'map'])->name('users.map');
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->except(['create', 'show']);

        // Government Entities / Departments
        Route::get('/departments', [App\Http\Controllers\Admin\DepartmentController::class, 'index'])->name('departments.index');
        Route::post('/departments', [App\Http\Controllers\Admin\DepartmentController::class, 'store'])->name('departments.store');
        Route::post('/departments/rule', [App\Http\Controllers\Admin\DepartmentController::class, 'updateRule'])->name('departments.update-rule');

        // Admin infrastructure updates
        Route::patch('/infrastructure/{id}/status', [InfrastructureManagerController::class, 'updateStatus'])->name('infrastructure.update-status');

        // Infrastructure Editors (Per Sector)
        Route::get('/infrastructure/water/editor', [InfrastructureManagerController::class, 'editor'])->defaults('sector', 'water')->name('infrastructure.water.editor');
        Route::get('/infrastructure/electricity/editor', [InfrastructureManagerController::class, 'editor'])->defaults('sector', 'electricity')->name('infrastructure.electricity.editor');
        Route::get('/infrastructure/sewage/editor', [InfrastructureManagerController::class, 'editor'])->defaults('sector', 'sewage')->name('infrastructure.sewage.editor');
        Route::get('/infrastructure/phone/editor', [InfrastructureManagerController::class, 'editor'])->defaults('sector', 'phone')->name('infrastructure.phone.editor');
        
        // General route for dynamic access if needed
        Route::get('/infrastructure/{sector}/editor', [InfrastructureManagerController::class, 'editor'])->name('infrastructure.sector.editor');
        Route::get('/infrastructure/inventory', [InfrastructureManagerController::class, 'inventory'])->name('infrastructure.inventory');
        Route::get('/infrastructure/assets/{type}/{id}', [InfrastructureManagerController::class, 'show'])->name('infrastructure.show');


        // Restore old route as redirect to prevent 404
        Route::get('/infrastructure/editor', function() {
            return to_route('admin.infrastructure.water.editor');
        })->name('infrastructure.editor');

        // New Resources
        Route::resource('generators', \App\Http\Controllers\Admin\GeneratorController::class);
        Route::resource('initiatives', \App\Http\Controllers\Admin\InitiativeController::class);
        Route::post('/initiatives/{initiative}/approve', [\App\Http\Controllers\Admin\InitiativeController::class, 'approve'])->name('initiatives.approve');
        Route::post('/initiatives/{initiative}/reject', [\App\Http\Controllers\Admin\InitiativeController::class, 'reject'])->name('initiatives.reject');
        Route::resource('lost-found', \App\Http\Controllers\Admin\LostFoundController::class);
        Route::resource('books', \App\Http\Controllers\Admin\BookController::class);
        Route::resource('discussions', \App\Http\Controllers\Admin\DiscussionController::class);

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
        
        // Reports List
        Route::resource('reports', \App\Http\Controllers\Admin\ReportController::class)->only(['index', 'show', 'update']);

        // System Settings
        Route::get('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');

        // Carousel Management
        Route::resource('carousel', \App\Http\Controllers\Admin\CarouselController::class)->except(['create', 'show', 'edit']);

        // Moderation & Chat Filter
        Route::get('/moderation', [\App\Http\Controllers\Admin\ModerationController::class, 'index'])->name('moderation.index');
        Route::post('/moderation/approve/{type}/{id}', [\App\Http\Controllers\Admin\ModerationController::class, 'approve'])->name('moderation.approve');
        Route::post('/moderation/reject/{type}/{id}', [\App\Http\Controllers\Admin\ModerationController::class, 'reject'])->name('moderation.reject');
        Route::post('/moderation/forbidden-words', [\App\Http\Controllers\Admin\ModerationController::class, 'storeForbiddenWord'])->name('moderation.forbidden-words.store');
        Route::delete('/moderation/forbidden-words/{id}', [\App\Http\Controllers\Admin\ModerationController::class, 'deleteForbiddenWord'])->name('moderation.forbidden-words.destroy');

        Route::put('/volunteering/applications/{id}', [\App\Http\Controllers\Admin\VolunteeringController::class, 'updateApplicationStatus'])->name('volunteering.application.update');

        // Infrastructure API (Accessible via Session Auth)
        Route::prefix('api/infrastructure')->group(function () {
            Route::get('/', [App\Http\Controllers\Api\InfrastructureController::class, 'index']); // GET ALL as admin
            Route::post('/lines', [App\Http\Controllers\Api\InfrastructureController::class, 'storeLine']);
            Route::post('/nodes', [App\Http\Controllers\Api\InfrastructureController::class, 'storeNode']);
            Route::put('/lines/{id}', [App\Http\Controllers\Api\InfrastructureController::class, 'updateLine']);
            Route::put('/nodes/{id}', [App\Http\Controllers\Api\InfrastructureController::class, 'updateNode']);
            Route::post('/lines/{id}/publish', [App\Http\Controllers\Api\InfrastructureController::class, 'publishLine']);
            Route::post('/nodes/{id}/publish', [App\Http\Controllers\Api\InfrastructureController::class, 'publishNode']);
            Route::post('/publish-all', [App\Http\Controllers\Api\InfrastructureController::class, 'publishAll']);
            Route::get('/asset-reports', [App\Http\Controllers\Api\InfrastructureController::class, 'getAssetReports']);
            Route::delete('/lines/{id}', [App\Http\Controllers\Api\InfrastructureController::class, 'destroyLine']);
            Route::get('/inventory', [App\Http\Controllers\Admin\InfrastructureInventoryController::class, 'index'])->name('admin.infrastructure.inventory');
            Route::delete('/nodes/{id}', [App\Http\Controllers\Api\InfrastructureController::class, 'destroyNode']);
        });
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
    // Volunteer Routes - Public
    Route::get('/volunteer', [\App\Http\Controllers\VolunteerController::class, 'index'])->middleware('module:volunteering')->name('volunteer.index');
    Route::post('/volunteer/apply', [\App\Http\Controllers\VolunteerController::class, 'store'])->middleware('module:volunteering')->name('volunteer.apply');

    // Pharmacy Routes
    Route::post('/pharmacy/duty/toggle', [\App\Http\Controllers\PharmacyController::class, 'toggleDuty'])->name('pharmacy.duty.toggle');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Debug Chat Route
    Route::get('/chat-debug', function () {
        return Inertia::render('ChatDebug');
    })->name('chat.debug');

    // Web-Session Authenticated Chat Routes (Bypass Sanctum for Debugging)
    Route::prefix('debug-api')->group(function() {
        Route::get('/chat-channels', [App\Http\Controllers\Api\ChatController::class, 'channels']);
        Route::post('/chat-channels', [App\Http\Controllers\Api\ChatController::class, 'storeChannel']);
        Route::get('/chat/{channel}', [App\Http\Controllers\Api\ChatController::class, 'index']);
        Route::post('/chat/{channel}', [App\Http\Controllers\Api\ChatController::class, 'store']);
    });
});

require __DIR__.'/auth.php';
