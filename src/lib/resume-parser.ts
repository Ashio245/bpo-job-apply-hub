import { BPO_CATEGORIES, PHILIPPINE_CITIES } from "./constants";

export interface ParsedResumeData {
  fullName: string;
  email: string;
  phone: string;
  currentLocation?: string;
  preferredLocations: string[];
  workSetupPreference: "ONSITE" | "HYBRID" | "REMOTE" | "ANY";
  targetRoles: string[];
  totalBpoExperienceYrs: number;
  skills: string[];
  languages: string[];
  experienceSummary?: string;
  workHistoryJson?: any[];
  educationJson?: any[];
}

export async function parseResumeFile(
  buffer: Buffer,
  fileName: string
): Promise<ParsedResumeData> {
  let text = "";

  // 1. Attempt PDF extraction
  if (fileName.toLowerCase().endsWith(".pdf")) {
    try {
      // Dynamic import to avoid Turbopack ESM issues with pdf-parse
      // @ts-ignore - pdf-parse ESM types are incompatible
      const pdfModule = await import("pdf-parse");
      const pdfParse = (pdfModule as any).default || pdfModule;
      const data = await pdfParse(buffer);
      text = data.text || "";
    } catch (err) {
      console.error("PDF parsing failed, using raw buffer text:", err);
      text = buffer.toString("utf8");
    }
  } else {
    text = buffer.toString("utf8");
  }

  // 2. If text is empty, return empty result — no fake data
  if (!text.trim()) {
    return {
      fullName: "",
      email: "",
      phone: "",
      preferredLocations: [],
      workSetupPreference: "ANY",
      targetRoles: [],
      totalBpoExperienceYrs: 0,
      skills: [],
      languages: [],
      experienceSummary: "Could not extract text from this file. Please fill in your details manually."
    };
  }

  // 3. Extract Email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : "";

  // 4. Extract Phone
  const phoneRegex = /(09|\+63\s?9)\d{2}[-\s]?\d{3}[-\s]?\d{4}|\b\d{7}\b/g;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0].replace(/[-\s]/g, "") : "";

  // 5. Extract Name (Heuristic: usually first non-empty line that looks like a name)
  let fullName = "";
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length < 50 && !firstLine.includes("@") && !/\d/.test(firstLine)) {
      fullName = firstLine;
    }
  }
  if (!fullName) {
    // Try second line
    if (lines.length > 1) {
      const secondLine = lines[1];
      if (secondLine.length < 50 && !secondLine.includes("@") && !/\d/.test(secondLine)) {
        fullName = secondLine;
      }
    }
  }
  if (!fullName) {
    // Derive from filename e.g. "Juan_Dela_Cruz_Resume.pdf"
    const cleanName = fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .replace(/resume|cv|curriculum|vitae/gi, "")
      .trim();
    fullName = cleanName || "";
  }

  // 6. Extract Locations (Match against Philippine cities)
  const preferredLocations: string[] = [];
  const textLower = text.toLowerCase();
  for (const city of PHILIPPINE_CITIES) {
    if (textLower.includes(city.name.toLowerCase())) {
      preferredLocations.push(city.name);
    }
  }

  // 7. Extract Target Roles
  const targetRoles: string[] = [];
  const rolesKeywords = [
    { name: "Customer Service Representative", keywords: ["csr", "customer service", "call center", "customer support"] },
    { name: "Technical Support Representative", keywords: ["tsr", "technical support", "tech support", "it support", "helpdesk"] },
    { name: "Chat Support Agent", keywords: ["chat support", "email support", "non voice", "non-voice"] },
    { name: "Back Office Associate", keywords: ["back office", "data entry", "administrative", "back-office"] },
    { name: "Content Moderator", keywords: ["moderator", "content moderation", "moderation"] },
    { name: "Healthcare Specialist", keywords: ["healthcare", "nurse", "medical account", "billing"] }
  ];

  for (const item of rolesKeywords) {
    const matched = item.keywords.some(kw => textLower.includes(kw));
    if (matched) {
      targetRoles.push(item.name);
    }
  }

  // 8. Extract total BPO experience
  let totalBpoExperienceYrs = 0;
  const expMatches = textLower.match(/(\d+(\.\d+)?)\s*(year|yr)s?\s*(of)?\s*(bpo|experience|work|call center)/g);
  if (expMatches && expMatches.length > 0) {
    const numMatch = expMatches[0].match(/\d+(\.\d+)?/);
    if (numMatch) {
      totalBpoExperienceYrs = parseFloat(numMatch[0]);
    }
  } else {
    const genericMatches = textLower.match(/(\d+)\s*(year|yr)s?\s*experience/g);
    if (genericMatches && genericMatches.length > 0) {
      const numMatch = genericMatches[0].match(/\d+/);
      if (numMatch) {
        totalBpoExperienceYrs = parseInt(numMatch[0], 10);
      }
    }
  }

  // 9. Extract Skills (Common BPO Skills)
  const commonBpoSkills = [
    "Customer Service", "Technical Troubleshooting", "Communication Skills",
    "Active Listening", "Problem Solving", "Multi-tasking", "Data Entry",
    "Conflict Resolution", "MS Office", "CRM Tools", "Telephony Systems",
    "Inbound Calls", "Outbound Sales", "Quality Assurance", "Teamwork"
  ];
  const skills: string[] = [];
  for (const skill of commonBpoSkills) {
    if (textLower.includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  }

  // 10. Extract Languages
  const languagesList = ["English", "Tagalog", "Spanish", "French", "Mandarin", "Japanese", "Korean"];
  const languages: string[] = [];
  for (const lang of languagesList) {
    if (textLower.includes(lang.toLowerCase())) {
      languages.push(lang);
    }
  }

  // 11. Work Setup Preference (Heuristic check)
  let workSetupPreference: ParsedResumeData["workSetupPreference"] = "ANY";
  if (textLower.includes("work from home") || textLower.includes("wfh") || textLower.includes("remote")) {
    workSetupPreference = "REMOTE";
  } else if (textLower.includes("hybrid")) {
    workSetupPreference = "HYBRID";
  } else if (textLower.includes("onsite") || textLower.includes("office-based")) {
    workSetupPreference = "ONSITE";
  }

  return {
    fullName,
    email,
    phone,
    preferredLocations,
    workSetupPreference,
    targetRoles,
    totalBpoExperienceYrs,
    skills,
    languages,
    experienceSummary: text.substring(0, 500) + (text.length > 500 ? "..." : "")
  };
}
