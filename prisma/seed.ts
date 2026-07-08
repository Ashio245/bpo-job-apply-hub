import { PrismaClient } from "@prisma/client";
import { registry } from "../src/lib/sources/registry";
import { generateCanonicalHash } from "../src/lib/dedupe";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clean existing records
  await prisma.auditLog.deleteMany({});
  await prisma.parserError.deleteMany({});
  await prisma.sourceIngestionRun.deleteMany({});
  await prisma.jobListingRawSnapshot.deleteMany({});
  await prisma.jobApplication.deleteMany({});
  await prisma.savedJob.deleteMany({});
  await prisma.applicationQueueItem.deleteMany({});
  await prisma.jobListing.deleteMany({});
  await prisma.dedupeCluster.deleteMany({});
  await prisma.jobSource.deleteMany({});
  await prisma.userPreference.deleteMany({});
  await prisma.candidateProfile.deleteMany({});
  await prisma.resume.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Cleared old database records.");

  // 2. Create Users
  // Standard Job Seeker
  const user = await prisma.user.create({
    data: {
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      password: "password123", // mocked bcrypt equivalent for credentials
      role: "USER",
    },
  });

  // Admin User
  const admin = await prisma.user.create({
    data: {
      name: "Admin Hub Manager",
      email: "admin@bpoapply.ph",
      password: "adminpassword",
      role: "ADMIN",
    },
  });

  console.log("Created users:", { user: user.email, admin: admin.email });

  // 3. Create User Profile
  const profile = await prisma.candidateProfile.create({
    data: {
      userId: user.id,
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
  });

  await prisma.userPreference.create({
    data: {
      userId: user.id,
      emailNotifications: true,
      weeklyDigest: true,
      profileVisibleToBpos: true
    }
  });

  // Create standard user Resume upload
  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      fileName: "Juan_Dela_Cruz_Resume.pdf",
      fileSize: 102450,
      fileUrl: "/uploads/mock_resume.pdf",
      isDefault: true,
      parsedData: {
        fullName: "Juan Dela Cruz",
        email: "juan@example.com",
        phone: "09171234567"
      }
    }
  });

  console.log("Created applicant candidate profile & default resume");

  // 4. Create Job Sources and seed listings
  const adapters = registry.getAllAdapters();
  for (const adapter of adapters) {
    const source = await prisma.jobSource.create({
      data: {
        name: adapter.name,
        key: adapter.sourceKey,
        isActive: true,
        indexingAllowed: true,
        deepExtractAllowed: adapter.sourceKey === "bpodirect" || adapter.sourceKey === "kalibrr",
        inAppApplyAllowed: adapter.getApplyMethod() === "IN_APP",
        assistedApplyAllowed: adapter.getApplyMethod() === "ASSISTED",
        termsNotice: adapter.getComplianceNotice(),
        rateLimitMs: 1000
      }
    });

    console.log(`Created JobSource: ${source.name} [${source.key}]`);

    // Ingest listings
    const mockListings = await adapter.fetchListings();
    
    // Log an ingestion run
    const run = await prisma.sourceIngestionRun.create({
      data: {
        sourceId: source.id,
        status: "SUCCESS",
        jobsIngested: mockListings.length,
        jobsUpdated: 0,
        jobsExpired: 0
      }
    });

    for (const listingInput of mockListings) {
      const canonicalHash = generateCanonicalHash(
        listingInput.title,
        listingInput.companyName,
        listingInput.locationText
      );

      const listing = await prisma.jobListing.create({
        data: {
          sourceId: source.id,
          externalJobId: listingInput.externalJobId,
          externalUrl: listingInput.externalUrl,
          title: listingInput.title,
          companyName: listingInput.companyName,
          locationText: listingInput.locationText,
          city: listingInput.city,
          region: listingInput.region,
          workSetup: listingInput.workSetup,
          employmentType: listingInput.employmentType,
          category: listingInput.category,
          seniority: listingInput.seniority,
          salaryMin: listingInput.salaryMin,
          salaryMax: listingInput.salaryMax,
          currency: listingInput.currency || "PHP",
          description: listingInput.description,
          descriptionSnippet: listingInput.descriptionSnippet,
          requirements: listingInput.requirements,
          tags: listingInput.tags,
          postedAt: listingInput.postedAt,
          quickApplySupported: listingInput.quickApplySupported,
          applyMethod: listingInput.applyMethod,
          status: "ACTIVE",
          canonicalHash
        }
      });

      // Write raw snapshot for audit
      await prisma.jobListingRawSnapshot.create({
        data: {
          jobListingId: listing.id,
          rawJson: JSON.stringify(listingInput)
        }
      });
    }

    console.log(`Ingested ${mockListings.length} listings from ${source.name}`);
  }

  // 5. Create some sample saved jobs & queue items for the demo user
  const listings = await prisma.jobListing.findMany();
  
  if (listings.length >= 3) {
    // Save first job
    await prisma.savedJob.create({
      data: {
        userId: user.id,
        jobListingId: listings[0].id
      }
    });

    // Add second job to application queue
    await prisma.applicationQueueItem.create({
      data: {
        userId: user.id,
        jobListingId: listings[1].id,
        status: "PENDING"
      }
    });

    // Add third job to application queue
    await prisma.applicationQueueItem.create({
      data: {
        userId: user.id,
        jobListingId: listings[2].id,
        status: "PENDING"
      }
    });

    // Create a finished job application (submitted)
    const inAppJob = listings.find(l => l.applyMethod === "IN_APP");
    if (inAppJob) {
      await prisma.jobApplication.create({
        data: {
          userId: user.id,
          jobListingId: inAppJob.id,
          status: "SUBMITTED",
          applyMethod: "IN_APP",
          submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          notes: "Applied via BPO Job Apply Hub directly. Fits remote requirements perfectly.",
          sourceConfirmationRef: "APP-CONF-CONCENTRIX-9981"
        }
      });
    }

    // Create a finished job application (external redirect)
    const externalJob = listings.find(l => l.applyMethod === "EXTERNAL");
    if (externalJob) {
      await prisma.jobApplication.create({
        data: {
          userId: user.id,
          jobListingId: externalJob.id,
          status: "EXTERNAL_ACTION_NEEDED",
          applyMethod: "EXTERNAL",
          submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
          externalRedirectedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          notes: "Redirected to JobStreet to finish applying."
        }
      });
    }
  }

  // 6. Write Audit logs
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "USER_SIGNUP",
      details: "User Juan Dela Cruz registered and uploaded default resume.",
      ipAddress: "127.0.0.1"
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "ADMIN_SEED",
      details: "Admin initialized BPO sources and synced active job listings.",
      ipAddress: "127.0.0.1"
    }
  });

  console.log("Seeding complete! Admin and User accounts are ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
