"use client";

import React, { useState } from "react";
import { Play, RefreshCw, Activity, AlertTriangle, FileText, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface AdminDashboardClientProps {
  stats: any;
  dbActive: boolean;
}

export default function AdminDashboardClient({ stats, dbActive }: AdminDashboardClientProps) {
  const { toast } = useToast();

  const [runs, setRuns] = useState<any[]>(stats.recentRuns);
  const [isRunning, setIsRunning] = useState(false);

  const handleManualIngest = () => {
    setIsRunning(true);
    
    // Simulate manual re-run aggregation logic
    setTimeout(() => {
      setIsRunning(false);
      const newRun = {
        id: `run-${Date.now()}`,
        sourceName: "All Adapters",
        status: "SUCCESS",
        jobsIngested: 8,
        createdAt: new Date()
      };
      setRuns(prev => [newRun, ...prev].slice(0, 5));
      toast("Ingestion Completed", {
        type: "success",
        message: "Manually triggered adapter run fetched 8 new vacancies."
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Analytics overview row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase block">Total Aggregated Vacancies</span>
            <span className="text-xl font-extrabold">{stats.totalJobs} listings</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase block">In-App/Assisted Eligible</span>
            <span className="text-xl font-extrabold">{stats.quickApplyJobs} jobs</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 rounded bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase block">Parser Error logs</span>
            <span className="text-xl font-extrabold">0 errors</span>
          </div>
        </Card>
      </div>

      {/* Manual ingestion triggers */}
      <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider">Manual Ingestion Dispatch</h3>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            Execute a manual trigger on all active job adapter hooks to pull listings and compute canonical dedup hashes.
          </p>
        </div>

        <Button
          onClick={handleManualIngest}
          isLoading={isRunning}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Play className="h-4 w-4 fill-current" />
          <span>Execute Adapter Sync</span>
        </Button>
      </Card>

      {/* Ingestion Logs list */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Recent Aggregations Log</h3>
        
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[var(--card-border)]/30 border-b border-[var(--card-border)] text-[10px] font-bold uppercase text-[var(--muted)]">
                  <th className="p-4">Source Key</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Jobs Ingested</th>
                  <th className="p-4">Execution Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--card-border)] text-[var(--foreground)]">
                {runs.map((run) => (
                  <tr key={run.id} className="hover:bg-[var(--card-border)]/10 btn-transition">
                    <td className="p-4 font-bold">{run.sourceName}</td>
                    <td className="p-4">
                      <Badge variant={run.status === "SUCCESS" ? "success" : "error"}>
                        {run.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-semibold">{run.jobsIngested} items</td>
                    <td className="p-4 text-[var(--muted)]">
                      {new Date(run.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
