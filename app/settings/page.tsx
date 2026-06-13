"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Language } from "@/lib/translations";

import { useAuthGuard } from "@/lib/auth";

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

export default function SettingsPage() {
  const router = useRouter();
  useAuthGuard();
  const [lang, setLang] = useState<Language>("mr");

  useEffect(() => { setLang(getLang()); }, []);

  const changeLang = (l: Language) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <header className="bg-white border-b border-[#D0EAE4] text-primary-800 px-5 py-4 flex items-center gap-3">
        <button onClick={() => router.push("/home")} className="text-primary-400 text-lg">{"\u2190"}</button>
        <p className="text-base font-semibold">{"\u2699\uFE0F"} Settings</p>
      </header>

      <div className="px-5 py-5 space-y-4">
        {/* Language */}
        <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm overflow-hidden">
          <button className="w-full px-4 py-4 flex items-center gap-3">
            <span className="text-xl">{"\uD83C\uDF10"}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-primary-800">App Language</p>
              <p className="text-xs text-primary-300 mt-0.5">
                {lang === "mr" ? "\u092E\u0930\u093E\u0920\u0940" : lang === "hi" ? "\u0939\u093F\u0928\u094D\u0926\u0940" : lang === "ur" ? "\u0627\u0631\u062F\u0648" : "English"}
              </p>
            </div>
          </button>
          <div className="px-4 pb-4 flex gap-2">
            {(["mr", "hi", "ur", "en"] as Language[]).map(l => (
              <button key={l} onClick={() => changeLang(l)}
                className={"flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors " +
                  (lang === l ? "bg-accent-700 text-white" : "bg-accent-50 text-primary-600")}>
                {l === "mr" ? "\u092E\u0930\u093E\u0920\u0940" : l === "hi" ? "\u0939\u093F\u0928\u094D\u0926\u0940" : l === "ur" ? "\u0627\u0631\u062F\u0648" : "EN"}
              </button>
            ))}
          </div>
        </div>

        {/* Future settings can go here */}
        <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm px-4 py-4 flex items-center gap-3 opacity-50">
          <span className="text-xl">{"\uD83D\uDD14"}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary-800">Notifications</p>
            <p className="text-xs text-primary-300">Coming soon</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm px-4 py-4 flex items-center gap-3 opacity-50">
          <span className="text-xl">{"\uD83D\uDCBE"}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary-800">Data & Storage</p>
            <p className="text-xs text-primary-300">Coming soon</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm px-4 py-4 flex items-center gap-3 opacity-50">
          <span className="text-xl">{"\u2753"}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary-800">Help & Support</p>
            <p className="text-xs text-primary-300">Coming soon</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm px-4 py-4 flex items-center gap-3">
          <span className="text-xl">{"\uD83D\uDDD1\uFE0F"}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary-800">Clear All Data</p>
            <p className="text-xs text-primary-300">Reset app and start fresh</p>
          </div>
          <button onClick={() => { if (confirm("Are you sure? This will delete all your plans and data.")) { localStorage.clear(); router.push("/"); } }} className="text-sm text-red-500 font-semibold">{"\u2192"}</button>
        </div>

        <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm px-4 py-4 flex items-center gap-3">
          <span className="text-xl">{"\u2139\uFE0F"}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary-800">About PedaStudio</p>
            <p className="text-xs text-primary-300">Version 1.0</p>
          </div>
        </div>
      </div>
    </main>
  );
}