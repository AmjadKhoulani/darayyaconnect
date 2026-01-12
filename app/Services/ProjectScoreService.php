<?php

namespace App\Services;

use App\Models\Project;
use Carbon\Carbon;

class ProjectScoreService
{
    public function recalculateAll()
    {
        $projects = Project::with('infrastructurePoint.reports')->get();

        foreach ($projects as $project) {
            $this->calculateScore($project);
        }
    }

    public function calculateScore(Project $project)
    {
        $score = 0;

        // Factor 1: Public Pressure (Votes)
        // Weight: Low (0.5 per vote)
        $score += $project->votes_count * 0.5;

        // Factor 2: Report Volume (If linked to infrastructure)
        // Weight: High (10 per report)
        if ($project->infrastructurePoint) {
            $reportCount = $project->infrastructurePoint->reports()->count();
            $score += $reportCount * 10;
            
            // Factor 3: Urgency (Based on point status)
            if ($project->infrastructurePoint->status === 'stopped') {
                $score += 50; // Critical boost
            } elseif ($project->infrastructurePoint->status === 'maintenance') {
                $score += 20;
            }
        }

        // Factor 4: Time Ignored (Days since creation)
        // Weight: Medium (1 per day)
        $daysPending = $project->created_at->diffInDays(now());
        $score += $daysPending * 1;

        $project->update(['score' => $score]);
    }
}
