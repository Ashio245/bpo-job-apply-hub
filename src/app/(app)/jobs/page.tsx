import React from "react";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { Briefcase, MapPin, Landmark, Filter, CheckCircle2, Bookmark, Layers, Search, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import { inMemoryDb } from "@/lib/db-fallback";
import { calculateMatchScore } from "@/lib/match-scoring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BPO_CATEGORIES, WORK_SETUPS, SENIORITY_LEVELS } from "@/lib/constants";
import JobSearchClient from "@/components/JobSearchClient";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    location?: string;
    workSetup?: string;
    category?: string;
    seniority?: string;
    quickApplyOnly?: string;
    sortBy?: string;
  }>;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const query = params.query || "";
  const location = params.location || "";
  const workSetup = params.workSetup || "";
  const category = params.category || "";
  const seniority = params.seniority || "";
  const quickApplyOnly = params.quickApplyOnly === "true";
  const sortBy = params.sortBy || "NEWEST";

  // Fetch jobs with fallback to in-memory store
  let rawJobs = [];
  let dbActive = true;
  let sourcesList: { id: string; name: string }[] = [];

  try {
    const dbSources = await prisma.jobSource.findMany({ select: { id: true, name: true } });
    sourcesList = dbSources;
    
    rawJobs = await prisma.jobListing.findMany({
      where: {
        status: "ACTIVE",
        ...(location ? { city: { equals: location, mode: "insensitive" } } : {}),
        ...(workSetup ? { workSetup: workSetup as any } : {}),
        ...(category ? { category: category } : {}),
        ...(seniority ? { seniority: seniority as any } : {}),
        ...(quickApplyOnly ? { applyMethod: { in: ["IN_APP", "ASSISTED"] } } : {}),
        ...(query ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { companyName: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ]
        } : {})
      },
      include: {
        source: {
          select: { name: true, key: true }
        }
      },
      orderBy: sortBy === "SALARY" 
        ? { salaryMax: "desc" }
        : { postedAt: "desc" }
    });
  } catch (err) {
    dbActive = false;
    // Fallback to in-memory store filtering
    sourcesList = inMemoryDb.sources.map(s => ({ id: s.id, name: s.name }));
    rawJobs = inMemoryDb.listings.filter(job => {
      if (location && job.city?.toLowerCase() !== location.toLowerCase()) return false;
      if (workSetup && job.workSetup !== workSetup) return false;
      if (category && job.category !== category) return false;
      if (seniority && job.seniority !== seniority) return false;
      if (quickApplyOnly && !["IN_APP", "ASSISTED"].includes(job.applyMethod)) return false;
      if (query) {
        const q = query.toLowerCase();
        const inTitle = job.title.toLowerCase().includes(q);
        const inCompany = job.companyName.toLowerCase().includes(q);
        const inDesc = job.description.toLowerCase().includes(q);
        if (!inTitle && !inCompany && !inDesc) return false;
      }
      return true;
    }).map(job => ({
      ...job,
      source: { name: job.sourceName, key: job.sourceKey }
    }));

    // Sort in-memory fallback
    if (sortBy === "SALARY") {
      rawJobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    } else {
      rawJobs.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
    }
  }

  // Fetch applicant profile for match scoring fallback
  let profile = null;
  if (dbActive) {
    try {
      profile = await prisma.candidateProfile.findFirst({
        where: { user: { email: "juan@example.com" } }
      });
    } catch (e) {}
  }
  if (!profile) {
    profile = inMemoryDb.profiles.get("user-1") || null;
  }

  // Map listings and calculate match scores
  const jobs = rawJobs.map((job: any) => {
    const match = calculateMatchScore(profile as any, job);
    return {
      ...job,
      matchScore: match.score,
      matchGrade: match.grade,
      matchReasons: match.reasons
    };
  });

  // Re-sort by match score if specified
  if (sortBy === "BEST_MATCH") {
    jobs.sort((a, b) => b.matchScore - a.matchScore);
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Active BPO Vacancies</h1>
          <p className="text-xs text-[var(--muted)]">
            Showing {jobs.length} jobs. Aggregated from {sourcesList.length} sources. Updated just now.
          </p>
        </div>
        
        {/* Status badges */}
        <div className="flex items-center gap-2">
          {!dbActive && (
            <Badge variant="warning" className="text-[10px]">
              Offline Fallback Active
            </Badge>
          )}
          <Badge variant="success" className="text-[10px] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            Live Ingestion Active
          </Badge>
        </div>
      </div>

      {/* Main filterable view handled by Client Search layout wrapper */}
      <JobSearchClient 
        initialJobs={jobs}
        categories={BPO_CATEGORIES}
        workSetups={WORK_SETUPS}
        seniorityLevels={SENIORITY_LEVELS}
        currentLocation={location}
        currentWorkSetup={workSetup}
        currentCategory={category}
        currentSeniority={seniority}
        currentSortBy={sortBy}
        currentQuickApply={quickApplyOnly}
      />
    </div>
  );
}
