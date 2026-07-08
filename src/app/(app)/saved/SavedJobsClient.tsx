"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, MapPin, Landmark, Trash2, Layers, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface SavedJobsClientProps {
  initialSaved: any[];
  dbActive: boolean;
}

export default function SavedJobsClient({ initialSaved, dbActive }: SavedJobsClientProps) {
  const { toast } = useToast();
  const [saved, setSaved] = useState(initialSaved);

  const handleDelete = (id: string, title: string) => {
    setSaved(prev => prev.filter(item => item.id !== id));
    toast("Bookmark Removed", {
      type: "info",
      message: `Unsaved ${title}`
    });
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

  return (
    <div className="space-y-4">
      {saved.length === 0 ? (
        <div className="text-center py-16 bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-6 space-y-3">
          <Bookmark className="h-10 w-10 text-[var(--muted)] mx-auto" />
          <h3 className="text-sm font-bold">No saved jobs yet</h3>
          <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
            Bookmarked BPO jobs will appear here so you can review them or add them to your apply queue.
          </p>
          <Link href="/jobs">
            <Button size="sm">Find BPO Jobs</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {saved.map((item) => (
            <Card key={item.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[8px] uppercase">
                    {item.job.source?.name || "JobStreet"}
                  </Badge>
                  {getApplyBadge(item.job.applyMethod)}
                </div>

                <div>
                  <h4 className="text-sm font-bold leading-tight hover:text-[var(--accent)]">
                    <Link href={`/jobs/${item.job.id}`}>{item.job.title}</Link>
                  </h4>
                  <span className="text-[10px] text-[var(--muted)] block font-semibold">{item.job.companyName}</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {item.job.locationText}
                  </span>
                  <span className="flex items-center gap-1">
                    <Landmark className="h-3.5 w-3.5" />
                    {item.job.workSetup} Setup
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start pt-3 md:pt-0 border-t md:border-t-0 border-[var(--card-border)]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-[var(--muted)]">Fit:</span>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/10">
                    {item.job.matchScore}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(item.id, item.job.title)}
                    className="p-2 rounded border border-[var(--card-border)] text-stone-400 hover:text-rose-500 hover:bg-stone-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <Link href={`/jobs/${item.job.id}`}>
                    <Button size="sm" variant="ghost" className="text-xs">
                      <span>Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
