"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Bookmark,
  Layers,
  FileText,
  User,
  Settings,
  Shield,
  HelpCircle,
  Activity
} from "lucide-react";

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Find Jobs", icon: Briefcase, path: "/jobs" },
    { name: "Saved Jobs", icon: Bookmark, path: "/saved" },
    { name: "Apply Queue", icon: Layers, path: "/apply/queue", highlight: true },
    { name: "My Applications", icon: Activity, path: "/applications" },
    { name: "Applicant Profile", icon: User, path: "/profile" },
    { name: "Settings", icon: Settings, path: "/settings" }
  ];

  const adminItems = [
    { name: "Admin Dashboard", icon: Shield, path: "/admin" },
    { name: "Source Adapters", icon: FileText, path: "/admin/sources" },
    { name: "Moderation", icon: Briefcase, path: "/admin/jobs" }
  ];

  const isLinkActive = (path: string) => {
    if (path === "/jobs") {
      return pathname === "/jobs" || pathname.startsWith("/jobs/");
    }
    return pathname === path || pathname.startsWith(path);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)] flex-shrink-0 h-screen sticky top-0">
      {/* Brand Logo header */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-[var(--card-border)]">
        <div className="h-7 w-7 rounded bg-[var(--accent)] flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
          B
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-bold tracking-tight">BPO Job Apply Hub</span>
          <span className="text-[10px] text-[var(--muted)] font-medium">Philippine Seekers</span>
        </div>
      </div>

      {/* Navigation menu list */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
        <div>
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider px-3 block mb-2">
            Discover & Apply
          </span>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const active = isLinkActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium btn-transition ${
                    active
                      ? "bg-[var(--accent-light)] text-[var(--accent)] font-semibold"
                      : "hover:bg-[var(--card-border)]/20 text-[var(--foreground)]"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${active ? "text-[var(--accent)]" : "text-[var(--muted)]"}`} />
                  <span>{item.name}</span>
                  {item.highlight && item.name === "Apply Queue" && (
                    <span className="ml-auto bg-[var(--accent)] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      2
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Administration Section */}
        <div>
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider px-3 block mb-2">
            Administration
          </span>
          <nav className="space-y-1">
            {adminItems.map((item) => {
              const active = isLinkActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium btn-transition ${
                    active
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                      : "hover:bg-[var(--card-border)]/20 text-[var(--foreground)]"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${active ? "text-amber-500" : "text-[var(--muted)]"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[var(--card-border)] text-[11px] text-[var(--muted)] flex flex-col gap-1">
        <div className="flex items-center gap-1.5 hover:text-[var(--foreground)] cursor-pointer">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Support & Compliance FAQ</span>
        </div>
        <div className="mt-1">
          <span>v0.1.0 • Stable Release</span>
        </div>
      </div>
    </aside>
  );
};
export default AppSidebar;
