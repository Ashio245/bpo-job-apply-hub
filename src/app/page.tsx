import React from "react";
import Link from "next/link";
import { Briefcase, Upload, ShieldCheck, MapPin, CheckCircle, ArrowRight, Star, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const popularLocations = [
    "Quezon City", "Makati", "Taguig (BGC)", "Pasig", "Alabang", "Cebu City", "Davao City", "Clark"
  ];

  const categories = [
    { title: "Customer Service (CSR)", count: "14 Openings", icon: Star },
    { title: "Technical Support (TSR)", count: "8 Openings", icon: Database },
    { title: "Chat & Non-Voice Support", count: "12 Openings", icon: Briefcase },
    { title: "Healthcare Account Support", count: "6 Openings", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFB] text-[#1C1A17]">
      {/* Navigation Header */}
      <header className="border-b border-[#E8E5DF] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-[#0D7377] flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
              B
            </div>
            <span className="text-sm font-bold tracking-tight uppercase">BPO Job Apply Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/jobs" className="text-xs font-semibold hover:text-[#0D7377]">
              Browse Jobs
            </Link>
            <Link href="/profile">
              <Button size="sm" variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 border-b border-[#E8E5DF] bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Badge text="Philippine BPO Career Platform" />
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
            Discover and apply to multiple BPO openings with zero friction.
          </h1>
          <p className="text-sm md:text-base text-[#706B63] max-w-2xl mx-auto leading-relaxed">
            Centralized job aggregation for Metro Manila and nearby BPO hubs. Build a reusable applicant profile, check matches, and navigate applications with strict compliance.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
            <Link href="/jobs">
              <Button size="lg" className="w-full sm:w-auto flex items-center gap-2">
                <span>Find BPO Jobs</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </Link>
            <Link href="/profile/resumes">
              <Button size="lg" variant="outline" className="w-full sm:w-auto flex items-center gap-2">
                <Upload className="h-4.5 w-4.5 text-[#0D7377]" />
                <span>Upload CV / Resume</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Compliance Guardrail Info */}
      <section className="py-12 border-b border-[#E8E5DF] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded bg-[#F0F7F7] flex items-center justify-center flex-shrink-0 text-[#0D7377]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider">Compliant assisted apply</h3>
                <p className="text-xs text-[#706B63] leading-relaxed">
                  No automated mass-spamming. We structure your CV data to prefill forms and guide you through official partner systems and redirects safely.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 rounded bg-[#F0F7F7] flex items-center justify-center flex-shrink-0 text-[#0D7377]">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider">Philippine-focused hubs</h3>
                <p className="text-xs text-[#706B63] leading-relaxed">
                  Deeply customized for regional requirements: night-shift configurations, specific BPO account classes, locations like BGC, Makati, Cebu, and Clark.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 rounded bg-[#F0F7F7] flex items-center justify-center flex-shrink-0 text-[#0D7377]">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider">Clear match explanations</h3>
                <p className="text-xs text-[#706B63] leading-relaxed">
                  Instantly find out why your profile matches or what criteria are missing (e.g. expected salary range, location preference, or years of voice support experience).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 border-b border-[#E8E5DF] bg-[#FCFBF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold uppercase tracking-wider">Featured BPO Account Classes</h2>
            <p className="text-xs text-[#706B63]">Filter openings instantly by account category</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="border border-[#E8E5DF] bg-white rounded-lg p-5 flex flex-col justify-between h-36 hover:border-[#0D7377] btn-transition">
                  <div className="h-8 w-8 rounded bg-[#F0F7F7] text-[#0D7377] flex items-center justify-center mb-4">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{c.title}</h4>
                    <span className="text-[10px] text-[#706B63]">{c.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Localized City Aggregates */}
      <section className="py-16 border-b border-[#E8E5DF] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold uppercase tracking-wider">Active BPO Location Centers</h2>
            <p className="text-xs text-[#706B63]">Find opportunities near your residence</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {popularLocations.map((loc) => (
              <Link key={loc} href={`/jobs?location=${encodeURIComponent(loc)}`}>
                <span className="inline-block px-3 py-1.5 rounded-full border border-[#E8E5DF] bg-[#FAF8F5] text-xs font-medium hover:border-[#0D7377] hover:text-[#0D7377] btn-transition">
                  {loc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1C1A17] text-[#FAF8F5] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[#0D7377] flex items-center justify-center text-white font-extrabold text-xs">
              B
            </div>
            <span className="font-bold tracking-tight uppercase">BPO Job Apply Hub</span>
          </div>
          <p className="text-[#9E9689] text-[11px]">
            &copy; 2026 BPO Job Apply Hub PH. Developed with compliance-first automation structures. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Inline badge helper
function Badge({ text }: { text: string }) {
  return (
    <span className="inline-block bg-[#F0F7F7] text-[#0D7377] border border-[#0D7377]/10 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded">
      {text}
    </span>
  );
}
