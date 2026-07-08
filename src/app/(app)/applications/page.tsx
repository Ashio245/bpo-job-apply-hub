import React from "react";
import prisma from "@/lib/prisma";
import { inMemoryDb } from "@/lib/db-fallback";
import ApplicationsClient from "./ApplicationsClient";

export default async function ApplicationsPage() {
  let applications: any[] = [];
  let dbActive = true;

  try {
    applications = await prisma.jobApplication.findMany({
      where: { user: { email: "juan@example.com" } },
      include: {
        job: {
          include: { source: true }
        }
      },
      orderBy: { updatedAt: "desc" }
    });
  } catch (err) {
    dbActive = false;
    // Map in memory applications fallback
    applications = inMemoryDb.applications.map(app => {
      const job = inMemoryDb.listings.find(l => l.id === app.jobListingId);
      const source = inMemoryDb.sources.find(s => s.id === job?.sourceId);
      return {
        ...app,
        job: {
          ...job,
          source
        }
      };
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Application Tracker</h1>
        <p className="text-xs text-[var(--muted)]">
          Monitor your active BPO applications, interview dates, and recruitment status.
        </p>
      </div>

      <ApplicationsClient initialApplications={applications} dbActive={dbActive} />
    </div>
  );
}
