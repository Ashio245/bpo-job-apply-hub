import React from "react";
import prisma from "@/lib/prisma";
import { inMemoryDb } from "@/lib/db-fallback";
import { calculateMatchScore } from "@/lib/match-scoring";
import QueueClient from "./QueueClient";

export default async function ApplyQueuePage() {
  let queueItems: any[] = [];
  let dbActive = true;
  let profile: any = null;

  try {
    profile = await prisma.candidateProfile.findFirst({
      where: { user: { email: "juan@example.com" } }
    });

    queueItems = await prisma.applicationQueueItem.findMany({
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
    
    // map in memory items
    const mockItems = inMemoryDb.queueItems.filter(item => item.userId === "user-1");
    queueItems = mockItems.map(item => {
      const job = inMemoryDb.listings.find(l => l.id === item.jobListingId);
      const source = inMemoryDb.sources.find(s => s.id === job?.sourceId);
      return {
        ...item,
        job: {
          ...job,
          source
        }
      };
    });
  }

  // Calculate scores for queue jobs
  const structuredItems = queueItems.map(item => {
    const match = calculateMatchScore(profile as any, item.job);
    return {
      ...item,
      job: {
        ...item.job,
        matchScore: match.score,
        matchGrade: match.grade,
        matchReasons: match.reasons,
        matchBlockers: match.blockers
      }
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Apply Queue & Batch Review</h1>
        <p className="text-xs text-[var(--muted)]">
          Review your selected jobs, resolve missing profile fields, and confirm submissions.
        </p>
      </div>

      <QueueClient initialItems={structuredItems} profile={profile} dbActive={dbActive} />
    </div>
  );
}
