"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Moon, Sun, Monitor, User, Shield } from "lucide-react";
import { LocationSelector } from "./LocationSelector";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";

export const TopBar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  const [searchVal, setSearchVal] = useState(searchParams.get("query") || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchVal.trim()) {
      params.set("query", searchVal);
    } else {
      params.delete("query");
    }
    params.delete("page");
    router.push(`/jobs?${params.toString()}`);
  };

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 border-b border-[var(--card-border)] bg-[var(--card)]/90 backdrop-blur-xs">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mr-4 relative">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-[var(--muted)] pointer-events-none" />
          <input
            type="text"
            placeholder="Search CSR, Chat support, Night shift..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-[var(--card-border)] bg-[var(--background)] text-sm focus:outline-none focus:border-[var(--accent)] text-[var(--foreground)]"
          />
        </div>
      </form>

      {/* Action items */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Prominent Location Selector */}
        <LocationSelector />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle color theme"
          className="p-2 rounded-md border border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)] text-[var(--foreground)] cursor-pointer"
        >
          {theme === "light" && <Sun className="h-4 w-4" />}
          {theme === "dark" && <Moon className="h-4 w-4" />}
          {theme === "system" && <Monitor className="h-4 w-4" />}
        </button>

        {/* Developer Admin Bypass Trigger */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50 text-amber-800 dark:text-amber-400">
          <Shield className="h-4 w-4" />
          <span className="text-xs font-semibold hidden md:inline">Dev Mode:</span>
          <select
            onChange={(e) => {
              // Simulated auth role toggle (by setting cookie or forcing redirect)
              if (e.target.value === "ADMIN") {
                router.push("/admin");
              } else {
                router.push("/jobs");
              }
            }}
            className="text-xs font-bold bg-transparent border-none outline-none cursor-pointer pr-1"
          >
            <option value="USER" className="bg-[var(--card)]">Seeker</option>
            <option value="ADMIN" className="bg-[var(--card)]">Admin</option>
          </select>
        </div>

        {/* User avatar mockup */}
        <div className="flex items-center gap-2 cursor-pointer p-1.5 rounded-md hover:bg-[var(--card-border)]/20">
          <div className="h-8 w-8 rounded-full bg-[var(--accent-light)] flex items-center justify-center border border-[var(--accent)]/10 text-[var(--accent)]">
            <User className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold hidden lg:inline-block">Juan Dela Cruz</span>
        </div>
      </div>
    </header>
  );
};
export default TopBar;
