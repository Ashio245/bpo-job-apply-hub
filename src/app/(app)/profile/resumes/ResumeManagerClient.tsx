"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, Trash2, ShieldAlert, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

interface ResumeManagerClientProps {
  initialResumes: any[];
  dbActive: boolean;
}

export default function ResumeManagerClient({ initialResumes, dbActive }: ResumeManagerClientProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumes, setResumes] = useState(initialResumes);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "parsing" | "success">("idle");
  const [dragActive, setDragActive] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<any | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Basic file validation
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith(".pdf")) {
      toast("Invalid file type", {
        type: "error",
        message: "Please upload a PDF or Word document (.doc, .docx)."
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast("File size too large", {
        type: "error",
        message: "File exceeds 5MB limit."
      });
      return;
    }

    // Trigger simulation sequence
    setUploadState("uploading");
    setTimeout(() => {
      setUploadState("parsing");
      setTimeout(() => {
        setUploadState("success");
        // Simulated parsed candidate data structure
        const parsed = {
          fullName: file.name.replace(/[-_]/g, " ").replace(/\.pdf|\.docx/i, ""),
          email: "juan.delacruz@bpoapply.ph",
          phone: "0917-889-1123",
          skills: ["Customer Service", "Outbound Sales", "English Communication", "Active Listening"],
          experience: "2.5 Years CSR Experience",
          languages: ["English", "Tagalog"]
        };
        setParsedPreview(parsed);

        // Add to local state list
        const newResume = {
          id: `res-${Date.now()}`,
          fileName: file.name,
          fileSize: file.size,
          fileUrl: "/uploads/mock.pdf",
          isDefault: resumes.length === 0,
          createdAt: new Date()
        };
        setResumes(prev => [newResume, ...prev]);

        toast("Resume Parsed Successfully!", {
          type: "success",
          message: "Mapped name, email, phone and core skills to your profile."
        });
      }, 1500);
    }, 1000);
  };

  const handleSetDefault = (id: string) => {
    setResumes(prev => prev.map(r => ({ ...r, isDefault: r.id === id })));
    toast("Default CV Updated", {
      type: "success",
      message: "This resume will now be used for assisted applications."
    });
  };

  const handleDelete = (id: string, name: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
    toast("Resume Deleted", {
      type: "info",
      message: `Successfully deleted ${name}`
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Upload Column (Left/Center) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Drag & Drop Card */}
        <Card
          className={`border-dashed border-2 p-8 text-center flex flex-col items-center justify-center min-h-[220px] btn-transition select-none ${
            dragActive ? "border-[var(--accent)] bg-[var(--accent-light)]" : "border-[var(--card-border)] bg-[var(--card)]"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {uploadState === "idle" && (
            <div className="space-y-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="h-10 w-10 rounded bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center mx-auto">
                <Upload className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  Drag and drop your resume file here
                </p>
                <p className="text-[10px] text-[var(--muted)]">
                  or click to browse PDF or Word documents (max 5MB)
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
            </div>
          )}

          {uploadState === "uploading" && (
            <div className="space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)] mx-auto" />
              <p className="text-xs font-semibold">Uploading document safely...</p>
            </div>
          )}

          {uploadState === "parsing" && (
            <div className="space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400 mx-auto" />
              <p className="text-xs font-semibold flex items-center gap-1.5 justify-center">
                <Sparkles className="h-4 w-4 text-[var(--accent)] animate-pulse" />
                Extracting candidate information...
              </p>
            </div>
          )}

          {uploadState === "success" && (
            <div className="space-y-4">
              <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase">CV Uploaded & Parsed</p>
                <p className="text-[10px] text-[var(--muted)]">Ready for assisted application submissions.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setUploadState("idle")}>
                Upload Another File
              </Button>
            </div>
          )}
        </Card>

        {/* Parsed Result Preview */}
        {parsedPreview && (
          <Card className="border-emerald-200 bg-emerald-50/10 dark:bg-emerald-950/5 dark:border-emerald-900/30 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
              Extracted Profile Preview
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-[var(--muted)] block font-semibold uppercase">Extracted Name</span>
                <span className="font-bold">{parsedPreview.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted)] block font-semibold uppercase">Extracted Phone</span>
                <span>{parsedPreview.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted)] block font-semibold uppercase">Extracted Email</span>
                <span>{parsedPreview.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--muted)] block font-semibold uppercase">BPO Experience Fit</span>
                <span className="font-bold">{parsedPreview.experience}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--card-border)] space-y-1.5">
              <span className="text-[10px] text-[var(--muted)] block font-semibold uppercase">Extracted Core Skills</span>
              <div className="flex flex-wrap gap-1">
                {parsedPreview.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="text-[9px]">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-900 border border-[var(--card-border)] rounded text-[10px] text-[var(--muted)] leading-relaxed">
              <span className="font-bold text-[var(--foreground)] block mb-0.5">Please Review:</span>
              Parsing heuristics are never 100% correct. Any incorrect information can be modified manually on the <Link href="/profile" className="text-[var(--accent)] hover:underline font-bold">Applicant Profile Page</Link>.
            </div>
          </Card>
        )}
      </div>

      {/* File List Column (Right) */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Active Documents</h3>
        
        {resumes.length === 0 ? (
          <div className="text-center py-10 bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-5">
            <FileText className="h-8 w-8 text-[var(--muted)] mx-auto mb-2" />
            <p className="text-xs font-semibold">No CV uploaded yet</p>
          </div>
        ) : (
          resumes.map((res) => (
            <Card key={res.id} className="p-4 space-y-3 relative">
              <div className="flex items-start gap-3">
                <FileText className="h-8 w-8 text-[var(--accent)] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold truncate leading-snug">{res.fileName}</h4>
                  <span className="text-[10px] text-[var(--muted)] block font-medium mt-0.5">
                    {(res.fileSize / 1024).toFixed(1)} KB • {new Date(res.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)]">
                {res.isDefault ? (
                  <Badge variant="brand" className="text-[9px]">Default Apply CV</Badge>
                ) : (
                  <button
                    onClick={() => handleSetDefault(res.id)}
                    className="text-[10px] font-bold text-[var(--accent)] hover:underline"
                  >
                    Set as Default
                  </button>
                )}

                <button
                  onClick={() => handleDelete(res.id, res.fileName)}
                  className="text-[var(--muted)] hover:text-rose-500 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
