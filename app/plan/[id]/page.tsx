"use client";

import { useRouter, useParams } from "next/navigation";
import { translations } from "@/lib/translations";
import type { Language } from "@/lib/translations";

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

const TITLE_KEY: Record<string, "lesson1Title" | "lesson6Title"> = {
  "1": "lesson1Title",
  "6": "lesson6Title",
};

export default function PlanPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) ?? "1";
  const lang = getLang();
  const t = translations[lang];
  const isRtl = lang === "ur";
  const titleKey = TITLE_KEY[id] ?? "lesson1Title";
  const lessonTitle = t[titleKey];
  const aiMessage = t.aiGreeting.replace("{lessonTitle}", lessonTitle);

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="flex flex-col min-h-screen bg-white"
    >
      <header className="bg-[#2B5F3F] text-white px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-white text-xl shrink-0"
        >
          {t.back}
        </button>
        <h1 className="text-xl font-bold flex-1 text-center">{lessonTitle}</h1>
      </header>

      <div className="flex-1 px-4 py-6">
        <div className="bg-[#EAF3ED] rounded-2xl px-5 py-4">
          <p className="text-xl text-gray-800">{aiMessage}</p>
        </div>
      </div>

      <div className="px-4 pb-8">
        <button className="w-full min-h-14 rounded-2xl bg-[#2B5F3F] text-white text-2xl font-bold flex items-center justify-center gap-2">
          {t.micButton}
        </button>
      </div>
    </main>
  );
}
