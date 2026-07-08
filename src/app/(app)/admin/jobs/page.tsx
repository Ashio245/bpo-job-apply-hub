"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ShieldAlert, RefreshCw, Layers, Sparkles, Check, Link2 } from "lucide-react";

export default function AdminModerationPage() {
  const { toast } = useToast();

  const [clusters, setClusters] = useState([
    {
      id: "cluster-1",
      title: "Pure Chat Support Representative (No Call)",
      companyName: "Concentrix Philippines",
      similarityScore: 94,
      listings: [
        { id: "job-bd-1", source: "BPO Direct Partners", location: "Pasig City, Metro Manila" },
        { id: "job-ext-1", source: "JobStreet PH", location: "Pasig, NCR" }
      ]
    }
  ]);

  const handleResolve = (id: string) => {
    setClusters(prev => prev.filter(c => c.id !== id));
    toast("Cluster resolved", {
      type: "success",
      message: "Direct Aggregator listing marked as canonical; redundant listing hidden."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Listing Moderation & Deduplication</h1>
        <p className="text-xs text-[var(--muted)]">
          Review automated duplicate clusters and moderate flagged vacancies.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
          Duplicate Detection Clusters ({clusters.length})
        </h3>

        {clusters.length === 0 ? (
          <div className="text-center py-12 bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-5">
            <Check className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-semibold">All duplicate listing clusters resolved!</p>
          </div>
        ) : (
          clusters.map((c) => (
            <Card key={c.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold leading-tight flex items-center gap-2">
                    <Layers className="h-4.5 w-4.5 text-[var(--accent)]" />
                    {c.title}
                  </h4>
                  <span className="text-[10px] text-[var(--muted)] block font-semibold">
                    {c.companyName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-teal-800 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-2 py-0.5 rounded border border-teal-200">
                    Similarity: {c.similarityScore}%
                  </span>
                  <Button size="sm" className="h-7 text-[10px]" onClick={() => handleResolve(c.id)}>
                    Resolve & Merge
                  </Button>
                </div>
              </div>

              {/* Listings list */}
              <div className="divide-y divide-[var(--card-border)] border border-[var(--card-border)] rounded bg-[var(--background)]">
                {c.listings.map((l, index) => (
                  <div key={l.id} className="p-3 flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-2">
                      <Link2 className="h-3.5 w-3.5 text-[var(--muted)]" />
                      <span>
                        Source: <strong>{l.source}</strong> ({l.location})
                      </span>
                    </div>

                    <span className="text-[9px] text-[var(--muted)] uppercase font-semibold">
                      {index === 0 ? "Marked as Canonical" : "Detected Duplicate"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
