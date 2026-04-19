<?php

namespace App\Providers;

use App\Models\EventRegistration;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\Submission;
use App\Policies\SubmissionPolicy;
use App\Policies\ScorePolicy;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(EventRegistration::class, SubmissionPolicy::class);
        Gate::policy(Submission::class, ScorePolicy::class);
        Vite::prefetch(concurrency: 3);
    }
    protected $policies = [
    Submission::class => SubmissionPolicy::class,
];
}
