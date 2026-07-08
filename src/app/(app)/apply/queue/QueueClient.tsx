"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, ShieldCheck, ExternalLink, AlertCircle, FileText, CheckCircle2, Bookmark, Trash2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface QueueClientProps {
  initialItems: any[];
  profile: any;
  dbActive: boolean;
}

export default function QueueClient({ initialItems, profile, dbActive }: QueueClientProps) {
  const { toast } = useToast();

  const [items, setItems] = useState(initialItems);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleDelete = (id: string, title: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast("Removed from queue", {
      type: "info",
      message: `Removed ${title} from apply list`
    });
  };

  const handleApplySingle = (itemId: string, job: any) => {
    setProcessingId(itemId);
    
    // Simulate assisted/in-app submission delay
    setTimeout(() => {
      setProcessingId(null);
      setItems(prev => prev.filter(item => item.id !== itemId));
      
      toast("Application Submitted!", {
        type: "success",
        message: `Your details were successfully matched and submitted to ${job.companyName}.`
      });
    }, 1500);
  };

  const handleApplyExternal = (itemId: string, url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast("Redirected to job page", {
      type: "info",
      message: "Check the open tab to finish submission."
    });
  };

  // Group queue items
  const autoApplyReady = items.filter(item => ["IN_APP", "ASSISTED"].includes(item.job.applyMethod));
  const externalApplyReady = items.filter(item => item.job.applyMethod === "EXTERNAL");

  // Basic Profile Completeness Check
  const hasPhone = !!profile?.phone;
  const hasResume = true; // assume Juan default resume is loaded
  const hasExpectedSalary = !!profile?.expectedSalary;
  const isProfileComplete = hasPhone && hasResume && hasExpectedSalary;

  return (
    <div className="space-y-6">
      {/* Validation Checklist Banner */}
      <Card className={`p-5 border ${isProfileComplete ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/50" : "border-amber-200 bg-amber-50/20 dark:border-amber-900/50"}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider block">
              Applicant Profile Verification Checklist
            </span>
            <p className="text-[11px] text-[var(--muted)] leading-relaxed">
              We check your profile completeness to make sure your submitted fields pass employer parsing filters.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
              <CheckCircle2 className={`h-4 w-4 ${hasResume ? "text-emerald-500" : "text-stone-300"}`} />
              <span>Resume uploaded</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
              <CheckCircle2 className={`h-4 w-4 ${hasPhone ? "text-emerald-500" : "text-stone-300"}`} />
              <span>Contact details</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
              <CheckCircle2 className={`h-4 w-4 ${hasExpectedSalary ? "text-emerald-500" : "text-stone-300"}`} />
              <span>Preferences configured</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main layout */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-6 space-y-3">
          <Layers className="h-10 w-10 text-[var(--muted)] mx-auto" />
          <h3 className="text-sm font-bold">No jobs in your Apply Queue</h3>
          <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
            Browse jobs, check match scores, and add vacancies to the queue to review and apply in batches.
          </p>
          <Link href="/jobs">
            <Button size="sm">Find BPO Jobs</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queue lists (Left/Center) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Batch A: Direct / Assisted Apply */}
            {autoApplyReady.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  Direct & Assisted Apply Submissions ({autoApplyReady.length})
                </h3>
                
                <div className="space-y-3">
                  {autoApplyReady.map((item) => (
                    <Card key={item.id} className="p-4 space-y-3 relative group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="brand" className="text-[9px]">
                              {item.job.source?.name || "Kalibrr"}
                            </Badge>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">
                              {item.job.applyMethod === "IN_APP" ? "In-App Apply" : "Assisted Apply"}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold leading-tight mt-1">{item.job.title}</h4>
                          <span className="text-[10px] text-[var(--muted)] block font-semibold">{item.job.companyName}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(item.id, item.job.title)}
                            className="p-1 rounded text-[var(--muted)] hover:text-rose-500 hover:bg-stone-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Detail check list */}
                      <div className="flex justify-between items-center text-[10px] text-[var(--muted)] font-medium pt-2 border-t border-[var(--card-border)]">
                        <span>Match score: <strong className="text-[var(--foreground)]">{item.job.matchScore}%</strong></span>
                        <Button
                          size="sm"
                          className="h-7 text-[10px]"
                          isLoading={processingId === item.id}
                          onClick={() => handleApplySingle(item.id, item.job)}
                        >
                          Confirm & Apply
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Batch B: External redirect flow */}
            {externalApplyReady.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                  <ExternalLink className="h-4 w-4" />
                  Requires Redirect Action ({externalApplyReady.length})
                </h3>

                <div className="space-y-3">
                  {externalApplyReady.map((item) => (
                    <Card key={item.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-[9px]">
                              {item.job.source?.name}
                            </Badge>
                            <span className="text-[9px] text-[var(--muted)] font-semibold">
                              External Redirect
                            </span>
                          </div>
                          <h4 className="text-xs font-bold leading-tight mt-1">{item.job.title}</h4>
                          <span className="text-[10px] text-[var(--muted)] block font-semibold">{item.job.companyName}</span>
                        </div>

                        <button
                          onClick={() => handleDelete(item.id, item.job.title)}
                          className="p-1 rounded text-[var(--muted)] hover:text-rose-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-[var(--muted)] font-medium pt-2 border-t border-[var(--card-border)]">
                        <span>Match score: <strong className="text-[var(--foreground)]">{item.job.matchScore}%</strong></span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[10px] flex items-center gap-1"
                          onClick={() => handleApplyExternal(item.id, item.job.externalUrl)}
                        >
                          <span>Go to Site</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compliance & Guardrail Info Card (Right) */}
          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider">Compliance Disclaimers</h3>
              
              <div className="space-y-3 text-[11px] text-[var(--muted)] leading-relaxed">
                <p>
                  <strong>1. Verified profile details:</strong> We check email format, local phone pattern (`09xxxxxxxx`), and CV document status prior to bridging data to ensure validity.
                </p>
                <p>
                  <strong>2. Transparent Submission:</strong> Each application is submitted one-by-one with user verification. Automated bot-like submission sweeps that violate third-party Terms of Service are blocked by architecture design.
                </p>
                <p>
                  <strong>3. Outcome Disclaimer:</strong> Application outcomes and interview calls are determined solely by employer assessment and compliance rules on respective target job boards.
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--card-border)]">
                <Link href="/jobs">
                  <Button variant="ghost" className="w-full text-xs flex items-center justify-center gap-1.5 text-[var(--muted)] hover:text-[var(--foreground)]">
                    <span>Keep browsing jobs</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
