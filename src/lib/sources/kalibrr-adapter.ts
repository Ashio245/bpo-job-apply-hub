import { BaseJobSourceAdapter } from "./base-adapter";
import { NormalizedListingInput } from "./types";

export class KalibrrAdapter extends BaseJobSourceAdapter {
  sourceKey = "kalibrr";
  name = "Kalibrr PH";
  applyMethod: "IN_APP" | "ASSISTED" | "EXTERNAL" = "ASSISTED";
  complianceNotice = "Kalibrr ASSISTED APPLY matches your applicant profile directly. We will autofill your details and export a compliant profile data package for you to submit to their system in one click.";

  async fetchListings(limit = 5): Promise<NormalizedListingInput[]> {
    await this.sleep(180);

    const listingsData = [
      {
        externalJobId: "kb-482931",
        externalUrl: "https://www.kalibrr.com/c/accenture/jobs/482931/bilingual-customer-associate-spanish",
        title: "Spanish Bilingual Customer Associate",
        companyName: "Accenture Philippines",
        locationText: "Taguig City (BGC), Metro Manila",
        city: "Taguig (BGC)",
        region: "Metro Manila (NCR)",
        workSetup: "HYBRID" as const,
        employmentType: "FULL_TIME" as const,
        category: "BILINGUAL",
        seniority: "ASSOCIATE" as const,
        salaryMin: 65000,
        salaryMax: 85000,
        currency: "PHP",
        description: "Accenture is looking for Spanish Bilingual Customer Associates to support European and LatAm clients. You will manage inbound phone calls, emails, and translations for client issues. Highly competitive Spanish premium allowance.",
        requirements: [
          "Proficient in both Spanish and English (speaking, reading, writing)",
          "At least a high school graduate or college graduate",
          "BPO customer service experience is preferred but not required",
          "Willing to work on a night/flexible shifting schedule"
        ],
        tags: ["Spanish", "Bilingual", "BGC", "Premium Pay"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        quickApplySupported: true
      },
      {
        externalJobId: "kb-551029",
        externalUrl: "https://www.kalibrr.com/c/wipro/jobs/551029/technical-support-engineer",
        title: "Technical Support Engineer - L1/L2 Helpdesk",
        companyName: "Wipro Philippines",
        locationText: "Cebu IT Park, Cebu City",
        city: "Cebu City",
        region: "Central Visayas (Region 7)",
        workSetup: "ONSITE" as const,
        employmentType: "FULL_TIME" as const,
        category: "TECHNICAL_SUPPORT",
        seniority: "ASSOCIATE" as const,
        salaryMin: 22000,
        salaryMax: 30000,
        currency: "PHP",
        description: "Wipro Cebu is hiring Technical Support Engineers. In this role, you will diagnose hardware, network, and operating system errors for corporate users in Australia. Great technical training and certifications pathway.",
        requirements: [
          "Graduate of IT, Computer Science, or related engineering courses",
          "Familiar with Active Directory, Windows Server, and ITIL framework",
          "Excellent problem-solving skills and communication skills",
          "At least 1 year helpdesk or TSR experience is preferred"
        ],
        tags: ["Cebu IT Park", "TSR", "Wipro", "Active Directory"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        quickApplySupported: true
      }
    ];

    return listingsData.map(l => this.createNormalizedListing(l)).slice(0, limit);
  }
}
