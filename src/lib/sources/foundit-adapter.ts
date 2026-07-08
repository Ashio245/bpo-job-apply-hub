import { BaseJobSourceAdapter } from "./base-adapter";
import { NormalizedListingInput } from "./types";

export class FounditAdapter extends BaseJobSourceAdapter {
  sourceKey = "foundit";
  name = "foundit PH";
  applyMethod: "IN_APP" | "ASSISTED" | "EXTERNAL" = "EXTERNAL";
  complianceNotice = "foundit PH redirect applies. You will be directed to their portal to submit your CV and fill out application forms.";

  async fetchListings(limit = 5): Promise<NormalizedListingInput[]> {
    await this.sleep(150);

    const listingsData = [
      {
        externalJobId: "fi-772183",
        externalUrl: "https://www.foundit.com.ph/job/chat-support-agent-772183",
        title: "Chat Support Agent - E-Commerce Account",
        companyName: "TaskUs Philippines",
        locationText: "Imus, Cavite",
        city: "Santa Rosa", // map to nearby in constants
        region: "CALABARZON (Region 4A)",
        workSetup: "HYBRID" as const,
        employmentType: "FULL_TIME" as const,
        category: "CHAT_SUPPORT",
        seniority: "ENTRY_LEVEL" as const,
        salaryMin: 17000,
        salaryMax: 22000,
        currency: "PHP",
        description: "TaskUs is seeking Chat Support Agents for a global e-commerce client. You will handle multiple concurrent chat threads, helping users track packages, process refunds, and troubleshoot app accounts. Non-voice/pure written english.",
        requirements: [
          "High school graduate or college undergrad",
          "Exceptional written English communication skills (grammar and spelling)",
          "Minimum typing speed of 40 WPM with 95% accuracy",
          "Comfortable navigating multiple screens and systems under time constraints"
        ],
        tags: ["Non-Voice", "Chat Support", "E-Commerce", "Cavite"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        quickApplySupported: false
      },
      {
        externalJobId: "fi-881923",
        externalUrl: "https://www.foundit.com.ph/job/financial-account-specialist-881923",
        title: "Financial Account Specialist - Fraud Detection",
        companyName: "Accenture Philippines",
        locationText: "Mandaluyong, Metro Manila",
        city: "Mandaluyong",
        region: "Metro Manila (NCR)",
        workSetup: "ONSITE" as const,
        employmentType: "FULL_TIME" as const,
        category: "COLLECTIONS",
        seniority: "ASSOCIATE" as const,
        salaryMin: 25000,
        salaryMax: 32000,
        currency: "PHP",
        description: "Accenture BPO division is recruiting Financial Specialists to handle credit card disputes, fraud analysis, and customer payment collections. This role offers excellent performance-based bonuses, premium healthcare, and robust training.",
        requirements: [
          "At least a College Graduate (BS Business, Accountancy, or Finance is preferred)",
          "At least 1 year BPO experience handling credit cards, banking, or collections",
          "Detail-oriented with strong analytical and conversation negotiation skills",
          "Amenable to work graveyard shift in Mandaluyong (Robinsons Cybergate)"
        ],
        tags: ["Financial", "Fraud", "Mandaluyong", "Voice"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
        quickApplySupported: false
      }
    ];

    return listingsData.map(l => this.createNormalizedListing(l)).slice(0, limit);
  }
}
