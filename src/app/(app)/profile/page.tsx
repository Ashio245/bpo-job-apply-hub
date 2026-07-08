import React from "react";
import prisma from "@/lib/prisma";
import { inMemoryDb } from "@/lib/db-fallback";
import ProfileClientForm from "./ProfileClientForm";

export default async function ProfilePage() {
  let profile: any = null;
  let dbActive = true;

  try {
    profile = await prisma.candidateProfile.findFirst({
      where: { user: { email: "juan@example.com" } }
    });
  } catch (err) {
    dbActive = false;
    profile = inMemoryDb.profiles.get("user-1") || null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Applicant Profile</h1>
        <p className="text-xs text-[var(--muted)]">
          Manage your reusable BPO job seeker profile, preferences, and answers.
        </p>
      </div>

      <ProfileClientForm initialProfile={profile} dbActive={dbActive} />
    </div>
  );
}
