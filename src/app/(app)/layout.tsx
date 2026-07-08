import React from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { TopBar } from "@/components/TopBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header/TopBar wrapped in Suspense for Next.js build compatibility */}
        <React.Suspense fallback={<div className="h-16 border-b border-[var(--card-border)] bg-[var(--card)] flex-shrink-0 animate-pulse" />}>
          <TopBar />
        </React.Suspense>

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6 focus:outline-none">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
