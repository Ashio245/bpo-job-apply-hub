"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Bookmark, Layers, Activity, User } from "lucide-react";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Jobs", icon: Briefcase, path: "/jobs" },
    { name: "Saved", icon: Bookmark, path: "/saved" },
    { name: "Queue", icon: Layers, path: "/apply/queue", count: 2 },
    { name: "Applied", icon: Activity, path: "/applications" },
    { name: "Profile", icon: User, path: "/profile" }
  ];

  const isLinkActive = (path: string) => {
    if (path === "/jobs") {
      return pathname === "/jobs" || pathname.startsWith("/jobs/");
    }
    return pathname === path || pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--card-border)] bg-[var(--card)]/95 backdrop-blur-md h-16 flex items-center justify-around px-2 shadow-lg">
      {navItems.map((item) => {
        const active = isLinkActive(item.path);
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.path}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center relative btn-transition ${
              active ? "text-[var(--accent)] font-semibold" : "text-[var(--muted)]"
            }`}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {item.count && (
                <span className="absolute -top-1 -right-2 bg-[var(--accent)] text-white text-[8px] h-3.5 w-3.5 rounded-full flex items-center justify-center font-bold">
                  {item.count}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
export default MobileNav;
