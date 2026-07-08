import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, MapPin, Landmark, Calendar, Share2, ArrowLeft, ShieldAlert, Sparkles, Check, AlertTriangle, ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";
import { inMemoryDb } from "@/lib/db-fallback";
import { calculateMatchScore } from "@/lib/match-scoring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import JobDetailClient from "./JobDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;

  let job: any = null;
  let dbActive = true;

  try {
    job = await prisma.jobListing.findUnique({
      where: { id },
      include: { source: true }
    });
  } catch (err) {
    dbActive = false;
    // Fallback to in-memory store
    const mockJob = inMemoryDb.listings.find(l => l.id === id);
    if (mockJob) {
      const source = inMemoryDb.sources.find(s => s.id === mockJob.sourceId);
      job = {
        ...mockJob,
        source
      };
    }
  }

  if (!job) {
    notFound();
  }

  // Fetch candidate profile for match scoring
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

  const match = calculateMatchScore(profile as any, job);

  // Fetch similar jobs (fallback to mock)
  let similarJobs: any[] = [];
  try {
    similarJobs = await prisma.jobListing.findMany({
      where: {
        category: job.category,
        id: { not: job.id },
        status: "ACTIVE"
      },
      take: 3,
      include: { source: true }
    });
  } catch (e) {
    similarJobs = inMemoryDb.listings
      .filter(l => l.category === job.category && l.id !== job.id)
      .slice(0, 3)
      .map(l => ({
        ...l,
        source: { name: l.sourceName }
      }));
  }

  return (
    <div className="space-y-6">
      {/* Back button link */}
      <Link href="/jobs" className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] btn-transition">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to listings</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Job details column (Left) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-6 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wide">
                {job.source?.name || "BPO Aggregator"}
              </Badge>
              <span className="text-[11px] text-[var(--muted)] flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Posted on {new Date(job.postedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">{job.title}</h1>
              <p className="text-sm font-bold text-[var(--foreground)]">{job.companyName}</p>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[var(--muted)] font-medium border-y border-[var(--card-border)] py-3">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[var(--accent)]" />
                {job.locationText}
              </span>
              <span className="flex items-center gap-1">
                <Landmark className="h-4 w-4 text-[var(--accent)]" />
                {job.workSetup} Setup • {job.employmentType.replace("_", " ")}
              </span>
              {job.salaryMax && (
                <span className="font-semibold text-[var(--foreground)] text-sm">
                  ₱{job.salaryMin?.toLocaleString()} - ₱{job.salaryMax?.toLocaleString()} / mo
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider">Role Summary</h3>
              <p className="text-xs text-[var(--foreground)] leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider">Candidate Requirements</h3>
                <ul className="list-disc pl-5 text-xs text-[var(--foreground)] leading-relaxed space-y-2">
                  {job.requirements.map((req: string, idx: number) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-3">
              {job.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Similar Jobs section */}
          {similarJobs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Similar Openings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {similarJobs.map((sj: any) => (
                  <Link href={`/jobs/${sj.id}`} key={sj.id}>
                    <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-4 h-full flex flex-col justify-between hover:border-[var(--accent)] btn-transition">
                      <div>
                        <Badge variant="secondary" className="text-[8px] uppercase mb-2">
                          {sj.source?.name}
                        </Badge>
                        <h4 className="text-xs font-bold line-clamp-2 leading-tight">{sj.title}</h4>
                        <p className="text-[10px] text-[var(--muted)] mt-1">{sj.companyName}</p>
                      </div>
                      <span className="text-[10px] text-[var(--accent)] font-semibold mt-3 block">
                        View Role →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar details/Apply details column (Right) */}
        <div className="space-y-6">
          {/* Match Score explanation card */}
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              Relevance Match
            </h3>

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full border-2 border-[var(--accent)] bg-[var(--accent-light)] flex items-center justify-center text-sm font-extrabold text-[var(--accent)]">
                {match.score}%
              </div>
              <div>
                <span className="text-xs font-bold block">
                  {match.grade} MATCH
                </span>
                <span className="text-[10px] text-[var(--muted)]">
                  Based on your applicant profile
                </span>
              </div>
            </div>

            {/* Reasons */}
            <div className="space-y-2 pt-2 border-t border-[var(--card-border)]">
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Key Fit Indicators:</span>
              <ul className="space-y-1.5">
                {match.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-1.5 text-xs text-[var(--foreground)]">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
                {match.blockers.map((blocker, index) => (
                  <li key={index} className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{blocker}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Client Application controller */}
          <JobDetailClient job={job} termsNotice={job.source?.termsNotice} />
        </div>
      </div>
    </div>
  );
}
