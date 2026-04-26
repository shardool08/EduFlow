"use client";

import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";
import type { Language } from "@/lib/translations";

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

const LESSONS: { id: string; titleKey: "lesson1Title" | "lesson6Title" }[] = [
  { id: "1", titleKey: "lesson1Title" },
  { id: "6", titleKey: "lesson6Title" },
];

export default function HomePage() {
  const router = useRouter();
  const lang = getLang();
  const t = translations[lang];
  const isRtl = lang === "ur";

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="flex flex-col min-h-screen bg-white"
    >
      <header className="bg-[#2B5F3F] text-white px-6 py-4">
        <h1 className="text-2xl font-bold">EduFlow</h1>
        <p className="text-lg mt-1">{t.homeGreeting}</p>
      </header>

      <div className="flex gap-3 px-6 pt-6">
        <button className="flex-1 min-h-14 rounded-xl border-2 border-[#2B5F3F] text-[#2B5F3F] text-base font-semibold px-2 py-2">
          {t.cameraButton}
        </button>
        <button className="flex-1 min-h-14 rounded-xl bg-[#2B5F3F] text-white text-base font-semibold px-2 py-2">
          {t.lessonPickerButton}
        </button>
      </div>

      <section className="px-6 pt-6 flex-1">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {t.lessonsHeader}
        </h2>
        <div className="flex flex-col gap-4">
          {LESSONS.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => router.push(`/plan/${lesson.id}`)}
              className="w-full min-h-14 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-4 text-start text-xl font-semibold text-gray-800 flex items-center"
            >
              {t[lesson.titleKey]}
            </button>
          ))}
        </div>
      </section>

      <nav className="flex border-t border-gray-200 bg-white mt-6">
        <button className="flex-1 py-4 text-center text-sm font-semibold text-[#2B5F3F]">
          {t.navHome}
        </button>
        <button className="flex-1 py-4 text-center text-sm font-semibold text-gray-500">
          {t.navRoadmap}
        </button>
        <button className="flex-1 py-4 text-center text-sm font-semibold text-gray-500">
          {t.navProfile}
        </button>
      </nav>
    </main>
  );
}
