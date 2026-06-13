"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";
import type { Language } from "@/lib/translations";
import { getLessons } from "@/lib/curriculum";
import { scheduleProfileSync } from "@/lib/cloud-sync";

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

function getInitialGrade(): number {
  if (typeof window === "undefined") return 1;
  try {
    const grades = JSON.parse(localStorage.getItem("teacherGrades") || "[1]");
    return grades[0] ?? 1;
  } catch {
    return 1;
  }
}

const TYPE_CLS: Record<string, string> = {
  song: "bg-violet-50 text-violet-600",
  poem: "bg-pink-50 text-pink-600",
  phonics: "bg-orange-50 text-orange-600",
  conversation: "bg-accent-50 text-accent-800",
  story: "bg-rose-50 text-rose-600",
  "picture-talk": "bg-accent-50 text-primary-500",
  instructions: "bg-teal-50 text-teal-600",
  writing: "bg-amber-50 text-amber-600",
};

export default function LessonPickerPage() {
  const router = useRouter();
  const lang = getLang();
  const t = translations[lang];
  const isRtl = lang === "ur";
  const grade = getInitialGrade();
  const lessons = getLessons(grade, "english");
  const units = [...new Set(lessons.map((l) => l.unit))].sort((a, b) => a - b);

  const rawCurrent =
    typeof window !== "undefined"
      ? localStorage.getItem("currentLesson_" + grade + "_english") || localStorage.getItem("currentLesson")
      : null;
  const [selected, setSelected] = useState<string>(rawCurrent || lessons[0]?.id || "");

  function handleSelect(id: string) {
    setSelected(id);
    localStorage.setItem("currentLesson_" + grade + "_english", id);
    localStorage.setItem("currentLesson", id);
  }

  function handleContinue() {
    if (selected) {
      localStorage.setItem("currentLesson_" + grade + "_english", selected);
      localStorage.setItem("currentLesson", selected);
    }
    scheduleProfileSync();
    router.push("/home");
  }

  const selectedLesson = lessons.find((l) => l.id === selected);

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="flex flex-col min-h-screen bg-white">
      <header className="bg-white border-b border-[#D0EAE4] text-primary-800 px-6 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-primary-400 text-base font-medium shrink-0">
          {t.back}
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">{t.lessonPickerButton}</h1>
        <div className="w-10 shrink-0" />
      </header>

      <div className="flex-1 px-5 py-5 overflow-y-auto flex flex-col gap-5">
        {units.map((unitNum) => {
          const unitLessons = lessons.filter((l) => l.unit === unitNum);

          return (
            <div key={unitNum}>
              <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-2.5">
                Unit {unitNum}
              </p>
              <div className="flex flex-col gap-2">
                {unitLessons.map((lesson) => {
                  const isSelected = selected === lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelect(lesson.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-start transition-colors shadow-sm ${
                        isSelected
                          ? "bg-accent-700 border-accent-700"
                          : "bg-white border-[#D0EAE4]"
                      }`}
                    >
                      <span className={`text-base shrink-0 ${isSelected ? "text-white" : "text-primary-200"}`}>
                        {isSelected ? "●" : "○"}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-sm font-semibold truncate ${isSelected ? "text-white" : "text-primary-800"}`}>
                          {lesson.id}. {lesson.en}
                        </span>
                        <span className={`block text-xs truncate mt-0.5 ${isSelected ? "text-white/60" : "text-primary-300"}`}>
                          {lesson[lang]} · p. {lesson.pages} · {lesson.days}d
                        </span>
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                          isSelected ? "bg-white/20 text-white" : TYPE_CLS[lesson.type]
                        }`}
                      >
                        {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 pb-8 pt-3 border-t border-[#D0EAE4] bg-white">
        {selectedLesson && (
          <p className="text-xs text-center text-primary-300 mb-3">
            Starting from Lesson {selectedLesson.id}: {selectedLesson.en}
          </p>
        )}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full min-h-12 rounded-xl bg-accent-700 text-white text-base font-semibold shadow-sm disabled:bg-accent-200"
        >
          {t.continueButton}
        </button>
      </div>
    </main>
  );
}
