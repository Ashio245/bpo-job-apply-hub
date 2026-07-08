import { BaseJobSourceAdapter } from "./base-adapter";
import { NormalizedListingInput } from "./types";

export class PhilJobNetAdapter extends BaseJobSourceAdapter {
  sourceKey = "philjobnet";
  name = "PhilJobNet";
  applyMethod: "IN_APP" | "ASSISTED" | "EXTERNAL" = "EXTERNAL";
  complianceNotice = "PhilJobNet is a public employment portal. Application submissions require you to register/log in to your official PhilJobNet account.";

  async fetchListings(limit = 5): Promise<NormalizedListingInput[]> {
    await this.sleep(100);

    const listingsData = [
      {
        externalJobId: "pjn-0912",
        externalUrl: "https://philjobnet.gov.ph/job/customer-support-agent-0912",
        title: "Customer Support Agent - Government Account",
        companyName: "VXI Global Solutions",
        locationText: "Davao City, Davao del Sur",
        city: "Davao City",
        region: "Davao Region (Region 11)",
        workSetup: "ONSITE" as const,
        employmentType: "FULL_TIME" as const,
        category: "CUSTOMER_SERVICE",
        seniority: "ENTRY_LEVEL" as const,
        salaryMin: 15000,
        salaryMax: 19000,
        currency: "PHP",
        description: "VXI Davao is hiring Customer Support Agents for a public service/government utility account. The agent will handle inquiries, complaints, and billing issues for residents. Standard government benefits and local incentives apply.",
        requirements: [
          "High school graduate or college undergraduate",
          "Fluent in English and local languages (Tagalog/Bisaya)",
          "Polite telephone manner and patient demeanor",
          "Willing to work on a rotating shift schedule in Davao City"
        ],
        tags: ["Davao", "Government Utility", "Bilingual", "Entry-level"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
        quickApplySupported: false
      },
      {
        externalJobId: "pjn-4412",
        externalUrl: "https://philjobnet.gov.ph/job/content-moderator-4412",
        title: "Content Moderator - Social Media Account",
        companyName: "Cognizant Philippines",
        locationText: "Taguig City (BGC), Metro Manila",
        city: "Taguig (BGC)",
        region: "Metro Manila (NCR)",
        workSetup: "ONSITE" as const,
        employmentType: "FULL_TIME" as const,
        category: "CONTENT_MODERATION",
        seniority: "ASSOCIATE" as const,
        salaryMin: 22000,
        salaryMax: 27000,
        currency: "PHP",
        description: "Cognizant is hiring Content Moderators to monitor and filter online social media posts. You will review text, images, and videos against safety guidelines, categorizing flags and maintaining platform integrity.",
        requirements: [
          "Bachelor's degree or finished at least 2 years in college",
          "Strong emotional resilience and ability to view sensitive content daily",
          "Excellent comprehension of social media trends and pop culture",
          "Excellent analytical and writing skills in English"
        ],
        tags: ["Content Moderator", "BGC", "Non-Voice", "Resilience"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        quickApplySupported: false
      }
    ];

    return listingsData.map(l => this.createNormalizedListing(l)).slice(0, limit);
  }
}
