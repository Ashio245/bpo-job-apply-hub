import { JobListing, JobSource } from "@prisma/client";

export interface NormalizedListingInput {
  externalJobId: string;
  externalUrl: string;
  title: string;
  companyName: string;
  locationText: string;
  city?: string;
  region?: string;
  workSetup: "ONSITE" | "HYBRID" | "REMOTE";
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  category: string;
  seniority: "ENTRY_LEVEL" | "ASSOCIATE" | "SENIOR" | "LEAD";
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  description: string;
  descriptionSnippet?: string;
  requirements: string[];
  tags: string[];
  postedAt: Date;
  expiresAt?: Date;
  quickApplySupported: boolean;
  applyMethod: "IN_APP" | "ASSISTED" | "EXTERNAL";
}

export interface JobSourceAdapter {
  sourceKey: string;
  name: string;
  
  fetchListings(limit?: number): Promise<NormalizedListingInput[]>;
  getApplyMethod(): "IN_APP" | "ASSISTED" | "EXTERNAL";
  isEligibleForQuickApply(listing: JobListing): boolean;
  getComplianceNotice(): string;
}
