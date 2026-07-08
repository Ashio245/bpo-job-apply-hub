import * as crypto from "crypto";

export function generateCanonicalHash(
  title: string,
  companyName: string,
  locationText: string
): string {
  const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
  const normCompany = companyName.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
  const normLocation = locationText.toLowerCase().replace(/[^a-z0-9]/g, "").trim();

  const combined = `${normTitle}|${normCompany}|${normLocation}`;
  return crypto.createHash("sha256").update(combined).digest("hex");
}

export function areListingsSimilar(
  titleA: string,
  companyA: string,
  titleB: string,
  companyB: string
): boolean {
  const tA = titleA.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
  const tB = titleB.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
  const cA = companyA.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
  const cB = companyB.toLowerCase().replace(/[^a-z0-9]/g, "").trim();

  // Exact company name, and very similar title (or vice versa)
  if (cA === cB) {
    // If one title contains the other and they share a common root
    if (tA.includes(tB) || tB.includes(tA)) {
      return true;
    }
    // Simple levenshtein distance or token match
    const tokensA = new Set(tA.split(""));
    const tokensB = new Set(tB.split(""));
    const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
    const jaccard = intersection.size / (tokensA.size + tokensB.size - intersection.size);
    if (jaccard > 0.8) return true;
  }

  return false;
}
