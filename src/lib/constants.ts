// Constants for BPO Job Apply Hub

export const PHILIPPINE_REGIONS = [
  "Metro Manila (NCR)",
  "Central Luzon (Region 3)",
  "CALABARZON (Region 4A)",
  "Central Visayas (Region 7)",
  "Western Visayas (Region 6)",
  "Davao Region (Region 11)",
  "Cordillera Administrative Region (CAR)",
  "Northern Mindanao (Region 10)"
];

export const PHILIPPINE_CITIES = [
  // Metro Manila
  { name: "Quezon City", region: "Metro Manila (NCR)" },
  { name: "Makati", region: "Metro Manila (NCR)" },
  { name: "Taguig (BGC)", region: "Metro Manila (NCR)" },
  { name: "Pasig", region: "Metro Manila (NCR)" },
  { name: "Mandaluyong", region: "Metro Manila (NCR)" },
  { name: "Pasay", region: "Metro Manila (NCR)" },
  { name: "Muntinlupa (Alabang)", region: "Metro Manila (NCR)" },
  { name: "Manila", region: "Metro Manila (NCR)" },
  { name: "Parañaque", region: "Metro Manila (NCR)" },
  { name: "Las Piñas", region: "Metro Manila (NCR)" },
  { name: "Marikina", region: "Metro Manila (NCR)" },
  { name: "Caloocan", region: "Metro Manila (NCR)" },
  // Luzon Outside NCR
  { name: "Clark (Angeles)", region: "Central Luzon (Region 3)" },
  { name: "San Fernando", region: "Central Luzon (Region 3)" },
  { name: "Baguio", region: "Cordillera Administrative Region (CAR)" },
  { name: "Santa Rosa", region: "CALABARZON (Region 4A)" },
  { name: "Antipolo", region: "CALABARZON (Region 4A)" },
  // Visayas
  { name: "Cebu City", region: "Central Visayas (Region 7)" },
  { name: "Mandaue", region: "Central Visayas (Region 7)" },
  { name: "Lapu-Lapu", region: "Central Visayas (Region 7)" },
  { name: "Iloilo City", region: "Western Visayas (Region 6)" },
  { name: "Bacolod", region: "Western Visayas (Region 6)" },
  { name: "Dumaguete", region: "Central Visayas (Region 7)" },
  // Mindanao
  { name: "Davao City", region: "Davao Region (Region 11)" },
  { name: "Cagayan de Oro", region: "Northern Mindanao (Region 10)" }
];

export const BPO_CATEGORIES = [
  { value: "CUSTOMER_SERVICE", label: "Customer Service / CSR" },
  { value: "TECHNICAL_SUPPORT", label: "Technical Support / TSR" },
  { value: "CHAT_SUPPORT", label: "Chat & Email Support" },
  { value: "BACK_OFFICE", label: "Back Office & Data Entry" },
  { value: "COLLECTIONS", label: "Collections Account" },
  { value: "HEALTHCARE", label: "Healthcare Account" },
  { value: "CONTENT_MODERATION", label: "Content Moderation" },
  { value: "BILINGUAL", label: "Bilingual / Multilingual" },
  { value: "SALES_RETENTION", label: "Sales & Retention" },
  { value: "LEADERSHIP", label: "Team Leader & Management" },
  { value: "QUALITY_ASSURANCE", label: "QA & Training" }
];

export const WORK_SETUPS = [
  { value: "ONSITE", label: "On-site" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "REMOTE", label: "Work from Home / Remote" }
];

export const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full-Time" },
  { value: "PART_TIME", label: "Part-Time" },
  { value: "CONTRACT", label: "Contract / Project" }
];

export const SHIFT_PREF_OPTIONS = [
  { value: "DAY", label: "Day Shift" },
  { value: "NIGHT", label: "Night / Graveyard Shift" },
  { value: "FLEXIBLE", label: "Rotating / Flexible Shift" },
  { value: "ANY", label: "No Preference / Any" }
];

export const SENIORITY_LEVELS = [
  { value: "ENTRY_LEVEL", label: "Entry Level (Fresh Grad)" },
  { value: "ASSOCIATE", label: "Junior / Associate (1-2 yrs)" },
  { value: "SENIOR", label: "Senior Associate (3-5 yrs)" },
  { value: "LEAD", label: "Lead / Supervisor (5+ yrs)" }
];

export const APPLICATION_STATUSES = [
  { value: "READY", label: "Ready to Apply", color: "text-stone-600 bg-stone-100 border-stone-200" },
  { value: "SUBMITTED", label: "Submitted", color: "text-teal-700 bg-teal-50 border-teal-200" },
  { value: "EXTERNAL_ACTION_NEEDED", label: "Action Needed (External)", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { value: "INTERVIEW", label: "Interview Scheduled", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { value: "REJECTED", label: "Rejected / Closed", color: "text-rose-700 bg-rose-50 border-rose-200" },
  { value: "OFFER", label: "Job Offer Received", color: "text-emerald-700 bg-emerald-50 border-emerald-200" }
];

export const APPLY_METHODS = [
  { value: "IN_APP", label: "In-App Apply", description: "Direct submit from hub" },
  { value: "ASSISTED", label: "Assisted Apply", description: "Autofilled resume and details" },
  { value: "EXTERNAL", label: "External Apply", description: "Apply on external site" }
];
