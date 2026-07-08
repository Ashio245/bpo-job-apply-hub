import { CandidateProfile, JobListing } from "@prisma/client";

export interface MatchResult {
  score: number; // 0 to 100
  reasons: string[];
  blockers: string[];
  grade: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
}

export function calculateMatchScore(
  profile: CandidateProfile | null | undefined,
  job: JobListing
): MatchResult {
  if (!profile) {
    return {
      score: 0,
      reasons: ["Complete your profile to view match details."],
      blockers: [],
      grade: "POOR",
    };
  }

  let totalPoints = 0;
  let maxPoints = 100;
  const reasons: string[] = [];
  const blockers: string[] = [];

  // 1. Role Title Match (Weight: 30 points)
  let roleMatched = false;
  const jobTitleLower = job.title.toLowerCase();
  for (const role of profile.targetRoles) {
    const roleLower = role.toLowerCase();
    if (jobTitleLower.includes(roleLower) || roleLower.includes(jobTitleLower)) {
      roleMatched = true;
      break;
    }
  }
  if (roleMatched) {
    totalPoints += 30;
    reasons.push("Matches your target roles");
  } else {
    // Check categories or tags as partial match
    const categoryLower = job.category.toLowerCase().replace("_", " ");
    const hasCategoryMatch = profile.targetRoles.some(r => 
      r.toLowerCase().includes(categoryLower) || categoryLower.includes(r.toLowerCase())
    );
    if (hasCategoryMatch) {
      totalPoints += 15;
      reasons.push("Partial match with your preferred role categories");
    } else {
      reasons.push("Does not explicitly match your target roles");
    }
  }

  // 2. Location Match (Weight: 25 points)
  let locationMatched = false;
  if (job.city) {
    const jobCityLower = job.city.toLowerCase();
    locationMatched = profile.preferredLocations.some(
      loc => loc.toLowerCase().includes(jobCityLower) || jobCityLower.includes(loc.toLowerCase())
    );
  } else {
    const jobLocLower = job.locationText.toLowerCase();
    locationMatched = profile.preferredLocations.some(
      loc => jobLocLower.includes(loc.toLowerCase())
    );
  }

  if (locationMatched) {
    totalPoints += 25;
    reasons.push(`Matches preferred location: ${job.city || job.locationText}`);
  } else if (job.workSetup === "REMOTE") {
    totalPoints += 25;
    reasons.push("Work-from-home setup bypasses location constraints");
  } else {
    reasons.push(`Location ${job.city || job.locationText} is not in your preferred list`);
  }

  // 3. Work Setup Preference (Weight: 15 points)
  if (
    profile.workSetupPreference === "ANY" ||
    job.workSetup === profile.workSetupPreference ||
    (profile.workSetupPreference === "REMOTE" && job.workSetup === "REMOTE")
  ) {
    totalPoints += 15;
    reasons.push(`Matches work setup preference: ${job.workSetup}`);
  } else {
    reasons.push(`Preferred setup is ${profile.workSetupPreference}, this role is ${job.workSetup}`);
  }

  // 4. Experience Level (Weight: 15 points)
  // Derive job required experience from description/seniority if possible, otherwise compare
  let requiredYears = 0;
  if (job.seniority === "ASSOCIATE") requiredYears = 1.0;
  else if (job.seniority === "SENIOR") requiredYears = 3.0;
  else if (job.seniority === "LEAD") requiredYears = 5.0;

  if (profile.totalBpoExperienceYrs >= requiredYears) {
    totalPoints += 15;
    if (profile.totalBpoExperienceYrs > 0) {
      reasons.push(`Experience fit: You have ${profile.totalBpoExperienceYrs} yrs; role requires ~${requiredYears} yrs`);
    } else {
      reasons.push(`Fits entry-level requirements`);
    }
  } else {
    blockers.push(`Requires ~${requiredYears} years experience; you have ${profile.totalBpoExperienceYrs} years`);
  }

  // 5. Skills Match (Weight: 15 points)
  const jobDescLower = job.description.toLowerCase();
  const matchedSkills: string[] = [];
  
  profile.skills.forEach(skill => {
    if (jobDescLower.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    }
  });

  if (matchedSkills.length > 0) {
    const pointsPerSkill = Math.min(15, matchedSkills.length * 3);
    totalPoints += pointsPerSkill;
    reasons.push(`Matches skills: ${matchedSkills.slice(0, 3).join(", ")}`);
  }

  // 6. Expected Salary (Bonus/Adjustment - penalize if expected is way above max salary)
  if (profile.expectedSalary && job.salaryMax && profile.expectedSalary > job.salaryMax) {
    // If user expectation is higher than job max, deduct some points (max 10 deduction)
    const diffPercent = (profile.expectedSalary - job.salaryMax) / job.salaryMax;
    if (diffPercent > 0.1) {
      const deduction = Math.min(10, Math.round(diffPercent * 15));
      totalPoints = Math.max(0, totalPoints - deduction);
      blockers.push(`Expected salary (₱${profile.expectedSalary.toLocaleString()}) is higher than maximum salary (₱${job.salaryMax.toLocaleString()})`);
    }
  } else if (job.salaryMin && profile.expectedSalary && profile.expectedSalary <= job.salaryMin) {
    reasons.push(`Salary budget (₱${job.salaryMin.toLocaleString()} - ₱${job.salaryMax?.toLocaleString()}) meets your expectations`);
  }

  const finalScore = Math.min(100, Math.round(totalPoints));
  
  let grade: MatchResult["grade"] = "POOR";
  if (finalScore >= 80) grade = "EXCELLENT";
  else if (finalScore >= 60) grade = "GOOD";
  else if (finalScore >= 40) grade = "FAIR";

  return {
    score: finalScore,
    reasons,
    blockers,
    grade,
  };
}
