<?php

use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return inertia('Welcome', [
        'auth' => ['user' => Auth::user()],
    ]);
})->name('home');

Route::get('/events', [App\Http\Controllers\User\EventController::class, 'index'])
    ->name('events.index');

require __DIR__.'/auth.php';


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

    Route::patch('/announcements/{announcement}/publish', [AnnouncementController::class, 'publish'])
    ->name('announcements.publish');

    Route::get('/dashboard',
        [App\Http\Controllers\Admin\DashboardController::class, 'index'])
        ->name('dashboard');

    /*
    |-------------------------------------------------
    | Events
    |-------------------------------------------------
    */
    Route::resource('events', App\Http\Controllers\Admin\EventController::class);

    /*
    |-------------------------------------------------
    | Users
    |-------------------------------------------------
    */
    Route::resource('users', App\Http\Controllers\Admin\UserController::class);
    Route::patch('users/{user}/role',
        [App\Http\Controllers\Admin\UserController::class, 'updateRole'])
        ->name('users.role');

    /*
    |-------------------------------------------------
    | Registrations
    |-------------------------------------------------
    */
    Route::get('registrations',
        [App\Http\Controllers\Admin\RegistrationController::class, 'index'])
        ->name('registrations.index');

    Route::patch('registrations/{registration}/approve',
        [App\Http\Controllers\Admin\RegistrationController::class, 'approve'])
        ->name('registrations.approve');

    Route::patch('registrations/{registration}/reject',
        [App\Http\Controllers\Admin\RegistrationController::class, 'reject'])
        ->name('registrations.reject');

    /*
    |-------------------------------------------------
    | Jury Assignment
    |-------------------------------------------------
    */
    Route::get('events/{event}/jury',
        [App\Http\Controllers\Admin\JuryAssignmentController::class, 'index'])
        ->name('jury.index');

    Route::post('events/{event}/assign-jury',
        [App\Http\Controllers\Admin\JuryAssignmentController::class, 'store'])
        ->name('jury.assign');

    Route::delete('jury/{assignment}',
        [App\Http\Controllers\Admin\JuryAssignmentController::class, 'destroy'])
        ->name('jury.destroy');

    Route::patch('jury/{assignment}/toggle',
        [App\Http\Controllers\Admin\JuryAssignmentController::class, 'toggle'])
        ->name('jury.toggle');

    /*
    |-------------------------------------------------
    | Announcements
    |-------------------------------------------------
    */
    Route::resource('announcements', App\Http\Controllers\Admin\AnnouncementController::class);

    /*
    |-------------------------------------------------
    | Submissions
    |-------------------------------------------------
    */
    Route::get('submissions',
        [App\Http\Controllers\Admin\SubmissionController::class, 'index'])
        ->name('submissions.index');

    Route::get('submissions/{submission}',
        [App\Http\Controllers\Admin\SubmissionController::class, 'show'])
        ->name('submissions.show');

    Route::patch('submissions/{submission}/approve',
        [App\Http\Controllers\Admin\SubmissionController::class, 'approve'])
        ->name('submissions.approve');

    Route::patch('submissions/{submission}/reject',
        [App\Http\Controllers\Admin\SubmissionController::class, 'reject'])
        ->name('submissions.reject');

    /*
    |-------------------------------------------------
    | Reports
    |-------------------------------------------------
    */
    Route::get('reports',
        [App\Http\Controllers\Admin\ReportController::class, 'index'])
        ->name('reports.index');

    Route::get('reports/{event}/leaderboard',
        [App\Http\Controllers\Admin\ReportController::class, 'leaderboard'])
        ->name('reports.leaderboard');

    Route::get('reports/{event}/export',
        [App\Http\Controllers\Admin\ReportController::class, 'export'])
        ->name('reports.export');
});


/*
|--------------------------------------------------------------------------
| JURY ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:jury'])
    ->prefix('jury')
    ->name('jury.')
    ->group(function () {

    Route::get('/dashboard',
        [App\Http\Controllers\Jury\DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/events',
        [App\Http\Controllers\Jury\ScoringController::class, 'index'])
        ->name('events.index');

    Route::get('/events/{event}/submissions',
        [App\Http\Controllers\Jury\ScoringController::class, 'show'])
        ->name('submissions.index');

    Route::post('/submissions/{submission}/score',
        [App\Http\Controllers\Jury\ScoringController::class, 'score'])
        ->name('submissions.score');
});


/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:user'])
    ->prefix('user')
    ->name('user.')
    ->group(function () {

    Route::get('/dashboard',
        [App\Http\Controllers\User\DashboardController::class, 'index'])
        ->name('dashboard');

    /*
    | Registrations
    */
    Route::get('/events/{event}/register',
        [App\Http\Controllers\User\RegistrationController::class, 'create'])
        ->name('registrations.create');

    Route::post('/registrations',
        [App\Http\Controllers\User\RegistrationController::class, 'store'])
        ->name('registrations.store');

    Route::get('/registrations',
        [App\Http\Controllers\User\RegistrationController::class, 'index'])
        ->name('registrations.index');

    /*
    | Submissions
    */
    Route::get('/registrations/{registration}/submit',
        [App\Http\Controllers\User\SubmissionController::class, 'create'])
        ->name('submissions.create');

    Route::post('/submissions',
        [App\Http\Controllers\User\SubmissionController::class, 'store'])
        ->name('submissions.store');

    /*
    | Results
    */
    Route::get('/results',
        [App\Http\Controllers\User\ResultController::class, 'index'])
        ->name('results.index');
});


/*
|--------------------------------------------------------------------------
| PROFILE
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});