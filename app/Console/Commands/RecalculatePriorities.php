<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ProjectScoreService;

class RecalculatePriorities extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'priority:recalculate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalculate dynamic priority scores for all projects based on reports and density';

    public function handle(ProjectScoreService $service)
    {
        $this->info('Recalculating project priorities...');
        $service->recalculateAll();
        $this->info('Priorities updated successfully!');
    }
}
