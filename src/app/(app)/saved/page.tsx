import React from "react";
import Link from "next/link";
import { Bookmark, MapPin, Landmark, Trash2 } from "lucide-react";
import prisma from "@/lib/prisma";
import { inMemoryDb } from "@/lib/db-fallback";
import { calculateMatchScore } from "@/lib/match-scoring";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import SavedJobsClient from "./SavedJobsClient";

export default async function SavedJobsPage() {
  let savedJobs: any[] = [];
  let dbActive = true;
  let profile: any = null;

  try {
    profile = await prisma.candidateProfile.findFirst({
      where: { user: { email: "juan@example.com" } }
    });

    savedJobs = await prisma.savedJob.findMany({
      where: { user: { email: "juan@example.com" } },
      include: {
        job: {
          include: { source: true }
        }
      }
    });
  } catch (err) {
    dbActive = false;
    profile = inMemoryDb.profiles.get("user-1") || null;
    
    // map in memory saved jobs
    const mockSaved = inMemoryDb.savedJobs.filter(sj => sj.userId === "user-1");
    savedJobs = mockSaved.map(sj => {
      const job = inMemoryDb.listings.find(l => l.id === sj.jobListingId);
      const source = inMemoryDb.sources.find(s => s.id === job?.sourceId);
      return {
        ...sj,
        job: {
          ...job,
          source
        }
      };
    });
  }

  // Calculate scores
  const structuredSaved = savedJobs.map(item => {
    const match = calculateMatchScore(profile as any, item.job);
    return {
      ...item,
      job: {
        ...item.job,
        matchScore: match.score,
        matchGrade: match.grade
      }
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Saved Jobs</h1>
        <p className="text-xs text-[var(--muted)]">
          Manage your bookmarked BPO job opportunities and check their match status.
        </p>
      </div>

      <SavedJobsClient initialSaved={structuredSaved} dbActive={dbActive} />
    </div>
  );
}
