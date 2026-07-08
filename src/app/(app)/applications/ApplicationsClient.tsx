"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Calendar, AlertCircle, CheckCircle, FileText, ChevronRight, MessageSquare, Plus, Clock, Eye } from "lucide-react";
import { APPLICATION_STATUSES } from "@/lib/constants";

interface ApplicationsClientProps {
  initialApplications: any[];
  dbActive: boolean;
}

export default function ApplicationsClient({ initialApplications, dbActive }: ApplicationsClientProps) {
  const { toast } = useToast();
  const [apps, setApps] = useState(initialApplications);

  const [activeNotesId, setActiveNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const handleStatusChange = (appId: string, newStatus: string) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    toast("Status Updated", {
      type: "success",
      message: `Application moved to ${newStatus}`
    });
  };

  const handleSaveNotes = (appId: string) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, notes: noteText } : a));
    setActiveNotesId(null);
    toast("Notes Saved", {
      type: "success",
      message: "Successfully saved application note details."
    });
  };

  // Stats calculation
  const totalApplied = apps.length;
  const interviewScheduled = apps.filter(a => a.status === "INTERVIEW").length;
  const offersReceived = apps.filter(a => a.status === "OFFER").length;
  const pendingActions = apps.filter(a => a.status === "EXTERNAL_ACTION_NEEDED").length;

  return (
    <div className="space-y-6">
      {/* Quick Dashboard statistics header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-[var(--card)] text-center space-y-1">
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Submitted</span>
          <p className="text-xl font-extrabold text-[var(--accent)]">{totalApplied}</p>
        </Card>
        <Card className="p-4 bg-[var(--card)] text-center space-y-1">
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Action Needed</span>
          <p className="text-xl font-extrabold text-amber-500">{pendingActions}</p>
        </Card>
        <Card className="p-4 bg-[var(--card)] text-center space-y-1">
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Interviews</span>
          <p className="text-xl font-extrabold text-blue-500">{interviewScheduled}</p>
        </Card>
        <Card className="p-4 bg-[var(--card)] text-center space-y-1">
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Offers</span>
          <p className="text-xl font-extrabold text-emerald-500">{offersReceived}</p>
        </Card>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Submitted & Action Needed */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--card-border)] pb-2 flex items-center justify-between">
            <span>Submitted & Actions</span>
            <span className="bg-stone-100 text-stone-600 dark:bg-stone-900 dark:text-stone-400 px-2 py-0.5 rounded text-[10px]">
              {apps.filter(a => ["SUBMITTED", "EXTERNAL_ACTION_NEEDED", "READY"].includes(a.status)).length}
            </span>
          </h3>

          <div className="space-y-3">
            {apps.filter(a => ["SUBMITTED", "EXTERNAL_ACTION_NEEDED", "READY"].includes(a.status)).map((app) => (
              <Card key={app.id} className="p-4 space-y-3 relative group">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <Badge variant={app.status === "EXTERNAL_ACTION_NEEDED" ? "warning" : "brand"} className="text-[9px]">
                      {app.status === "EXTERNAL_ACTION_NEEDED" ? "Action Required" : "Submitted"}
                    </Badge>
                    <span className="text-[9px] text-[var(--muted)] font-medium">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold leading-tight line-clamp-1">{app.job.title}</h4>
                    <span className="text-[10px] text-[var(--muted)] block font-semibold">{app.job.companyName}</span>
                  </div>

                  {app.sourceConfirmationRef && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30 w-fit">
                      Ref: {app.sourceConfirmationRef}
                    </span>
                  )}

                  {app.status === "EXTERNAL_ACTION_NEEDED" && (
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded flex items-start gap-1 text-[9px] text-amber-800 dark:text-amber-400 leading-normal">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                      <span>Action: Complete external form redirect on {app.job.source?.name || "JobStreet"}.</span>
                    </div>
                  )}

                  {app.notes && (
                    <p className="text-[10px] text-[var(--muted)] bg-[var(--background)] p-2 rounded border border-[var(--card-border)] leading-relaxed italic">
                      Note: "{app.notes}"
                    </p>
                  )}
                </div>

                {/* Footers with Note editing & state mapping */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)] text-[10px]">
                  <button
                    onClick={() => {
                      setActiveNotesId(app.id);
                      setNoteText(app.notes || "");
                    }}
                    className="text-[var(--accent)] hover:underline font-bold"
                  >
                    Edit Notes
                  </button>

                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="bg-transparent border-none outline-none font-bold text-[var(--foreground)] cursor-pointer"
                  >
                    <option value="SUBMITTED">Submitted</option>
                    <option value="EXTERNAL_ACTION_NEEDED">Action Req</option>
                    <option value="INTERVIEW">Scheduled Interview</option>
                    <option value="REJECTED">Closed / Rejected</option>
                  </select>
                </div>

                {activeNotesId === app.id && (
                  <div className="absolute inset-0 bg-[var(--card)] p-4 rounded-lg flex flex-col justify-between z-10">
                    <textarea
                      rows={3}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] focus:outline-none"
                      placeholder="Add recruiter feedback or application timestamps..."
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => setActiveNotesId(null)}>
                        Cancel
                      </Button>
                      <Button size="sm" className="h-7 text-[10px]" onClick={() => handleSaveNotes(app.id)}>
                        Save Note
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Column 2: Interview Scheduled */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 border-b border-[var(--card-border)] pb-2 flex items-center justify-between">
            <span>Interview Scheduled</span>
            <span className="bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded text-[10px]">
              {apps.filter(a => a.status === "INTERVIEW").length}
            </span>
          </h3>

          <div className="space-y-3">
            {apps.filter(a => a.status === "INTERVIEW").map((app) => (
              <Card key={app.id} className="p-4 space-y-3 border-blue-200 dark:border-blue-900/50">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="info" className="text-[9px]">Interview</Badge>
                    <span className="text-[9px] text-[var(--muted)] font-medium">
                      {new Date(app.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold leading-tight">{app.job.title}</h4>
                    <span className="text-[10px] text-[var(--muted)] block font-semibold">{app.job.companyName}</span>
                  </div>

                  {app.notes && (
                    <p className="text-[10px] text-[var(--muted)] bg-blue-50/20 dark:bg-blue-950/10 p-2 rounded border border-blue-100 dark:border-blue-900/30 leading-relaxed italic">
                      "{app.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)] text-[10px]">
                  <button
                    onClick={() => {
                      setActiveNotesId(app.id);
                      setNoteText(app.notes || "");
                    }}
                    className="text-[var(--accent)] hover:underline font-bold"
                  >
                    Edit Notes
                  </button>

                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="bg-transparent border-none outline-none font-bold text-[var(--foreground)] cursor-pointer"
                  >
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer Received</option>
                    <option value="REJECTED">Closed / Rejected</option>
                  </select>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Column 3: Offers Received / Closed */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border-b border-[var(--card-border)] pb-2 flex items-center justify-between">
            <span>Offers & Closed</span>
            <span className="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px]">
              {apps.filter(a => ["OFFER", "REJECTED"].includes(a.status)).length}
            </span>
          </h3>

          <div className="space-y-3">
            {apps.filter(a => ["OFFER", "REJECTED"].includes(a.status)).map((app) => (
              <Card key={app.id} className={`p-4 space-y-3 border ${
                app.status === "OFFER" ? "border-emerald-200 dark:border-emerald-900/50" : "border-[var(--card-border)]"
              }`}>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <Badge variant={app.status === "OFFER" ? "success" : "error"} className="text-[9px]">
                      {app.status === "OFFER" ? "Offer Received" : "Closed"}
                    </Badge>
                    <span className="text-[9px] text-[var(--muted)] font-medium">
                      {new Date(app.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold leading-tight">{app.job.title}</h4>
                    <span className="text-[10px] text-[var(--muted)] block font-semibold">{app.job.companyName}</span>
                  </div>

                  {app.notes && (
                    <p className="text-[10px] text-[var(--muted)] bg-[var(--background)] p-2 rounded border border-[var(--card-border)] leading-relaxed italic">
                      "{app.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)] text-[10px]">
                  <button
                    onClick={() => {
                      setActiveNotesId(app.id);
                      setNoteText(app.notes || "");
                    }}
                    className="text-[var(--accent)] hover:underline font-bold"
                  >
                    Edit Notes
                  </button>

                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="bg-transparent border-none outline-none font-bold text-[var(--foreground)] cursor-pointer"
                  >
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Closed / Rejected</option>
                  </select>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
