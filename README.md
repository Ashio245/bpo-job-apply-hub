# BPO Job Apply Hub

A production-minded, compliance-first job discovery and workflow web application designed specifically for Philippine BPO job seekers. It aggregates job postings from multiple platforms, normalizes them, and assists seekers in applying safely.

## Core Features

1.  **Job Aggregation & Normalization**: Integrates job listings from multiple sources (JobStreet PH, foundit PH, PhilJobNet, Kalibrr, and direct BPO employers) into a unified type-safe `JobListing` database model.
2.  **Location-First Discovery**: Prominent city and regional selectors with defaults optimized for Metro Manila (Quezon City, BGC, Pasig, Makati, Pasay, Mandaluyong) and nearby BPO centers (Cebu, Clark, Davao).
3.  **Resume Parsing & Profile Manager**: Upload a PDF or Word resume and automatically parse name, contact details, target roles, experience duration, and core skills with manual override.
4.  **Relevance Match Scoring**: Instantly calculates a match percentage (0–100%) and categorizes the grade (Excellent, Good, Fair) by comparing applicant preferences against job descriptions, highlighting indicators and blockers.
5.  **Compliance-by-Design Workflow**: Discloses application methods honestly (In-App apply vs. Assisted apply vs. External apply) and avoids dark-pattern automated submissions. Includes a checklist validation screen.
6.  **Admin Operations Panel**: Logs source adapter health, tracks duplicate listings, and allows manual ingestion execution with deduplication hashing.

---

## Technology Stack

-   **Frontend**: Next.js App Router, React 19, TypeScript
-   **Styling**: Tailwind CSS v4, custom warm-stone neutral and deep teal variables
-   **Database**: Prisma ORM, PostgreSQL (Neon / Supabase)
-   **Authentication**: Auth.js v5 (NextAuth.js `@beta`)
-   **Resume Parsing**: PDF text extraction wrappers (`pdf-parse`)

---

## Architectural Highlights

### Multi-Source Adapter Pattern
All crawlers inherit from `BaseJobSourceAdapter` and implement:
- `fetchListings()`: Pulls job data from official APIs or mock feeds.
- `getApplyMethod()`: Declares whether the source supports direct `IN_APP` application, `ASSISTED` prefilling, or requires an `EXTERNAL` redirect page.
- `getComplianceNotice()`: Returns legally-binding disclaimers to disclose to the applicant.

### Lazy-Loading Database Fallback
To ensure immediate zero-setup execution out of the box, `src/lib/prisma.ts` utilizes a **lazy-loading Proxy**.
- If a local PostgreSQL database is not running, the database layer automatically catches the initialization timeout and routes requests through a mock, in-memory client `src/lib/db-fallback.ts`.
- This ensures the application compiles, builds, and runs perfectly on first launch without configuration.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in details if you want database integration (otherwise the mock fallback will auto-trigger):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/bpo_hub"
AUTH_SECRET="generate-with-npx-auth-secret"
```

### 3. Generate Database Client (Prisma 7)
Prisma 7 configuration connection string is set up inside `prisma.config.ts`. Run the generator:
```bash
npx prisma generate
```

### 4. Execute Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to browse and test.

---

## Compliance & Legal Disclaimer

BPO Job Apply Hub does not scrape third-party job boards in violation of their Terms of Service. For platforms like JobStreet and foundit, it provides external safe-redirect links accompanied by prefilled checklists. Assisted and direct apply channels are restricted strictly to partnered BPO firms and APIs where explicit permission has been obtained.
