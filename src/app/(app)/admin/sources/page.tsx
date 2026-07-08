"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ShieldAlert, Activity, FileText, ToggleLeft, ToggleRight } from "lucide-react";
import { inMemoryDb } from "@/lib/db-fallback";

export default function AdminSourcesPage() {
  const { toast } = useToast();

  const [sources, setSources] = useState(inMemoryDb.sources);

  const handleToggleActive = (id: string, name: string, currentState: boolean) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    toast("Source status changed", {
      type: "success",
      message: `${name} has been ${currentState ? "disabled" : "enabled"}.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Source Adapter Management</h1>
        <p className="text-xs text-[var(--muted)]">
          Configure crawlers, rate limiting parameters, and check source compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sources.map((src) => (
          <Card key={src.id} className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-sm font-bold leading-tight">{src.name}</h3>
                <span className="text-[10px] text-[var(--muted)] font-mono">{src.key} adapter</span>
              </div>

              <button
                onClick={() => handleToggleActive(src.id, src.name, src.isActive)}
                className={`flex-shrink-0 cursor-pointer ${src.isActive ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}
              >
                {src.isActive ? (
                  <ToggleRight className="h-9 w-9" />
                ) : (
                  <ToggleLeft className="h-9 w-9" />
                )}
              </button>
            </div>

            {/* Compliance configs */}
            <div className="grid grid-cols-2 gap-2.5 text-[10px] bg-[var(--background)] p-3 border border-[var(--card-border)] rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Indexing Allowed:</span>
                <span className="font-bold">{src.indexingAllowed ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Deep Metadata:</span>
                <span className="font-bold">{src.deepExtractAllowed ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between items-center col-span-2 pt-2 border-t border-[var(--card-border)]/50">
                <span className="text-[var(--muted)]">Default Application Method:</span>
                <Badge variant={src.inAppApplyAllowed ? "success" : src.assistedApplyAllowed ? "brand" : "outline"} className="text-[8px]">
                  {src.inAppApplyAllowed ? "IN-APP" : src.assistedApplyAllowed ? "ASSISTED" : "EXTERNAL"}
                </Badge>
              </div>
            </div>

            {/* Terms notice info */}
            {src.termsNotice && (
              <p className="text-[9px] text-[var(--muted)] leading-relaxed italic bg-stone-50 dark:bg-stone-900 p-2.5 rounded border border-[var(--card-border)]">
                Disclaimer: "{src.termsNotice}"
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
