import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Upload } from "lucide-react";
import prisma from "@/lib/prisma";
import { inMemoryDb } from "@/lib/db-fallback";
import ResumeManagerClient from "./ResumeManagerClient";

export default async function ResumesPage() {
  let resumes: any[] = [];
  let dbActive = true;

  try {
    resumes = await prisma.resume.findMany({
      where: { user: { email: "juan@example.com" } },
      orderBy: { createdAt: "desc" }
    });
  } catch (err) {
    dbActive = false;
    resumes = inMemoryDb.resumes.get("user-1") || [];
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/profile" className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] btn-transition">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Profile</span>
      </Link>

      <div>
        <h1 className="text-xl font-bold tracking-tight">Resume & CV Manager</h1>
        <p className="text-xs text-[var(--muted)]">
          Upload your CV to auto-fill your profile. We support PDF and DOCX files up to 5MB.
        </p>
      </div>

      <ResumeManagerClient initialResumes={resumes} dbActive={dbActive} />
    </div>
  );
}
