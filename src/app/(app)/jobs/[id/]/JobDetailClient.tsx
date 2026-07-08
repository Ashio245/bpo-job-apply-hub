"use client";

import React, { useState } from "react";
import { Landmark, CheckCircle, Layers, ExternalLink, Bookmark, BookmarkCheck, ShieldCheck, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface JobDetailClientProps {
  job: any;
  termsNotice?: string;
}

export default function JobDetailClient({ job, termsNotice }: JobDetailClientProps) {
  const { toast } = useToast();

  const [saved, setSaved] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [applyState, setApplyState] = useState<"idle" | "applying" | "applied">("idle");
  const [confirmationRef, setConfirmationRef] = useState("");

  const handleSave = () => {
    setSaved(!saved);
    toast(saved ? "Removed from bookmarks" : "Saved to bookmarks", {
      type: "success",
      message: saved ? `You unsaved ${job.title}` : `You bookmarked ${job.title}`
    });
  };

  const handleQueue = () => {
    setInQueue(!inQueue);
    toast(inQueue ? "Removed from Apply Queue" : "Added to Apply Queue", {
      type: inQueue ? "info" : "success",
      message: inQueue ? "Removed from batch queue" : "Added to batch apply queue"
    });
  };

  const handleApply = () => {
    if (job.applyMethod === "EXTERNAL") {
      // Safe external redirect workflow
      window.open(job.externalUrl, "_blank", "noopener,noreferrer");
      toast("Redirecting to source website", {
        type: "info",
        message: `Opening original post on ${job.source?.name || "partner board"}...`
      });
      return;
    }

    // In-app or Assisted apply sequence
    setApplyState("applying");
    setTimeout(() => {
      setApplyState("applied");
      const ref = `BPO-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmationRef(ref);
      toast("Application Submitted Successfully!", {
        type: "success",
        message: `Reference: ${ref}. Employer notified.`
      });
    }, 1500);
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-5 space-y-5">
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider">Application Method</h3>
        {job.applyMethod === "IN_APP" && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-md space-y-1.5">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5" />
              Direct In-App Apply Supported
            </span>
            <p className="text-[10px] text-[var(--muted)] leading-relaxed">
              Your profile is verified and complete. Submitting sends your resume directly to the employer's screening queue.
            </p>
          </div>
        )}

        {job.applyMethod === "ASSISTED" && (
          <div className="p-3 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/50 rounded-md space-y-1.5">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
              <Layers className="h-4.5 w-4.5" />
              Assisted Apply Supported
            </span>
            <p className="text-[10px] text-[var(--muted)] leading-relaxed">
              We prefill your candidate information, format a clean portfolio page, and bridge the submission directly.
            </p>
          </div>
        )}

        {job.applyMethod === "EXTERNAL" && (
          <div className="p-3 bg-stone-50 dark:bg-stone-900 border border-[var(--card-border)] rounded-md space-y-1.5">
            <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
              <ExternalLink className="h-4.5 w-4.5 text-[var(--muted)]" />
              External Platform Submission
            </span>
            <p className="text-[10px] text-[var(--muted)] leading-relaxed">
              Applying redirects to the partner job board. We have compiled a pre-apply checklist to save you time.
            </p>
          </div>
        )}
      </div>

      {termsNotice && (
        <div className="p-3 bg-stone-50 dark:bg-stone-900 border-l-2 border-stone-400 text-[10px] text-[var(--muted)] leading-relaxed">
          <span className="font-bold block text-[var(--foreground)] mb-0.5">Compliance Notice:</span>
          {termsNotice}
        </div>
      )}

      {/* Quick Action buttons */}
      <div className="space-y-2 pt-2 border-t border-[var(--card-border)]">
        {applyState === "applied" ? (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-md text-center space-y-2">
            <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto" />
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 block">Applied Successfully</span>
            <span className="text-[10px] font-mono text-[var(--muted)] bg-[var(--background)] px-2 py-0.5 rounded border border-[var(--card-border)] inline-block">
              Ref: {confirmationRef}
            </span>
          </div>
        ) : (
          <Button
            className="w-full flex items-center justify-center gap-1.5"
            onClick={handleApply}
            isLoading={applyState === "applying"}
          >
            {job.applyMethod === "EXTERNAL" ? (
              <>
                <span>Apply on Source Site</span>
                <ExternalLink className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>Apply Instantly</span>
                <ShieldCheck className="h-4 w-4" />
              </>
            )}
          </Button>
        )}

        {/* Add to Queue or Bookmark */}
        {applyState !== "applied" && ["IN_APP", "ASSISTED"].includes(job.applyMethod) && (
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-1.5 text-xs"
            onClick={handleQueue}
          >
            <Layers className="h-4 w-4 text-[var(--accent)]" />
            <span>{inQueue ? "Remove from Queue" : "Add to Apply Queue"}</span>
          </Button>
        )}

        <Button
          variant="ghost"
          className="w-full flex items-center justify-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
          onClick={handleSave}
        >
          {saved ? (
            <>
              <BookmarkCheck className="h-4 w-4 text-amber-500" />
              <span>Bookmarked</span>
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" />
              <span>Save for Later</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
