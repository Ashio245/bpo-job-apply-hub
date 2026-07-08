import { BaseJobSourceAdapter } from "./base-adapter";
import { NormalizedListingInput } from "./types";

export class JobStreetAdapter extends BaseJobSourceAdapter {
  sourceKey = "jobstreet";
  name = "JobStreet PH";
  applyMethod: "IN_APP" | "ASSISTED" | "EXTERNAL" = "EXTERNAL";
  complianceNotice = "JobStreet PH does not permit direct in-app submission. You will be redirected safely to their official site to complete your application.";

  async fetchListings(limit = 5): Promise<NormalizedListingInput[]> {
    // Simulate API fetch delay
    await this.sleep(200);

    const listingsData = [
      {
        externalJobId: "js-982103",
        externalUrl: "https://www.jobstreet.com.ph/en/job/customer-service-representative-982103",
        title: "Customer Service Representative - Telco Account",
        companyName: "Concentrix Philippines",
        locationText: "Quezon City, Metro Manila",
        city: "Quezon City",
        region: "Metro Manila (NCR)",
        workSetup: "ONSITE" as const,
        employmentType: "FULL_TIME" as const,
        category: "CUSTOMER_SERVICE",
        seniority: "ENTRY_LEVEL" as const,
        salaryMin: 18000,
        salaryMax: 24000,
        currency: "PHP",
        description: "Join Concentrix as a Customer Service Representative for our premium Telco Account. You will handle inbound calls regarding service inquiries, billing resolutions, and basic troubleshooting. We offer competitive pay, night differentials, HMO coverage from day 1, and realistic career path growth.",
        requirements: [
          "At least a high school graduate (old curriculum) or senior high school graduate",
          "Excellent verbal and written English communication skills",
          "Basic computer navigation and keyboarding skills",
          "Willing to work on a night/shifting schedule in Quezon City"
        ],
        tags: ["Telco", "Voice", "Quezon City", "HMO Day 1"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        quickApplySupported: false
      },
      {
        externalJobId: "js-827391",
        externalUrl: "https://www.jobstreet.com.ph/en/job/technical-support-associate-827391",
        title: "Technical Support Associate - Internet Service Provider",
        companyName: "Teleperformance Philippines",
        locationText: "Pasig City, Metro Manila",
        city: "Pasig",
        region: "Metro Manila (NCR)",
        workSetup: "HYBRID" as const,
        employmentType: "FULL_TIME" as const,
        category: "TECHNICAL_SUPPORT",
        seniority: "ASSOCIATE" as const,
        salaryMin: 22000,
        salaryMax: 29000,
        currency: "PHP",
        description: "Teleperformance is looking for Technical Support Associates to manage internet connectivity issues, router configurations, and billing for a US-based telecom. Hybrid arrangement is available after completing 3 months of successful onsite nesting.",
        requirements: [
          "Finished at least 2 years in college (no back subjects)",
          "At least 6 months BPO technical support experience is required",
          "Familiarity with DNS, routers, IPs, and basic network setup",
          "Strong communication and customer resolution skills"
        ],
        tags: ["TSR", "Internet Account", "Hybrid", "Pasig"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        quickApplySupported: false
      },
      {
        externalJobId: "js-391823",
        externalUrl: "https://www.jobstreet.com.ph/en/job/healthcare-account-csr-391823",
        title: "Healthcare Account CSR - Medical Billing",
        companyName: "Alorica Philippines",
        locationText: "Makati City, Metro Manila",
        city: "Makati",
        region: "Metro Manila (NCR)",
        workSetup: "ONSITE" as const,
        employmentType: "FULL_TIME" as const,
        category: "HEALTHCARE",
        seniority: "ENTRY_LEVEL" as const,
        salaryMin: 20000,
        salaryMax: 26000,
        currency: "PHP",
        description: "Help US patients navigate their medical insurance coverage. As a Healthcare CSR, you will verify benefits, check prior authorization status, and guide patients through prescription billing questions. Great incentives, professional environment.",
        requirements: [
          "College graduate (BS Nursing, Pharmacy, or Allied Health is a major plus but not required)",
          "Undergraduates with 1 year medical BPO experience are welcome to apply",
          "Excellent listening and documentation skills",
          "Empathy and strong phone presentation skills"
        ],
        tags: ["Healthcare", "Makati", "Medical Billing", "Voice"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
        quickApplySupported: false
      }
    ];

    return listingsData.map(l => this.createNormalizedListing(l)).slice(0, limit);
  }
}
