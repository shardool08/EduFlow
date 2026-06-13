"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";
import type { Language } from "@/lib/translations";
import { internetAccess, printingAccess } from "@/lib/maharashtra-data";
import { TLM_RESOURCES } from "@/lib/tlm";
import { scheduleProfileSync } from "@/lib/cloud-sync";

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

function ls(key: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) ?? "";
}

type LocationVal = "urban" | "semi_urban" | "rural";

const RESOURCES = TLM_RESOURCES.map((r) => ({ id: r.id, label: r.label }));

export default function AboutClassPage() {
  const router = useRouter();
  const lang = getLang();
  const t = translations[lang];
  const isRtl = lang === "ur";

  const [schoolName, setSchoolName] = useState(ls("schoolName"));
  const [location, setLocation] = useState<LocationVal | "">(ls("location") as LocationVal | "");
  const [pinCode, setPinCode] = useState(ls("pinCode"));
  const [studentCount, setStudentCount] = useState(Number(ls("studentCount") || "30"));
  const [selectedResources, setSelectedResources] = useState<string[]>(() => {
    const saved = ls("teacherResources");
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return [];
  });
  const [customResource, setCustomResource] = useState("");
  const [internet, setInternet] = useState(ls("internetAccess"));
  const [printing, setPrinting] = useState(ls("printingAccess"));

  const toggleResource = (id: string) => {
    setSelectedResources(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const addCustomResource = () => {
    if (customResource.trim() && !selectedResources.includes(customResource.trim())) {
      setSelectedResources(prev => [...prev, customResource.trim()]);
      setCustomResource("");
    }
  };

  const LOCATION_OPTIONS: { value: LocationVal; label: string }[] = [
    { value: "urban", label: t.locationUrban },
    { value: "semi_urban", label: t.locationSemiUrban },
    { value: "rural", label: t.locationRural },
  ];

  function handleContinue() {
    localStorage.setItem("schoolName", schoolName);
    localStorage.setItem("location", location);
    localStorage.setItem("pinCode", pinCode);
    localStorage.setItem("studentCount", String(studentCount));
    localStorage.setItem("teacherResources", JSON.stringify(selectedResources));
    localStorage.setItem("internetAccess", internet);
    localStorage.setItem("printingAccess", printing);
    scheduleProfileSync();
    router.push("/home");
  }

  const inputCls = "w-full px-4 py-3.5 text-base border border-[#D0EAE4] rounded-xl outline-none bg-white focus:border-primary-500 transition-colors text-primary-800";

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="flex flex-col min-h-screen bg-white">
      <header className="bg-white border-b border-[#D0EAE4] text-primary-800 px-6 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-primary-400 text-base font-medium shrink-0">{t.back}</button>
        <h1 className="text-lg font-bold flex-1 text-center">{t.aboutClassTitle}</h1>
        <div className="w-10 shrink-0" />
      </header>

      <div className="flex-1 px-5 py-5 pb-28 flex flex-col gap-4">

        <FormCard>
          <FieldLabel>{t.schoolNameLabel}</FieldLabel>
          <input type="text" placeholder={t.schoolNamePlaceholder} value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className={inputCls} />
        </FormCard>

        <FormCard>
          <FieldLabel>{t.locationLabel}</FieldLabel>
          <div className="flex gap-2">
            {LOCATION_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => setLocation(opt.value)}
                className={"flex-1 min-h-11 rounded-xl border text-sm font-semibold px-2 py-2 transition-colors " +
                  (location === opt.value ? "bg-accent-700 border-accent-700 text-white" : "bg-white border-[#D0EAE4] text-primary-600")}>
                {opt.label}
              </button>
            ))}
          </div>
        </FormCard>

        <FormCard>
          <FieldLabel>{t.pinCodeLabel}</FieldLabel>
          <input type="tel" inputMode="numeric" maxLength={6} placeholder={t.pinCodePlaceholder} value={pinCode} onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))} className={inputCls} />
        </FormCard>

        <FormCard>
          <FieldLabel>
            {t.studentCountLabel}: <span className="text-primary-500 font-bold">{studentCount}</span>
          </FieldLabel>
          <input type="range" min={10} max={80} step={1} value={studentCount} onChange={(e) => setStudentCount(Number(e.target.value))} className="w-full accent-accent-500" />
          <div className="flex justify-between text-xs text-primary-300"><span>10</span><span>80</span></div>
        </FormCard>

        <FormCard>
          <FieldLabel>{t.resourcesLabel}</FieldLabel>
          <div className="flex flex-col gap-2">
            {RESOURCES.map((r) => (
              <button key={r.id} onClick={() => toggleResource(r.id)}
                className={"w-full min-h-11 rounded-xl border text-sm font-semibold px-4 py-2.5 text-start flex items-center gap-3 transition-colors " +
                  (selectedResources.includes(r.id) ? "bg-accent-700 border-accent-700 text-white" : "bg-white border-[#D0EAE4] text-primary-600")}>
                <span className="text-base">{selectedResources.includes(r.id) ? "\u2705" : "\u25CB"}</span>
                {r.label}
              </button>
            ))}
            {/* Custom resources added by teacher */}
            {selectedResources.filter(r => !RESOURCES.find(res => res.id === r)).map(r => (
              <button key={r} onClick={() => toggleResource(r)}
                className="w-full min-h-11 rounded-xl border text-sm font-semibold px-4 py-2.5 text-start flex items-center gap-3 bg-accent-700 border-accent-700 text-white">
                <span className="text-base">{"\u2705"}</span>
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input type="text" value={customResource} onChange={e => setCustomResource(e.target.value)} onKeyDown={e => e.key === "Enter" && addCustomResource()} placeholder="Add other resource..." className="flex-1 px-3 py-2.5 text-sm border border-[#D0EAE4] rounded-xl outline-none focus:border-primary-500 bg-white" />
            <button onClick={addCustomResource} className="px-4 py-2.5 rounded-xl bg-accent-100 border border-[#D0EAE4] text-accent-800 text-sm font-semibold">+</button>
          </div>
        </FormCard>

        <FormCard>
          <FieldLabel>Internet</FieldLabel>
          <select value={internet} onChange={(e) => setInternet(e.target.value)} className={inputCls}>
            <option value="" disabled>{"\u2014"}</option>
            {internetAccess.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        </FormCard>

        <FormCard>
          <FieldLabel>Printing</FieldLabel>
          <select value={printing} onChange={(e) => setPrinting(e.target.value)} className={inputCls}>
            <option value="" disabled>{"\u2014"}</option>
            {printingAccess.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        </FormCard>

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-4 border-t border-[#D0EAE4]">
        <div className="max-w-[480px] mx-auto">
          <button onClick={handleContinue} className="w-full min-h-12 rounded-xl bg-accent-700 text-white text-base font-semibold shadow-sm">{t.continueButton}</button>
        </div>
      </div>
    </main>
  );
}

function FormCard({ children }: { children: React.ReactNode }) {
  return (<div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm px-4 py-4 flex flex-col gap-2">{children}</div>);
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (<label className="block text-sm font-semibold text-primary-600">{children}</label>);
}
