import { z } from "zod";

export const candidateProfileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Invalid phone number"),
  currentLocation: z.string().optional().nullable(),
  preferredLocations: z.array(z.string()).min(1, "Select at least one preferred location"),
  workSetupPreference: z.enum(["ONSITE", "HYBRID", "REMOTE", "ANY"]),
  targetRoles: z.array(z.string()).min(1, "Select at least one target role"),
  expectedSalary: z.number().nonnegative().optional().nullable(),
  noticePeriodDays: z.number().nonnegative().optional().nullable(),
  shiftPreference: z.enum(["DAY", "NIGHT", "FLEXIBLE", "ANY"]),
  experienceSummary: z.string().optional().nullable(),
  totalBpoExperienceYrs: z.number().nonnegative().default(0),
  skills: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  workHistoryJson: z.any().optional(),
  educationJson: z.any().optional(),
  savedAnswers: z.record(z.string(), z.string()).optional()
});

export const resumeUploadSchema = z.object({
  fileName: z.string(),
  fileSize: z.number().max(5 * 1024 * 1024, "File size must not exceed 5MB"),
  fileUrl: z.string().url("Invalid file URL"),
  isDefault: z.boolean().default(false)
});

export const jobFilterSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  region: z.string().optional(),
  workSetup: z.string().optional(),
  category: z.string().optional(),
  seniority: z.string().optional(),
  shift: z.string().optional(),
  minSalary: z.number().optional(),
  quickApply: z.boolean().optional(),
  source: z.string().optional(),
  sortBy: z.enum(["NEWEST", "BEST_MATCH", "LOCATION", "SALARY"]).default("NEWEST"),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(15)
});

export const jobApplicationSchema = z.object({
  jobListingId: z.string(),
  applyMethod: z.enum(["IN_APP", "ASSISTED", "EXTERNAL"]),
  status: z.string().default("SUBMITTED"),
  notes: z.string().optional(),
  validationSnapshot: z.any().optional(),
  sourceConfirmationRef: z.string().optional()
});
