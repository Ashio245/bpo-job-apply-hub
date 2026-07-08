"use client";

import React, { useState } from "react";
import { AlertCircle, Save, CheckCircle, Plus, Trash2, Award, BookOpen, MessageSquare, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";

interface ProfileClientFormProps {
  initialProfile: any;
  dbActive: boolean;
}

export default function ProfileClientForm({ initialProfile, dbActive }: ProfileClientFormProps) {
  const { toast } = useToast();
  
  const [profile, setProfile] = useState(initialProfile || {
    fullName: "",
    email: "",
    phone: "",
    currentLocation: "",
    preferredLocations: [],
    workSetupPreference: "ANY",
    targetRoles: [],
    expectedSalary: 0,
    noticePeriodDays: 30,
    shiftPreference: "ANY",
    totalBpoExperienceYrs: 0,
    experienceSummary: "",
    skills: [],
    languages: [],
    savedAnswers: { why_bpo: "", strengths: "" }
  });

  const [activeTab, setActiveTab] = useState<"basics" | "history" | "answers">("basics");
  const [isSaving, setIsSaving] = useState(false);

  // Manage dynamic skills/languages
  const [newSkill, setNewSkill] = useState("");
  const [newLang, setNewLang] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast("Profile Updated", {
        type: "success",
        message: "Your profile has been saved. Match scores recalculated."
      });
    }, 1000);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((prev: any) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  const deleteSkill = (skill: string) => {
    setProfile((prev: any) => ({ ...prev, skills: prev.skills.filter((s: string) => s !== skill) }));
  };

  const addLanguage = () => {
    if (newLang.trim() && !profile.languages.includes(newLang.trim())) {
      setProfile((prev: any) => ({ ...prev, languages: [...prev.languages, newLang.trim()] }));
      setNewLang("");
    }
  };

  const deleteLanguage = (lang: string) => {
    setProfile((prev: any) => ({ ...prev, languages: prev.languages.filter((l: string) => l !== lang) }));
  };

  // Profile completion calculation
  const calculateCompletion = () => {
    let fields = 0;
    let filled = 0;
    const checkList = [
      profile.fullName, profile.email, profile.phone, profile.currentLocation,
      profile.preferredLocations.length > 0, profile.workSetupPreference,
      profile.targetRoles.length > 0, profile.expectedSalary,
      profile.skills.length > 0, profile.languages.length > 0
    ];
    checkList.forEach(field => {
      fields++;
      if (field) filled++;
    });
    return Math.round((filled / fields) * 100);
  };

  const score = calculateCompletion();

  return (
    <div className="space-y-6">
      {/* Progress & Verification checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 flex items-center justify-between">
          <div className="space-y-1.5 flex-1 pr-6">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span>Profile Completion</span>
              <span className="text-[var(--accent)]">{score}%</span>
            </div>
            <div className="w-full bg-[var(--card-border)] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[var(--accent)] h-full btn-transition"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-[10px] text-[var(--muted)] leading-tight pt-1">
              Complete your experience details and preferred shift to unlock direct 1-click in-app apply capabilities.
            </p>
          </div>
          
          <div className="h-14 w-14 rounded-full border border-[var(--card-border)] bg-[var(--background)] flex items-center justify-center text-xs font-extrabold text-[var(--accent)] shadow-xs">
            {score}%
          </div>
        </Card>

        {/* Warning card for missing fields */}
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 dark:border-amber-900/40 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase">Profile Guardrails</h4>
            <p className="text-[10px] text-amber-700 dark:text-amber-500 leading-normal">
              {!profile.expectedSalary && "• Expected Salary is missing. Match scores might be inaccurate."}
              {profile.preferredLocations.length === 0 && "• Please select at least one preferred city."}
              {profile.skills.length === 0 && "• No core skills listed. Let employers find your tags."}
              {profile.expectedSalary && profile.preferredLocations.length > 0 && profile.skills.length > 0 && "• All key fields filled! Your profile is verified."}
            </p>
          </div>
        </Card>
      </div>

      {/* Tab Select buttons */}
      <div className="flex border-b border-[var(--card-border)] text-xs">
        <button
          onClick={() => setActiveTab("basics")}
          className={`px-4 py-2 font-bold border-b-2 btn-transition cursor-pointer ${
            activeTab === "basics" ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          1. Basics & Preferences
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 font-bold border-b-2 btn-transition cursor-pointer ${
            activeTab === "history" ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          2. Work & Education
        </button>
        <button
          onClick={() => setActiveTab("answers")}
          className={`px-4 py-2 font-bold border-b-2 btn-transition cursor-pointer ${
            activeTab === "answers" ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          3. Saved Application Answers
        </button>
      </div>

      {/* Form submit handler */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: BASICS */}
        {activeTab === "basics" && (
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile((p: any) => ({ ...p, fullName: e.target.value }))}
                  className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile((p: any) => ({ ...p, phone: e.target.value }))}
                  className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile((p: any) => ({ ...p, email: e.target.value }))}
                  className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Current Location</label>
                <input
                  type="text"
                  value={profile.currentLocation}
                  onChange={(e) => setProfile((p: any) => ({ ...p, currentLocation: e.target.value }))}
                  className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Target Roles */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Target BPO Roles (separated by comma)</label>
                <input
                  type="text"
                  value={profile.targetRoles.join(", ")}
                  onChange={(e) => setProfile((p: any) => ({ ...p, targetRoles: e.target.value.split(",").map((s: string) => s.trim()) }))}
                  className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Expected salary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Expected Salary (PHP/mo)</label>
                <input
                  type="number"
                  value={profile.expectedSalary || ""}
                  onChange={(e) => setProfile((p: any) => ({ ...p, expectedSalary: Number(e.target.value) }))}
                  className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Setup preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Work Setup Preference</label>
                <select
                  value={profile.workSetupPreference}
                  onChange={(e) => setProfile((p: any) => ({ ...p, workSetupPreference: e.target.value }))}
                  className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] outline-none"
                >
                  <option value="ONSITE">On-site only</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="REMOTE">Remote / Work from home</option>
                  <option value="ANY">No Preference / Any</option>
                </select>
              </div>

              {/* Shift preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Shift Preference</label>
                <select
                  value={profile.shiftPreference}
                  onChange={(e) => setProfile((p: any) => ({ ...p, shiftPreference: e.target.value }))}
                  className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] outline-none"
                >
                  <option value="DAY">Day Shift</option>
                  <option value="NIGHT">Night / Graveyard Shift</option>
                  <option value="FLEXIBLE">Rotating Shift</option>
                  <option value="ANY">No Preference</option>
                </select>
              </div>
            </div>

            {/* Preferred cities checkboxes */}
            <div className="space-y-2 pt-2 border-t border-[var(--card-border)]">
              <label className="text-xs font-bold text-[var(--muted)] uppercase block">Preferred Cities for Onsite/Hybrid Work</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Quezon City", "Pasig", "Makati", "Taguig (BGC)", "Mandaluyong", "Cebu City", "Davao City", "Clark (Angeles)"].map((city) => {
                  const isChecked = profile.preferredLocations.includes(city);
                  return (
                    <label key={city} className="flex items-center gap-2 p-2 border border-[var(--card-border)] rounded text-xs cursor-pointer hover:bg-[var(--card-border)]/10 select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...profile.preferredLocations, city]
                            : profile.preferredLocations.filter((l: string) => l !== city);
                          setProfile((p: any) => ({ ...p, preferredLocations: updated }));
                        }}
                        className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      <span>{city}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HISTORY */}
        {activeTab === "history" && (
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-6 space-y-6">
            {/* Experience input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--muted)] uppercase">Total BPO Experience (Years)</label>
                <input
                  type="number"
                  step="0.5"
                  value={profile.totalBpoExperienceYrs}
                  onChange={(e) => setProfile((p: any) => ({ ...p, totalBpoExperienceYrs: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            {/* Skills chip manager */}
            <div className="space-y-3 pt-4 border-t border-[var(--card-border)]">
              <label className="text-xs font-bold text-[var(--muted)] uppercase block">Core Skills & Certifications</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Inbound Sales"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="p-1.5 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] max-w-xs w-full"
                />
                <Button size="sm" type="button" onClick={addSkill} className="flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {profile.skills.map((skill: string) => (
                  <Badge key={skill} variant="brand" className="text-[10px] flex items-center gap-1.5">
                    <span>{skill}</span>
                    <button type="button" onClick={() => deleteSkill(skill)} className="text-[var(--accent)] hover:text-rose-500 font-bold ml-1 text-xs">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Languages chip manager */}
            <div className="space-y-3 pt-4 border-t border-[var(--card-border)]">
              <label className="text-xs font-bold text-[var(--muted)] uppercase block">Languages Spoken</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Spanish"
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value)}
                  className="p-1.5 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] max-w-xs w-full"
                />
                <Button size="sm" type="button" onClick={addLanguage} className="flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {profile.languages.map((lang: string) => (
                  <Badge key={lang} variant="secondary" className="text-[10px] flex items-center gap-1.5">
                    <span>{lang}</span>
                    <button type="button" onClick={() => deleteLanguage(lang)} className="text-[var(--muted)] hover:text-rose-500 font-bold ml-1 text-xs">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SAVED ANSWERS */}
        {activeTab === "answers" && (
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg p-6 space-y-6">
            <div className="space-y-4">
              <div className="p-3 bg-stone-50 dark:bg-stone-900 border border-[var(--card-border)] rounded text-[10px] text-[var(--muted)] leading-relaxed">
                <span className="font-bold text-[var(--foreground)] block mb-0.5">How it works:</span>
                Many BPO companies require answers to these common questions. Prefilling them saves hours during assisted applications by auto-populating fields when we run compliance submits.
              </div>

              {/* Q1 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--foreground)] block">
                  Question 1: Why do you want to work in the BPO / Call Center industry?
                </label>
                <textarea
                  rows={3}
                  value={profile.savedAnswers?.why_bpo || ""}
                  onChange={(e) => setProfile((p: any) => ({
                    ...p,
                    savedAnswers: { ...p.savedAnswers, why_bpo: e.target.value }
                  }))}
                  className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                  placeholder="Share details about career growth, language practice, or technical interest..."
                />
              </div>

              {/* Q2 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--foreground)] block">
                  Question 2: What are your key professional strengths and how do they apply to customer support?
                </label>
                <textarea
                  rows={3}
                  value={profile.savedAnswers?.strengths || ""}
                  onChange={(e) => setProfile((p: any) => ({
                    ...p,
                    savedAnswers: { ...p.savedAnswers, strengths: e.target.value }
                  }))}
                  className="w-full p-2 border border-[var(--card-border)] bg-[var(--background)] rounded text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                  placeholder="Share details about patience, communication, adaptability, or active listening..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Save CTA */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" isLoading={isSaving} className="flex items-center gap-1.5">
            <Save className="h-4 w-4" />
            <span>Save Profile changes</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
