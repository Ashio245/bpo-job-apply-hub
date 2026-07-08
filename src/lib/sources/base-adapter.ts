import { JobListing } from "@prisma/client";
import { JobSourceAdapter, NormalizedListingInput } from "./types";
import { generateCanonicalHash } from "../dedupe";

export abstract class BaseJobSourceAdapter implements JobSourceAdapter {
  abstract sourceKey: string;
  abstract name: string;
  abstract applyMethod: "IN_APP" | "ASSISTED" | "EXTERNAL";
  abstract complianceNotice: string;

  abstract fetchListings(limit?: number): Promise<NormalizedListingInput[]>;

  getApplyMethod(): "IN_APP" | "ASSISTED" | "EXTERNAL" {
    return this.applyMethod;
  }

  isEligibleForQuickApply(listing: JobListing): boolean {
    return listing.quickApplySupported && this.getApplyMethod() !== "EXTERNAL";
  }

  getComplianceNotice(): string {
    return this.complianceNotice;
  }

  // Rate limit delay utility
  protected async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Common normalization helper
  protected createNormalizedListing(
    input: Partial<NormalizedListingInput> & {
      externalJobId: string;
      externalUrl: string;
      title: string;
      companyName: string;
      locationText: string;
      description: string;
    }
  ): NormalizedListingInput {
    return {
      externalJobId: input.externalJobId,
      externalUrl: input.externalUrl,
      title: input.title,
      companyName: input.companyName,
      locationText: input.locationText,
      city: input.city || "Metro Manila",
      region: input.region || "Metro Manila (NCR)",
      workSetup: input.workSetup || "ONSITE",
      employmentType: input.employmentType || "FULL_TIME",
      category: input.category || "CUSTOMER_SERVICE",
      seniority: input.seniority || "ENTRY_LEVEL",
      salaryMin: input.salaryMin,
      salaryMax: input.salaryMax,
      currency: input.currency || "PHP",
      description: input.description,
      descriptionSnippet: input.descriptionSnippet || input.description.substring(0, 160) + "...",
      requirements: input.requirements || [],
      tags: input.tags || [],
      postedAt: input.postedAt || new Date(),
      expiresAt: input.expiresAt,
      quickApplySupported: input.quickApplySupported || false,
      applyMethod: this.getApplyMethod(),
    };
  }
}
