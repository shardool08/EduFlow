"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";
import type { Language } from "@/lib/translations";
import { getLessons, isAvailable } from "@/lib/curriculum";
import type { BalbharatiLesson } from "@/lib/curriculum";
import { getLessonStatus, getFirstUnplannedDay, getFirstPlannedDay } from "@/lib/plan-storage";
import { useAuthGuard } from "@/lib/auth";
import { scheduleProfileSync } from "@/lib/cloud-sync";

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}
function ls(key: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) ?? "";
}

type Tab = "home" | "roadmap" | "profile";

const SUBJECT_LABELS: Record<string, string> = {
  english: "English", marathi: "Marathi", hindi: "Hindi",
  maths: "Maths", evs: "EVS", social: "Social",
};
const ALL_GRADES = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const GRADE_LABELS: Record<number, string> = { 0: "KG", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8" };

export default function HomePage() {
  const router = useRouter();
  useAuthGuard();
  const [lang, setLang] = useState<Language>("mr");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState("english");
  const [teacherGrades, setTeacherGrades] = useState<number[]>([1]);
  const [teacherSubjects, setTeacherSubjects] = useState<string[]>(["english"]);
  const [currentLessonId, setCurrentLessonId] = useState("");
  const [settingCurrent, setSettingCurrent] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [planRefresh, setPlanRefresh] = useState(0);

  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") setPlanRefresh((n) => n + 1); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  useEffect(() => {
    setLang(getLang());
    let grade = 1;
    let subject = "english";
    const sg = ls("teacherGrades");
    if (sg) {
      try {
        const g = JSON.parse(sg);
        if (g.length > 0) {
          grade = g[0];
          setTeacherGrades(g);
          setSelectedGrade(g[0]);
        }
      } catch {}
    }
    const ss = ls("teacherSubjects");
    if (ss) {
      try {
        const s = JSON.parse(ss);
        if (s.length > 0) {
          subject = s[0];
          setTeacherSubjects(s);
          setSelectedSubject(s[0]);
        }
      } catch {}
    }
    const cl = ls("currentLesson_" + grade + "_" + subject) || ls("currentLesson");
    if (cl) setCurrentLessonId(cl);
  }, []);

  useEffect(() => {
    const cl = ls("currentLesson_" + selectedGrade + "_" + selectedSubject) || ls("currentLesson");
    setCurrentLessonId(cl || "");
  }, [selectedGrade, selectedSubject]);

  const t = translations[lang];
  const isRtl = lang === "ur";
  const lessons = getLessons(selectedGrade, selectedSubject);
  const available = isAvailable(selectedGrade, selectedSubject);
  const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
  const completedCount = lessons.filter(l => getLessonStatus(l.id, l.days) === "completed").length;
  const progressCount = Math.max(completedCount, currentIndex >= 0 ? currentIndex : 0);
  const currentLesson = currentIndex >= 0 ? lessons[currentIndex] : lessons[0];
  const nextLesson = currentIndex >= 0 ? lessons[currentIndex + 1] : lessons[1];
  const totalLessons = lessons.length;
  const pct = totalLessons > 0 ? Math.round((progressCount / totalLessons) * 100) : 0;
  void planRefresh;
  const nextPlanDay = currentLesson ? getFirstUnplannedDay(currentLesson.id, currentLesson.days) : null;
  const viewPlanDay = currentLesson ? getFirstPlannedDay(currentLesson.id, currentLesson.days) : null;

  const setAsCurrentLesson = (lessonId: string) => {
    localStorage.setItem("currentLesson_" + selectedGrade + "_" + selectedSubject, lessonId);
    localStorage.setItem("currentLesson", lessonId);
    setCurrentLessonId(lessonId);
    setSettingCurrent(false);
  };

  const TYPE_STYLE: Record<string, string> = {
    song: "bg-violet-50 text-violet-600", conversation: "bg-accent-50 text-accent-800",
    "picture-talk": "bg-accent-50 text-primary-500", phonics: "bg-orange-50 text-orange-600",
    poem: "bg-pink-50 text-pink-600", story: "bg-rose-50 text-rose-600",
    instructions: "bg-teal-50 text-teal-600", writing: "bg-amber-50 text-amber-600",
  };

  const gradeSubjectSelector = (
    <div className="bg-white border-b border-[#D0EAE4] px-5 py-2.5">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs font-semibold text-primary-300 w-12 shrink-0">Grade</p>
        <div className="flex gap-1.5 flex-wrap">
          {teacherGrades.map(g => (
            <button key={g} onClick={() => setSelectedGrade(g)}
              className={"w-9 h-9 rounded-lg text-xs font-bold transition-colors " +
                (g === selectedGrade ? "bg-accent-700 text-white" : "bg-accent-50 text-primary-500")}>
              {GRADE_LABELS[g] || g}
            </button>
          ))}
        </div>
      </div>
      {selectedGrade !== 0 && teacherSubjects.length > 0 && (
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-primary-300 w-12 shrink-0">Sub</p>
          <div className="flex gap-1.5 flex-wrap">
            {teacherSubjects.map(s => (
              <button key={s} onClick={() => setSelectedSubject(s)}
                className={"px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors " +
                  (s === selectedSubject ? "bg-accent-700 text-white" : "bg-accent-50 text-primary-500")}>
                {SUBJECT_LABELS[s] || s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="flex flex-col min-h-screen bg-white">
      {/* Header — white with primary text */}
      <header className="bg-white border-b border-[#D0EAE4] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-primary-800">PedaStudio</h1>
            <p className="text-sm text-primary-300 mt-0.5">{t.homeGreeting}</p>
          </div>
          <button onClick={() => router.push("/settings")} className="relative w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
            <span className="text-lg">{"\uD83D\uDD14"}</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">0</span>
          </button>
        </div>
      </header>
      {activeTab !== "profile" && gradeSubjectSelector}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "home" && (
          <div className="px-5 pt-5 pb-6 space-y-5">
            {!available ? (
              <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm p-6 text-center">
                <p className="text-3xl mb-3">{"\uD83D\uDD12"}</p>
                <p className="text-base font-semibold text-primary-700">{selectedGrade === 0 ? "KG" : "Grade " + selectedGrade + " " + (SUBJECT_LABELS[selectedSubject] || selectedSubject)}</p>
                <p className="text-sm text-primary-300 mt-1">Coming soon. Currently available: Grades 1–5 English.</p>
              </div>
            ) : !currentLessonId ? (
              <div className="bg-white rounded-xl border-2 border-accent-500 shadow-sm p-6 text-center">
                <p className="text-base font-semibold text-primary-800 mb-2">Set your current lesson</p>
                <p className="text-sm text-primary-300 mb-4">Tap below to mark where you are in the textbook</p>
                <button onClick={() => { setActiveTab("roadmap"); setSettingCurrent(true); }} className="px-6 py-3 rounded-xl bg-accent-700 text-white font-semibold text-sm">
                  Go to Roadmap {"\u2192"}
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-3">
                  <button onClick={() => router.push("/scan")} className="flex-1 min-h-12 rounded-xl border border-[#D0EAE4] bg-white text-primary-600 text-sm font-semibold shadow-sm flex items-center justify-center gap-2">
                    {t.cameraButton}
                  </button>
                  <button onClick={() => { setActiveTab("roadmap"); setSettingCurrent(true); }} className="flex-1 min-h-12 rounded-xl bg-accent-50 text-primary-600 text-sm font-semibold shadow-sm">
                    Change Lesson
                  </button>
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-3">{t.lessonsHeader}</p>
                  <div className="space-y-3">
                    {/* Current lesson card — warm peach highlight */}
                    {currentLesson && (
                      <div className="w-full text-start rounded-xl border shadow-sm overflow-hidden bg-warm-100 border-warm-300">
                        <button onClick={() => router.push("/lesson/" + currentLesson.id)} className="w-full text-start">
                        <div className="border-l-4 border-warm-400 px-4 pt-4 pb-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-warm-400 text-white">Current</span>
                            <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + (TYPE_STYLE[currentLesson.type] || "bg-gray-50 text-gray-600")}>{currentLesson.type}</span>
                          </div>
                          <div>
                            <p className="text-base font-bold text-warm-900">{currentLesson.id}: {currentLesson.en}</p>
                            <p className="text-sm text-warm-700 mt-0.5">{currentLesson[lang]}</p>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-warm-600">
                            <span>p. {currentLesson.pages}</span><span>{currentLesson.days} days</span><span>Unit {currentLesson.unit}</span>
                          </div>
                          <p className="text-xs text-warm-500 truncate">{currentLesson.vocabulary.slice(0, 4).join(", ")}...</p>
                        </div>
                        </button>
                        <div className="px-4 pb-4 flex gap-2">
                          {viewPlanDay && (
                            <button onClick={() => router.push("/plan-view/" + currentLesson.id + "?day=" + viewPlanDay)} className="flex-1 min-h-11 rounded-xl border-2 border-primary-500 text-primary-500 text-sm font-semibold">
                              {"\uD83D\uDCC4"} View Plan
                            </button>
                          )}
                          {nextPlanDay ? (
                            <button onClick={() => router.push("/quick-plan/" + currentLesson.id + "?day=" + nextPlanDay)} className={"min-h-11 rounded-xl bg-accent-700 text-white text-sm font-semibold " + (viewPlanDay ? "flex-1" : "w-full")}>
                              {"\u2728"} Plan Day {nextPlanDay} {"\u2192"}
                            </button>
                          ) : !viewPlanDay ? (
                            <button onClick={() => router.push("/lesson/" + currentLesson.id)} className="w-full min-h-11 rounded-xl bg-accent-700 text-white text-sm font-semibold">
                              Open Lesson {"\u2192"}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    )}
                    {/* Next lesson card — aqua tint */}
                    {nextLesson && (
                      <button onClick={() => router.push("/lesson/" + nextLesson.id)} className="w-full text-start rounded-xl border shadow-sm overflow-hidden bg-accent-50 border-[#D0EAE4]">
                        <div className="px-4 pt-4 pb-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent-100 text-accent-800">Up Next</span>
                            <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + (TYPE_STYLE[nextLesson.type] || "bg-gray-50 text-gray-600")}>{nextLesson.type}</span>
                          </div>
                          <div>
                            <p className="text-base font-bold text-primary-800">{nextLesson.id}: {nextLesson.en}</p>
                            <p className="text-sm text-primary-400 mt-0.5">{nextLesson[lang]}</p>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-primary-300">
                            <span>p. {nextLesson.pages}</span><span>{nextLesson.days} days</span><span>Unit {nextLesson.unit}</span>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="px-5 pt-5 pb-8 space-y-5">
            {!available ? (
              <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm p-6 text-center">
                <p className="text-3xl mb-3">{"\uD83D\uDD12"}</p>
                <p className="text-base font-semibold text-primary-700">Coming soon</p>
              </div>
            ) : (
              <>
                {settingCurrent && (
                  <div className="bg-warm-50 border border-warm-300 rounded-xl p-3">
                    <p className="text-sm font-semibold text-warm-800">Tap the lesson you are currently teaching</p>
                    <p className="text-xs text-warm-600 mt-0.5">This sets your starting point in the roadmap</p>
                  </div>
                )}
                {/* Progress card with gradient bar */}
                <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm px-4 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-primary-700">{selectedGrade === 0 ? "KG" : "Grade " + selectedGrade + " " + (SUBJECT_LABELS[selectedSubject] || "")} Progress</p>
                    <p className="text-sm text-primary-300">{completedCount} of {totalLessons} completed</p>
                  </div>
                  <div className="w-full h-2 bg-accent-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: pct + "%", background: "linear-gradient(90deg, #BAFFF5, #496580)" }} />
                  </div>
                  <p className="text-xs text-primary-300 mt-1.5">{pct}% complete</p>
                </div>

                {[...new Set(lessons.map((l) => l.unit))].sort((a, b) => a - b).map(unitNum => {
                  const unitLessons = lessons.filter(l => l.unit === unitNum);
                  if (unitLessons.length === 0) return null;
                  return (
                    <div key={unitNum}>
                      <p className="text-sm font-bold text-primary-700 mb-2.5">Unit {unitNum}</p>
                      <div className="space-y-2">
                        {unitLessons.map(lesson => {
                          const planStatus = getLessonStatus(lesson.id, lesson.days);
                          const isCurrent = lesson.id === currentLessonId;
                          const status = planStatus === "completed" ? "done" : planStatus === "in_progress" ? "progress" : planStatus === "planned" ? "planned" : isCurrent ? "current" : "upcoming";
                          return (
                            <button key={lesson.id}
                              onClick={() => {
                                if (settingCurrent) { setAsCurrentLesson(lesson.id); }
                                else if (planStatus === "planned" || planStatus === "in_progress") {
                                  const pd = getFirstPlannedDay(lesson.id, lesson.days);
                                  if (pd) router.push("/plan-view/" + lesson.id + "?day=" + pd);
                                  else router.push("/lesson/" + lesson.id);
                                }
                                else { router.push("/lesson/" + lesson.id); }
                              }}
                              className={"w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-start transition-colors " +
                                (isCurrent ? "bg-warm-100 border-warm-400" : settingCurrent ? "bg-white border-[#D0EAE4] active:border-accent-500 active:bg-accent-50" : "bg-white border-[#D0EAE4]")}>
                              <span className={"text-sm shrink-0 w-5 text-center " +
                                (isCurrent ? "text-warm-700" : status === "done" ? "text-accent-600" : status === "planned" ? "text-primary-400" : status === "progress" ? "text-warm-500" : "text-primary-200")}>
                                {status === "done" ? "\u2705" : isCurrent ? "\u25B6\uFE0F" : status === "planned" ? "\uD83D\uDCDD" : status === "progress" ? "\u25B6\uFE0F" : "\u25CB"}
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className={"block text-sm font-semibold truncate " + (isCurrent ? "text-warm-900" : "text-primary-800")}>
                                  {lesson.id} {lesson.en}
                                </span>
                                <span className={"block text-xs truncate mt-0.5 " + (isCurrent ? "text-warm-600" : "text-primary-300")}>
                                  {lesson[lang]} {"\u2022"} p. {lesson.pages}
                                </span>
                              </span>
                              <span className={"text-xs font-medium px-2 py-0.5 rounded-full shrink-0 " +
                                (isCurrent ? "bg-warm-300 text-warm-900" : (TYPE_STYLE[lesson.type] || "bg-gray-50 text-gray-600"))}>
                                {lesson.type}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="px-5 pt-4 pb-8 space-y-4">
            <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm overflow-hidden">
              <div className="bg-primary-500 px-4 py-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-white">{ls("teacherName") || "Teacher"}</p>
                  <p className="text-xs text-white/60 mt-0.5">{ls("schoolName") || "School"} {"\u2022"} {ls("district") || ""}</p>
                </div>
                <button onClick={() => router.push("/settings")} className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="text-white text-lg">{"\u2699\uFE0F"}</span>
                </button>
              </div>
              <div className="divide-y divide-accent-50">
                {[
                  { label: t.adminTypeLabel, key: "adminType" },
                  { label: t.mediumLabel, key: "medium" },
                  { label: t.comfortLabel, key: "englishComfort" },
                  { label: t.studentCountLabel, key: "studentCount" },
                  { label: t.locationLabel, key: "location" },
                ].map(({ label, key }) => {
                  const val = ls(key);
                  return (
                    <div key={key} className="flex items-start justify-between gap-3 px-4 py-3">
                      <span className="text-sm text-primary-400 shrink-0">{label}</span>
                      <span className={"text-sm font-medium text-end " + (val ? "text-primary-800" : "text-primary-200")}>{val || t.notSetLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={() => setShowGradeModal(true)} className="w-full py-3 rounded-xl border-2 border-accent-500 text-primary-500 font-semibold text-sm">Change Grades & Subjects</button>
            <button onClick={() => router.push("/profile/edit")} className="w-full py-3 rounded-xl bg-accent-700 text-white font-semibold text-sm">{t.editProfileButton}</button>
            <button onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              localStorage.clear();
              router.push("/");
            }} className="w-full py-3 rounded-xl border border-red-200 text-red-500 font-semibold text-sm">Logout</button>
          </div>
        )}
      </div>

      {/* Bottom Nav — aqua tinted, icons + labels, clearly visible */}
      <nav className="flex border-t border-[#D0EAE4] bg-[#F0FAF8] sticky bottom-0">
        {(["home", "roadmap", "profile"] as Tab[]).map(tab => {
          const labels: Record<Tab, string> = { home: t.navHome, roadmap: t.navRoadmap, profile: t.navProfile };
          const icons: Record<Tab, string> = { home: "\uD83C\uDFE0", roadmap: "\uD83D\uDDFA\uFE0F", profile: "\uD83D\uDC64" };
          const active = activeTab === tab;
          return (
            <button key={tab} onClick={() => { setActiveTab(tab); if (tab !== "roadmap") setSettingCurrent(false); }}
              className={"flex-1 py-3 flex flex-col items-center gap-1 text-xs font-semibold transition-colors " + (active ? "text-[#2A7A6A]" : "text-[#A0BAB4]")}>
              <span className="text-lg">{icons[tab]}</span>
              <span>{labels[tab]}</span>
              {active && <span className="w-6 h-0.5 rounded-full bg-[#2A7A6A] mt-0.5" />}
            </button>
          );
        })}
      </nav>

      {showGradeModal && (
        <div className="fixed inset-0 bg-black/50 z-20 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-[480px] p-5 pb-8">
            <div className="w-10 h-1 bg-primary-200 rounded-full mx-auto mb-4"></div>
            <p className="text-base font-bold text-primary-800 mb-4">Change Grades & Subjects</p>

            <div className="mb-4">
              <p className="text-xs font-semibold text-primary-300 uppercase mb-2">Grades you teach</p>
              <div className="flex flex-wrap gap-2">
                {[0,1,2,3,4,5,6,7,8].map(g => (
                  <button key={g} onClick={() => {
                    setTeacherGrades(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g].sort());
                  }} className={"w-10 h-10 rounded-xl text-xs font-bold transition-colors " +
                    (teacherGrades.includes(g) ? "bg-accent-700 text-white" : "bg-accent-50 text-primary-500")}>
                    {g === 0 ? "KG" : g}
                  </button>
                ))}
              </div>
            </div>

            {!teacherGrades.every(g => g === 0) && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-primary-300 uppercase mb-2">Subjects you teach</p>
                <div className="flex flex-wrap gap-2">
                  {["english","marathi","hindi","maths","evs","social"].map(s => (
                    <button key={s} onClick={() => {
                      setTeacherSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
                    }} className={"px-3 py-2 rounded-xl text-xs font-semibold transition-colors " +
                      (teacherSubjects.includes(s) ? "bg-accent-700 text-white" : "bg-accent-50 text-primary-500")}>
                      {SUBJECT_LABELS[s] || s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => {
              localStorage.setItem("teacherGrades", JSON.stringify(teacherGrades));
              localStorage.setItem("teacherSubjects", JSON.stringify(teacherSubjects));
              scheduleProfileSync();
              if (teacherGrades.length > 0) setSelectedGrade(teacherGrades[0]);
              if (teacherSubjects.length > 0) setSelectedSubject(teacherSubjects[0]);
              setShowGradeModal(false);
            }} className="w-full py-3 rounded-xl bg-accent-700 text-white font-semibold text-sm mt-2">
              {"\u2705"} Save
            </button>
            <button onClick={() => setShowGradeModal(false)} className="w-full mt-2 py-2 text-sm text-primary-300">Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
}
