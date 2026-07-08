import React from "react";
import prisma from "@/lib/prisma";
import { inMemoryDb } from "@/lib/db-fallback";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Activity, AlertTriangle, Play, RefreshCw, BarChart2 } from "lucide-react";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {
  let stats = {
    totalJobs: 0,
    quickApplyJobs: 0,
    totalSources: 0,
    recentRuns: [] as any[],
  };
  let dbActive = true;

  try {
    const totalJobs = await prisma.jobListing.count();
    const quickApplyJobs = await prisma.jobListing.count({
      where: { applyMethod: { in: ["IN_APP", "ASSISTED"] } }
    });
    const totalSources = await prisma.jobSource.count();
    const recentRuns = await prisma.sourceIngestionRun.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { source: true }
    });

    stats = {
      totalJobs,
      quickApplyJobs,
      totalSources,
      recentRuns: recentRuns.map(r => ({
        id: r.id,
        sourceName: r.source.name,
        status: r.status,
        jobsIngested: r.jobsIngested,
        createdAt: r.createdAt
      }))
    };
  } catch (err) {
    dbActive = false;
    // Fallback to in-memory stats
    stats = {
      totalJobs: inMemoryDb.listings.length,
      quickApplyJobs: inMemoryDb.listings.filter(l => ["IN_APP", "ASSISTED"].includes(l.applyMethod)).length,
      totalSources: inMemoryDb.sources.length,
      recentRuns: inMemoryDb.runs.slice(0, 5)
    };
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-5.5 w-5.5 text-amber-500" />
            Operations Control Panel
          </h1>
          <p className="text-xs text-[var(--muted)]">
            Ingestion adapter logs, parser validation tracking, and compliance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!dbActive && (
            <Badge variant="warning" className="text-[10px]">
              Offline Fallback Active
            </Badge>
          )}
          <Badge variant="success" className="text-[10px]">
            Role: Admin Bypass
          </Badge>
        </div>
      </div>

      <AdminDashboardClient stats={stats} dbActive={dbActive} />
    </div>
  );
}
