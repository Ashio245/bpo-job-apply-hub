"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Shield, Bell, HelpCircle, Eye, Moon, Settings, Database } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [notif, setNotif] = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast("Settings Saved", {
        type: "success",
        message: "Preferences updated successfully."
      });
    }, 1000);
  };

  const handleClearCache = () => {
    toast("Ingestion cache cleared", {
      type: "info",
      message: "Cleared all duplicate cache clusters."
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Account & Preferences</h1>
        <p className="text-xs text-[var(--muted)]">
          Manage your notifications, data privacy settings, and application defaults.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Notifications */}
        <Card className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-[var(--card-border)] pb-2">
            <Bell className="h-4 w-4 text-[var(--accent)]" />
            Email Notifications
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notif}
                onChange={(e) => setNotif(e.target.checked)}
                className="mt-0.5 rounded border-[var(--card-border)] text-[var(--accent)]"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold block">Instant Job Alerts</span>
                <span className="text-[10px] text-[var(--muted)] block leading-normal">
                  Send email immediately when a direct matching BPO job (90%+ score) is ingested in my city.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer pt-3 border-t border-[var(--card-border)]">
              <input
                type="checkbox"
                checked={weekly}
                onChange={(e) => setWeekly(e.target.checked)}
                className="mt-0.5 rounded border-[var(--card-border)] text-[var(--accent)]"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold block">Weekly Digest Summary</span>
                <span className="text-[10px] text-[var(--muted)] block leading-normal">
                  Receive a consolidated report of BPO applications status updates and newly aggregate entries.
                </span>
              </div>
            </label>
          </div>
        </Card>

        {/* Card 2: Privacy */}
        <Card className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-[var(--card-border)] pb-2">
            <Shield className="h-4 w-4 text-[var(--accent)]" />
            Privacy & Guardrails
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="mt-0.5 rounded border-[var(--card-border)] text-[var(--accent)]"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold block">Searchable Profile</span>
                <span className="text-[10px] text-[var(--muted)] block leading-normal">
                  Allow partner BPO recruiters to search my core profile and verified skills. Resumes remain confidential until direct apply actions are executed.
                </span>
              </div>
            </label>

            <div className="p-3 bg-stone-50 dark:bg-stone-900 border border-[var(--card-border)] rounded text-[10px] text-[var(--muted)] leading-relaxed">
              <span className="font-bold text-[var(--foreground)] block mb-0.5">Assisted Apply Logging:</span>
              We capture audit logs containing IP address, date, and job references for all submissions. This helps prevent fraud and provides confirmation histories for tracking.
            </div>
          </div>
        </Card>

        {/* Card 3: Theme */}
        <Card className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-[var(--card-border)] pb-2">
            <Moon className="h-4 w-4 text-[var(--accent)]" />
            Theme & Appearance
          </h3>

          <div className="flex items-center gap-2">
            {["light", "dark", "system"].map((t) => (
              <Button
                key={t}
                type="button"
                variant={theme === t ? "primary" : "outline"}
                size="sm"
                onClick={() => setTheme(t as any)}
                className="capitalize text-xs font-bold"
              >
                {t}
              </Button>
            ))}
          </div>
        </Card>

        {/* Card 4: Dev diagnostics */}
        <Card className="space-y-4 border-amber-200 bg-amber-50/10 dark:border-amber-900/30">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-amber-200 dark:border-amber-900/30 pb-2 text-amber-800 dark:text-amber-400">
            <Database className="h-4 w-4" />
            Developer Diagnostics
          </h3>

          <div className="flex items-center gap-3">
            <Button size="sm" type="button" variant="outline" onClick={handleClearCache} className="text-xs">
              Clear duplicate index cache
            </Button>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={saving}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
