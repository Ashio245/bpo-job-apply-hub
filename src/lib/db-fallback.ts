import { BPO_CATEGORIES, PHILIPPINE_CITIES } from "./constants";
import { generateCanonicalHash } from "./dedupe";

// This file implements an in-memory mock data layer for development
// when a PostgreSQL database is not running locally. It guarantees
// the application will run and display fully functional interactive pages.

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface MockCandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  preferredLocations: string[];
  workSetupPreference: "ONSITE" | "HYBRID" | "REMOTE" | "ANY";
  targetRoles: string[];
  expectedSalary: number;
  noticePeriodDays: number;
  shiftPreference: "DAY" | "NIGHT" | "FLEXIBLE" | "ANY";
  totalBpoExperienceYrs: number;
  experienceSummary: string;
  skills: string[];
  languages: string[];
  workHistoryJson: any[];
  educationJson: any[];
  savedAnswers: Record<string, string>;
  completionScore: number;
}

export interface MockResume {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  isDefault: boolean;
  parsedData: any;
  createdAt: Date;
}

export interface MockJobSource {
  id: string;
  name: string;
  key: string;
  isActive: boolean;
  logoUrl?: string;
  indexingAllowed: boolean;
  deepExtractAllowed: boolean;
  inAppApplyAllowed: boolean;
  assistedApplyAllowed: boolean;
  termsNotice?: string;
  rateLimitMs: number;
}

export interface MockJobListing {
  id: string;
  sourceId: string;
  sourceKey: string;
  sourceName: string;
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
  currency: string;
  description: string;
  descriptionSnippet?: string;
  requirements: string[];
  tags: string[];
  postedAt: Date;
  quickApplySupported: boolean;
  applyMethod: "IN_APP" | "ASSISTED" | "EXTERNAL";
  status: string;
  canonicalHash: string;
}

export interface MockJobApplication {
  id: string;
  userId: string;
  jobListingId: string;
  status: string;
  applyMethod: string;
  submittedAt: Date;
  externalRedirectedAt?: Date;
  notes?: string;
  validationSnapshot?: any;
  sourceConfirmationRef?: string;
}

export interface MockQueueItem {
  id: string;
  userId: string;
  jobListingId: string;
  status: string;
  blockReason?: string;
  createdAt: Date;
}

export interface MockSavedJob {
  id: string;
  userId: string;
  jobListingId: string;
  createdAt: Date;
}

export interface MockSourceRun {
  id: string;
  sourceId: string;
  sourceName: string;
  status: string;
  jobsIngested: number;
  jobsUpdated: number;
  jobsExpired: number;
  createdAt: Date;
}

// In-Memory Data Store (Persists during server lifecycle)
class InMemoryStore {
  users: MockUser[] = [
    { id: "user-1", name: "Juan Dela Cruz", email: "juan@example.com", role: "USER" },
    { id: "admin-1", name: "Admin Hub Manager", email: "admin@bpoapply.ph", role: "ADMIN" }
  ];

  profiles = new Map<string, MockCandidateProfile>([
    [
      "user-1",
      {
        id: "profile-1",
        userId: "user-1",
        fullName: "Juan Dela Cruz",
        email: "juan@example.com",
        phone: "09171234567",
        currentLocation: "Quezon City, Metro Manila",
        preferredLocations: ["Quezon City", "Pasig", "Taguig (BGC)"],
        workSetupPreference: "HYBRID",
        targetRoles: ["Customer Service Representative", "Chat Support Agent"],
        expectedSalary: 23000,
        noticePeriodDays: 30,
        shiftPreference: "NIGHT",
        totalBpoExperienceYrs: 1.5,
        experienceSummary: "Customer Service Representative with 1.5 years experience handling financial and billing accounts in the BPO sector. Proficient in handling chat and voice queues.",
        skills: ["Customer Service", "Active Listening", "Problem Solving", "Data Entry"],
        languages: ["English", "Tagalog"],
        completionScore: 85,
        workHistoryJson: [
          {
            company: "Concentrix Philippines",
            role: "Customer Service Representative",
            duration: "1.5 Years (2024 - 2025)",
            description: "Supported US telecom clients with billing and plan setups. Consistently exceeded CSAT and QA targets."
          }
        ],
        educationJson: [
          {
            school: "Polytechnic University of the Philippines",
            degree: "Associate in Computer Technology",
            year: "2023"
          }
        ],
        savedAnswers: {
          strengths: "My main strengths are patience, active listening, and technical troubleshooting. I handle irate customers well by showing empathy and providing quick solutions.",
          why_bpo: "I want to grow my career in the BPO sector because it rewards performance, provides great healthcare benefits, and allows me to practice communication daily."
        }
      }
    ]
  ]);

  resumes = new Map<string, MockResume[]>([
    [
      "user-1",
      [
        {
          id: "resume-1",
          userId: "user-1",
          fileName: "Juan_Dela_Cruz_Resume.pdf",
          fileSize: 102450,
          fileUrl: "/uploads/mock_resume.pdf",
          isDefault: true,
          parsedData: {
            fullName: "Juan Dela Cruz",
            email: "juan@example.com",
            phone: "09171234567"
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
        }
      ]
    ]
  ]);

  sources: MockJobSource[] = [
    {
      id: "src-jobstreet",
      name: "JobStreet PH",
      key: "jobstreet",
      isActive: true,
      indexingAllowed: true,
      deepExtractAllowed: false,
      inAppApplyAllowed: false,
      assistedApplyAllowed: false,
      termsNotice: "JobStreet PH does not permit direct in-app submission. You will be redirected safely to their official site to complete your application.",
      rateLimitMs: 1000
    },
    {
      id: "src-foundit",
      name: "foundit PH",
      key: "foundit",
      isActive: true,
      indexingAllowed: true,
      deepExtractAllowed: false,
      inAppApplyAllowed: false,
      assistedApplyAllowed: false,
      termsNotice: "foundit PH redirect applies. You will be directed to their portal to submit your CV and fill out application forms.",
      rateLimitMs: 1000
    },
    {
      id: "src-philjobnet",
      name: "PhilJobNet",
      key: "philjobnet",
      isActive: true,
      indexingAllowed: true,
      deepExtractAllowed: false,
      inAppApplyAllowed: false,
      assistedApplyAllowed: false,
      termsNotice: "PhilJobNet is a public employment portal. Application submissions require you to register/log in to your official PhilJobNet account.",
      rateLimitMs: 1000
    },
    {
      id: "src-kalibrr",
      name: "Kalibrr PH",
      key: "kalibrr",
      isActive: true,
      indexingAllowed: true,
      deepExtractAllowed: true,
      inAppApplyAllowed: false,
      assistedApplyAllowed: true,
      termsNotice: "Kalibrr ASSISTED APPLY matches your applicant profile directly. We will autofill your details and export a compliant profile data package for you to submit to their system.",
      rateLimitMs: 1000
    },
    {
      id: "src-bpodirect",
      name: "BPO Direct Partners",
      key: "bpodirect",
      isActive: true,
      indexingAllowed: true,
      deepExtractAllowed: true,
      inAppApplyAllowed: true,
      assistedApplyAllowed: false,
      termsNotice: "BPO Direct partner positions support IN-APP APPLY. Submitting your application sends your resume and profile directly to the employer's applicant tracking database.",
      rateLimitMs: 1000
    }
  ];

  listings: MockJobListing[] = [];
  applications: MockJobApplication[] = [];
  queueItems: MockQueueItem[] = [];
  savedJobs: MockSavedJob[] = [];
  runs: MockSourceRun[] = [];

  constructor() {
    this.initializeListings();
    this.initializeQueueAndApplications();
  }

  private initializeListings() {
    // Hardcode matching mock listings from our adapters
    const data = [
      {
        id: "job-js-1",
        sourceId: "src-jobstreet",
        sourceKey: "jobstreet",
        sourceName: "JobStreet PH",
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
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        quickApplySupported: false,
        applyMethod: "EXTERNAL" as const,
        status: "ACTIVE"
      },
      {
        id: "job-js-2",
        sourceId: "src-jobstreet",
        sourceKey: "jobstreet",
        sourceName: "JobStreet PH",
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
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        quickApplySupported: false,
        applyMethod: "EXTERNAL" as const,
        status: "ACTIVE"
      },
      {
        id: "job-fi-1",
        sourceId: "src-foundit",
        sourceKey: "foundit",
        sourceName: "foundit PH",
        externalJobId: "fi-772183",
        externalUrl: "https://www.foundit.com.ph/job/chat-support-agent-772183",
        title: "Chat Support Agent - E-Commerce Account",
        companyName: "TaskUs Philippines",
        locationText: "Imus, Cavite",
        city: "Pasig", // map to preferred locations of applicant
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
        quickApplySupported: false,
        applyMethod: "EXTERNAL" as const,
        status: "ACTIVE"
      },
      {
        id: "job-kb-1",
        sourceId: "src-kalibrr",
        sourceKey: "kalibrr",
        sourceName: "Kalibrr PH",
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
        quickApplySupported: true,
        applyMethod: "ASSISTED" as const,
        status: "ACTIVE"
      },
      {
        id: "job-bd-1",
        sourceId: "src-bpodirect",
        sourceKey: "bpodirect",
        sourceName: "BPO Direct Partners",
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
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        quickApplySupported: true,
        applyMethod: "IN_APP" as const,
        status: "ACTIVE"
      },
      {
        id: "job-bd-2",
        sourceId: "src-bpodirect",
        sourceKey: "bpodirect",
        sourceName: "BPO Direct Partners",
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
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
        quickApplySupported: true,
        applyMethod: "IN_APP" as const,
        status: "ACTIVE"
      }
    ];

    this.listings = data.map(l => ({
      ...l,
      canonicalHash: generateCanonicalHash(l.title, l.companyName, l.locationText)
    }));

    // Ingestion runs seed
    this.runs = this.sources.map((s, idx) => ({
      id: `run-${idx}`,
      sourceId: s.id,
      sourceName: s.name,
      status: "SUCCESS",
      jobsIngested: idx % 2 === 0 ? 3 : 2,
      jobsUpdated: 0,
      jobsExpired: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * (idx + 1))
    }));
  }

  private initializeQueueAndApplications() {
    // Saved jobs
    this.savedJobs = [
      { id: "sj-1", userId: "user-1", jobListingId: "job-js-1", createdAt: new Date() }
    ];

    // Queue Items
    this.queueItems = [
      { id: "qi-1", userId: "user-1", jobListingId: "job-kb-1", status: "PENDING", createdAt: new Date() },
      { id: "qi-2", userId: "user-1", jobListingId: "job-js-2", status: "PENDING", createdAt: new Date() }
    ];

    // Completed applications
    this.applications = [
      {
        id: "app-1",
        userId: "user-1",
        jobListingId: "job-bd-1",
        status: "SUBMITTED",
        applyMethod: "IN_APP",
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        notes: "Applied directly on the hub. Fits remote chat requirements.",
        sourceConfirmationRef: "DIRECT-CONF-CX-7781"
      }
    ];
  }
}

export const inMemoryDb = new InMemoryStore();
