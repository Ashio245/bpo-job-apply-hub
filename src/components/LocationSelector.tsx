"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MapPin } from "lucide-react";
import { PHILIPPINE_CITIES } from "@/lib/constants";

export const LocationSelector: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentLoc = searchParams.get("location") || "All Locations";

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const loc = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (loc === "All") {
      params.delete("location");
    } else {
      params.set("location", loc);
    }
    
    // Reset page on filter change
    params.delete("page");
    
    // Always navigate to jobs page when shifting location
    router.push(`/jobs?${params.toString()}`);
  };

  const cities = ["All", ...PHILIPPINE_CITIES.map(c => c.name)];

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)] text-[var(--foreground)] btn-transition">
      <MapPin className="h-4 w-4 text-[var(--accent)] flex-shrink-0" />
      <span className="text-xs font-medium hidden md:inline">City:</span>
      <select
        value={currentLoc === "All Locations" ? "All" : currentLoc}
        onChange={handleLocationChange}
        className="text-xs font-semibold bg-transparent border-none outline-none cursor-pointer pr-1"
      >
        {cities.map((city) => (
          <option key={city} value={city} className="bg-[var(--card)] text-[var(--foreground)]">
            {city === "All" ? "All Cities" : city}
          </option>
        ))}
      </select>
    </div>
  );
};
export default LocationSelector;
