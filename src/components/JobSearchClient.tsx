"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, MapPin, Landmark, Filter, CheckCircle2, Bookmark, BookmarkCheck, Layers, ChevronRight, Sparkles, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface JobSearchClientProps {
  initialJobs: any[];
  categories: { value: string; label: string }[];
  workSetups: { value: string; label: string }[];
  seniorityLevels: { value: string; label: string }[];
  currentLocation: string;
  currentWorkSetup: string;
  currentCategory: string;
  currentSeniority: string;
  currentSortBy: string;
  currentQuickApply: boolean;
}

export default function JobSearchClient({
  initialJobs,
  categories,
  workSetups,
  seniorityLevels,
  currentLocation,
  currentWorkSetup,
  currentCategory,
  currentSeniority,
  currentSortBy,
  currentQuickApply,
}: JobSearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [savedJobs, setSavedJobs] = useState<string[]>(["job-js-1"]); // seed default saved job
  const [queueItems, setQueueItems] = useState<string[]>(["job-kb-1", "job-js-2"]); // seed queue items
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleFilterUpdate = (key: string, value: string | boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "" || value === false) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    params.delete("page");
    router.push(`/jobs?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/jobs");
  };

  const handleSaveToggle = (jobId: string, title: string) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(prev => prev.filter(id => id !== jobId));
      toast("Removed from bookmarks", { type: "info", message: `You unsaved ${title}` });
    } else {
      setSavedJobs(prev => [...prev, jobId]);
      toast("Saved to bookmarks", { type: "success", message: `You bookmarked ${title}` });
    }
  };

  const handleQueueToggle = (jobId: string, title: string) => {
    if (queueItems.includes(jobId)) {
      setQueueItems(prev => prev.filter(id => id !== jobId));
      toast("Removed from Apply Queue", { type: "info", message: `You removed ${title} from queue` });
    } else {
      setQueueItems(prev => [...prev, jobId]);
      toast("Added to Apply Queue", { type: "success", message: `You added ${title} to your batch review list` });
    }
  };

  const getApplyBadge = (method: string) => {
    switch (method) {
      case "IN_APP":
        return <Badge variant="success" className="text-[10px]">In-App Apply</Badge>;
      case "ASSISTED":
        return <Badge variant="brand" className="text-[10px]">Assisted Apply</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">External Apply</Badge>;
    }
  };

  const getMatchScoreBadge = (score: number) => {
    if (score >= 80) return "bg-emerald-500 text-white dark:bg-emerald-600";
    if (score >= 60) return "bg-teal-500 text-white dark:bg-teal-600";
    if (score >= 40) return "bg-amber-500 text-white dark:bg-amber-600";
    return "bg-stone-300 text-stone-700 dark:bg-stone-700 dark:text-stone-300";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Desktop Sticky filter rail */}
      <div className="hidden lg:block space-y-5 p-5 bg-[var(--card)] border border-[var(--card-border)] rounded-lg h-fit sticky top-20">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-[var(--accent)]" />
            Filters
          </h3>
          {(currentLocation || currentWorkSetup || currentCategory || currentSeniority || currentQuickApply) && (
            <button onClick={clearFilters} className="text-[10px] text-[var(--accent)] hover:underline font-bold">
              Clear All
            </button>
          )}
        </div>

        {/* Work setup */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[var(--muted)] uppercase">Work Setup</label>
          <select
            value={currentWorkSetup}
            onChange={(e) => handleFilterUpdate("workSetup", e.target.value)}
            className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] outline-none"
          >
            <option value="">All Setups</option>
            {workSetups.map(w => (
              <option key={w.value} value={w.value}>{w.label}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[var(--muted)] uppercase">BPO Category</label>
          <select
            value={currentCategory}
            onChange={(e) => handleFilterUpdate("category", e.target.value)}
            className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Seniority */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[var(--muted)] uppercase">Experience Level</label>
          <select
            value={currentSeniority}
            onChange={(e) => handleFilterUpdate("seniority", e.target.value)}
            className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] outline-none"
          >
            <option value="">All Levels</option>
            {seniorityLevels.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Sorting options */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[var(--muted)] uppercase">Sort By</label>
          <select
            value={currentSortBy}
            onChange={(e) => handleFilterUpdate("sortBy", e.target.value)}
            className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] outline-none"
          >
            <option value="NEWEST">Newest Listings</option>
            <option value="BEST_MATCH">Best Match Score</option>
            <option value="SALARY">Highest Salary</option>
          </select>
        </div>

        {/* Quick Apply Checkbox */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--card-border)]">
          <input
            type="checkbox"
            id="quickApplyOnly"
            checked={currentQuickApply}
            onChange={(e) => handleFilterUpdate("quickApplyOnly", e.target.checked)}
            className="rounded border-[var(--card-border)] text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <label htmlFor="quickApplyOnly" className="text-xs font-semibold select-none cursor-pointer">
            Quick Apply Eligible only
          </label>
        </div>
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden flex justify-between items-center bg-[var(--card)] p-3 border border-[var(--card-border)] rounded-lg">
        <Button size="sm" variant="outline" onClick={() => setShowMobileFilters(true)} className="flex items-center gap-1.5 text-xs">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters & Sort</span>
        </Button>
        {currentLocation && (
          <Badge variant="brand" className="text-[10px]">{currentLocation}</Badge>
        )}
      </div>

      {/* Jobs list grid container */}
      <div className="lg:col-span-3 space-y-4">
        {initialJobs.length === 0 ? (
          <div className="text-center py-16 bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-6 space-y-3">
            <Briefcase className="h-10 w-10 text-[var(--muted)] mx-auto" />
            <h3 className="text-sm font-bold">No BPO listings match these filters</h3>
            <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
              We couldn't find matches for {currentLocation || "your current criteria"}. Try selecting a nearby city like Quezon City or clearing filters.
            </p>
            <Button size="sm" onClick={clearFilters}>Reset Filters</Button>
          </div>
        ) : (
          initialJobs.map((job) => (
            <Card key={job.id} hoverable className="relative overflow-hidden group">
              {/* Score visual overlay stripe */}
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-stone-200 dark:bg-stone-800" />
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pl-1">
                {/* Main job details */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-[9px] uppercase tracking-wide">
                      {job.source?.name || "BPO aggregator"}
                    </Badge>
                    <span className="text-[10px] text-[var(--muted)] font-semibold">
                      Posted {new Date(job.postedAt).toLocaleDateString()}
                    </span>
                    {getApplyBadge(job.applyMethod)}
                  </div>

                  <div>
                    <h2 className="text-sm font-bold leading-tight group-hover:text-[var(--accent)] btn-transition">
                      <Link href={`/jobs/${job.id}`}>
                        {job.title}
                      </Link>
                    </h2>
                    <p className="text-xs font-semibold text-[var(--foreground)] mt-0.5">{job.companyName}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--muted)] font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.locationText}
                    </span>
                    <span className="flex items-center gap-1">
                      <Landmark className="h-3.5 w-3.5" />
                      {job.workSetup} • {job.employmentType.replace("_", " ")}
                    </span>
                    {job.salaryMax && (
                      <span className="font-semibold text-[var(--foreground)]">
                        ₱{(job.salaryMin || 0).toLocaleString()} - ₱{job.salaryMax.toLocaleString()} / mo
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                    {job.descriptionSnippet}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {job.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="inline-block text-[9px] font-bold bg-[var(--background)] px-2 py-0.5 rounded border border-[var(--card-border)] text-[var(--muted)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Match score & Call to Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 border-t md:border-t-0 border-[var(--card-border)] pt-3 md:pt-0 md:pl-4 min-w-[130px]">
                  {/* Match scoring visual bubble */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-[var(--muted)]">Match Score:</span>
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-xs ${getMatchScoreBadge(job.matchScore)}`}>
                      {job.matchScore}%
                    </div>
                  </div>

                  <div className="flex items-center md:flex-col gap-2 w-full md:w-auto">
                    {/* Save Bookmark button */}
                    <button
                      onClick={() => handleSaveToggle(job.id, job.title)}
                      className={`p-2 rounded border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)] cursor-pointer ${
                        savedJobs.includes(job.id) ? "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-300" : "text-[var(--muted)]"
                      }`}
                    >
                      {savedJobs.includes(job.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    </button>

                    {/* Add to Queue button */}
                    {["IN_APP", "ASSISTED"].includes(job.applyMethod) && (
                      <button
                        onClick={() => handleQueueToggle(job.id, job.title)}
                        className={`px-2.5 py-1.5 rounded border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                          queueItems.includes(job.id)
                            ? "bg-[var(--accent)] text-white border-transparent"
                            : "bg-[var(--card)] border-[var(--card-border)] text-[var(--foreground)] hover:border-[var(--accent)]"
                        }`}
                      >
                        <Layers className="h-3.5 w-3.5" />
                        <span>{queueItems.includes(job.id) ? "In Queue" : "Queue Apply"}</span>
                      </button>
                    )}

                    {/* View details */}
                    <Link href={`/jobs/${job.id}`}>
                      <Button size="sm" variant="ghost" className="text-xs group-hover:text-[var(--accent)]">
                        <span>Details</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Mobile Slide-Over sheet for filters */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-80 bg-[var(--card)] p-6 overflow-y-auto space-y-6 h-full shadow-2xl animate-slide-in">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4 text-[var(--accent)]" />
                Filters & Sorting
              </h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-xs font-semibold text-[var(--muted)]">
                Close
              </button>
            </div>

            {/* Sorting options */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[var(--muted)] uppercase">Sort By</label>
              <select
                value={currentSortBy}
                onChange={(e) => handleFilterUpdate("sortBy", e.target.value)}
                className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] outline-none"
              >
                <option value="NEWEST">Newest Listings</option>
                <option value="BEST_MATCH">Best Match Score</option>
                <option value="SALARY">Highest Salary</option>
              </select>
            </div>

            {/* Work setup */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[var(--muted)] uppercase">Work Setup</label>
              <select
                value={currentWorkSetup}
                onChange={(e) => handleFilterUpdate("workSetup", e.target.value)}
                className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] outline-none"
              >
                <option value="">All Setups</option>
                {workSetups.map(w => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[var(--muted)] uppercase">BPO Category</label>
              <select
                value={currentCategory}
                onChange={(e) => handleFilterUpdate("category", e.target.value)}
                className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Seniority */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[var(--muted)] uppercase">Experience Level</label>
              <select
                value={currentSeniority}
                onChange={(e) => handleFilterUpdate("seniority", e.target.value)}
                className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] outline-none"
              >
                <option value="">All Levels</option>
                {seniorityLevels.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Quick Apply Checkbox */}
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--card-border)]">
              <input
                type="checkbox"
                id="quickApplyOnlyMobile"
                checked={currentQuickApply}
                onChange={(e) => handleFilterUpdate("quickApplyOnly", e.target.checked)}
                className="rounded border-[var(--card-border)] text-[var(--accent)]"
              />
              <label htmlFor="quickApplyOnlyMobile" className="text-xs font-semibold">
                Quick Apply Eligible only
              </label>
            </div>

            <Button className="w-full" onClick={() => setShowMobileFilters(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
