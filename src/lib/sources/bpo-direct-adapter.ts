import { BaseJobSourceAdapter } from "./base-adapter";
import { NormalizedListingInput } from "./types";

export class BpoDirectAdapter extends BaseJobSourceAdapter {
  sourceKey = "bpodirect";
  name = "BPO Direct Partners";
  applyMethod: "IN_APP" | "ASSISTED" | "EXTERNAL" = "IN_APP";
  complianceNotice = "BPO Direct partner positions support IN-APP APPLY. Submitting your application sends your resume and profile directly to the employer's applicant tracking database.";

  async fetchListings(limit = 5): Promise<NormalizedListingInput[]> {
    await this.sleep(120);

    const listingsData = [
      {
        externalJobId: "bd-1002",
        externalUrl: "https://bpoapply.ph/direct/jobs/concentrix-chat-support",
        title: "Pure Chat Support Representative (No Call)",
        companyName: "Concentrix Philippines",
        locationText: "Pasig City, Metro Manila",
        city: "Pasig",
        region: "Metro Manila (NCR)",
        workSetup: "REMOTE" as const,
        employmentType: "FULL_TIME" as const,
        category: "CHAT_SUPPORT",
        seniority: "ENTRY_LEVEL" as const,
        salaryMin: 20000,
        salaryMax: 25000,
        currency: "PHP",
        description: "Apply directly for a pure chat support role. You will manage text-based customer inquiries for a global logistics provider. Work-from-home setup is fully supported. Equipment (PC, headset, and secure router) will be provided by Concentrix upon hiring.",
        requirements: [
          "Minimum 1 year BPO experience (voice or non-voice)",
          "Excellent written English communication skills",
          "Fiber internet connection at home (minimum 25 Mbps download/upload)",
          "Amenable to working on rotating night shifts"
        ],
        tags: ["WFH", "Non-Voice", "Chat Support", "Equipment Provided"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        quickApplySupported: true
      },
      {
        externalJobId: "bd-1005",
        externalUrl: "https://bpoapply.ph/direct/jobs/teleperformance-healthcare",
        title: "Healthcare Account - US Registered Nurse (PHRN)",
        companyName: "Teleperformance Philippines",
        locationText: "Makati City, Metro Manila",
        city: "Makati",
        region: "Metro Manila (NCR)",
        workSetup: "HYBRID" as const,
        employmentType: "FULL_TIME" as const,
        category: "HEALTHCARE",
        seniority: "SENIOR" as const,
        salaryMin: 45000,
        salaryMax: 60000,
        currency: "PHP",
        description: "Direct hire for Philippine Registered Nurses (PHRN) to handle clinical trials verification and medical billing approvals for a US healthcare consortium. Hybrid role based in Makati.",
        requirements: [
          "Active Philippine Nurse License (PHRN) without active restrictions",
          "At least 1 year clinical hospital experience or 1 year healthcare BPO experience",
          "Excellent communications skills and empathy",
          "Willing to work night shifts (US Eastern Time)"
        ],
        tags: ["PHRN", "Nurse License", "Hybrid", "High Salary"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
        quickApplySupported: true
      },
      {
        externalJobId: "bd-1010",
        externalUrl: "https://bpoapply.ph/direct/jobs/clark-customer-associate",
        title: "Customer Associate - Fresh Grads Welcome",
        companyName: "TaskUs Philippines",
        locationText: "Clark Freeport Zone, Pampanga",
        city: "Clark (Angeles)",
        region: "Central Luzon (Region 3)",
        workSetup: "ONSITE" as const,
        employmentType: "FULL_TIME" as const,
        category: "CUSTOMER_SERVICE",
        seniority: "ENTRY_LEVEL" as const,
        salaryMin: 16000,
        salaryMax: 20000,
        currency: "PHP",
        description: "TaskUs Clark is hiring customer associates for an entertainment account (streaming service support). No BPO experience required! We offer a fun, creative office environment with gym access, free food, and extensive training.",
        requirements: [
          "Open to fresh high school graduates or college graduates",
          "Good conversational English skills",
          "Customer-first attitude and interest in pop culture/entertainment",
          "Amenable to onsite work at Clark Freeport Zone"
        ],
        tags: ["TaskUs Clark", "No Experience", "Free Food", "Gym Access"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        quickApplySupported: true
      }
    ];

    return listingsData.map(l => this.createNormalizedListing(l)).slice(0, limit);
  }
}
