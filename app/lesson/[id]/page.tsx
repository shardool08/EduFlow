"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { findLessonById } from "@/lib/lesson-utils";
import { getAllAssessmentGroups } from "@/lib/curriculum";
import { useAuthGuard } from "@/lib/auth";
import { translations } from "@/lib/translations";
import type { Language } from "@/lib/translations";
import { getPlan, getLessonStatus, completePlan, getNextAction } from "@/lib/plan-storage";
import type { SavedPlan } from "@/lib/plan-storage";
import { getLessonFlashcards } from "@/lib/flashcards";
import { FlashcardVisual } from "@/components/FlashcardVisual";

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

const BLOOMS_STYLE: Record<string, string> = {
  "Remember": "bg-accent-50 text-blue-700 border-blue-200",
  "Understand": "bg-amber-50 text-amber-700 border-amber-200",
  "Apply": "bg-accent-50 text-accent-800 border-accent-300",
  "Remember & Apply": "bg-violet-50 text-violet-700 border-violet-200",
  "Understand & Apply": "bg-orange-50 text-orange-700 border-orange-200",
};

const STATUS_BADGE: Record<string, { label: string; style: string }> = {
  not_started: { label: "\u25CB Not Started", style: "bg-primary-50 text-primary-400" },
  planned: { label: "\uD83D\uDCDD Planned", style: "bg-accent-50 text-accent-800" },
  in_progress: { label: "\u25B6\uFE0F In Progress", style: "bg-warm-100 text-warm-800" },
  completed: { label: "\u2705 Completed", style: "bg-accent-100 text-accent-900" },
};

const DAY_STATUS: Record<string, { icon: string; style: string }> = {
  not_started: { icon: "\u25CB", style: "bg-primary-50 text-primary-300 border-primary-200" },
  planned: { icon: "\uD83D\uDCDD", style: "bg-accent-50 text-accent-700 border-[#D0EAE4]" },
  completed: { icon: "\u2705", style: "bg-accent-100 text-accent-800 border-accent-300" },
};

export default function LessonDetailPage() {
  const router = useRouter();
  useAuthGuard();
  const params = useParams();
  const [lang, setLang] = useState<Language>("mr");
  const [dayPlans, setDayPlans] = useState<Record<number, SavedPlan>>({});
  const [lessonSt, setLessonSt] = useState<string>("not_started");
  const [feedbackDay, setFeedbackDay] = useState<number | null>(null);
  const [nextAction, setNextAction] = useState<any>(null);

  const lessonId = params.id as string;
  const lesson = findLessonById(lessonId);
  const group = lesson ? Object.entries(getAllAssessmentGroups()).find(([_, g]) => g.lessons.includes(lesson.id)) : undefined;
  const groupData = group ? group[1] : null;

  const refreshData = () => {
    if (!lesson) return;
    const plans: Record<number, SavedPlan> = {};
    for (let d = 1; d <= lesson.days; d++) { plans[d] = getPlan(lessonId, d); }
    setDayPlans(plans);
    setLessonSt(getLessonStatus(lessonId, lesson.days));
  };

  useEffect(() => {
    setLang(getLang());
    refreshData();
  }, [lessonId]);

  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") refreshData(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [lessonId]);

  const handleComplete = (d: number) => {
    setFeedbackDay(d);
  };

  const submitFeedback = (fb: "went_well" | "some_struggled" | "most_didnt_understand" | "couldnt_finish" | "ready_for_more") => {
    if (feedbackDay === null || !lesson) return;
    completePlan(lessonId, feedbackDay, fb);
    const next = getNextAction(lessonId, feedbackDay, fb, lesson.days);
    setNextAction(next);
    setFeedbackDay(null);
    refreshData();
  };

  const isRtl = lang === "ur";

  if (!lesson) {
    return (
      <main className="flex flex-col min-h-screen bg-white">
        <header className="bg-white border-b border-[#D0EAE4] px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-primary-500 text-lg">{"\u2190"}</button>
          <h1 className="text-lg font-bold flex-1 text-center text-primary-800">Lesson not found</h1>
        </header>
        <div className="flex-1 flex items-center justify-center text-primary-300">Lesson {lessonId} not found</div>
      </main>
    );
  }

  const badge = STATUS_BADGE[lessonSt];

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="flex flex-col min-h-screen bg-white">
      {/* Header — white with seaside border */}
      <header className="bg-white border-b border-[#D0EAE4] px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/home")} className="text-primary-400 text-lg">{"\u2190"}</button>
          <div className="flex-1 text-center">
            <p className="text-xs text-primary-300 uppercase tracking-wider">Lesson {lesson.id}</p>
            <h1 className="text-lg font-bold leading-tight text-primary-800">{lesson.en}</h1>
            <p className="text-sm text-primary-400 mt-0.5">{lesson[lang]}</p>
          </div>
          <div className="w-8 shrink-0" />
        </div>
      </header>

      {/* Info pills */}
      <div className="px-5 py-3 flex flex-wrap gap-2">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-white border border-[#D0EAE4] text-primary-500 shadow-sm">{lesson.type}</span>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-white border border-[#D0EAE4] text-primary-500 shadow-sm">p. {lesson.pages}</span>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-white border border-[#D0EAE4] text-primary-500 shadow-sm">{lesson.days} days</span>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-white border border-[#D0EAE4] text-primary-500 shadow-sm">Unit {lesson.unit}</span>
        <span className={"text-xs font-semibold px-3 py-1 rounded-full " + badge.style}>{badge.label}</span>
      </div>

      {/* Next action recommendation */}
      {nextAction && (
        <div className="mx-5 mb-4 bg-primary-500 rounded-xl p-4 text-white">
          <p className="text-xs text-primary-300 uppercase tracking-wider mb-1">Recommended next step</p>
          <p className="text-base font-bold mb-1">{nextAction.label}</p>
          <p className="text-sm text-white/70 mb-3">{nextAction.description}</p>
          <div className="flex gap-2">
            <button onClick={() => { router.push(nextAction.route); setNextAction(null); }} className="flex-1 py-2.5 rounded-xl bg-white text-primary-700 font-semibold text-sm">{nextAction.label} {"\u2192"}</button>
            <button onClick={() => setNextAction(null)} className="py-2.5 px-4 rounded-xl border border-white/30 text-white/80 text-sm">Dismiss</button>
          </div>
        </div>
      )}

      <div className="flex-1 px-5 pb-10 space-y-6">
        {/* Day-wise plan section */}
        <section>
          <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-3">Day-wise Learning Plan</p>
          <div className="space-y-3">
            {lesson.bloomsProgression.map((bp) => {
              const style = BLOOMS_STYLE[bp.level] || "bg-gray-50 text-gray-600 border-gray-200";
              const plan = dayPlans[bp.day];
              const dayStatus = plan?.status || "not_started";
              const ds = DAY_STATUS[dayStatus];

              return (
                <div key={bp.day} className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                    <span className={"w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border " + ds.style}>{ds.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-primary-800">Day {bp.day}</p>
                        <span className={"text-xs font-semibold px-2 py-0.5 rounded-full border " + style}>{bp.level}</span>
                      </div>
                      {dayStatus !== "not_started" && (
                        <p className="text-xs text-primary-300 mt-0.5">
                          {dayStatus === "planned" && plan?.savedAt ? "Planned " + new Date(plan.savedAt).toLocaleDateString() : ""}
                          {dayStatus === "completed" && plan?.completedAt ? "Completed " + new Date(plan.completedAt).toLocaleDateString() : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-4 pb-3">
                    <p className="text-sm text-primary-600 leading-relaxed">{bp.focus}</p>
                  </div>

                  {dayStatus === "completed" && plan?.feedback && (
                    <div className="mx-4 mb-3 bg-accent-50 rounded-lg p-2.5 border border-[#D0EAE4]">
                      <p className="text-xs font-semibold text-accent-800">
                        {plan.feedback === "went_well" ? "\uD83D\uDE0A Went well" : plan.feedback === "some_struggled" ? "\uD83E\uDD14 Some struggled" : plan.feedback === "most_didnt_understand" ? "\uD83D\uDE1F Most didn't understand" : plan.feedback === "couldnt_finish" ? "\u23F0 Couldn't finish" : "\uD83D\uDE80 Ready for more"}
                      </p>
                    </div>
                  )}

                  <div className="px-4 pb-4">
                    {/* Not started */}
                    {dayStatus === "not_started" && (
                      <button onClick={() => router.push("/quick-plan/" + lesson.id + "?day=" + bp.day)} className="w-full min-h-11 rounded-xl bg-accent-700 text-white text-sm font-semibold flex items-center justify-center gap-1 active:bg-accent-800">
                        {"\u2728"} Plan Day {bp.day} {"\u2192"}
                      </button>
                    )}

                    {/* Planned */}
                    {dayStatus === "planned" && (
                      <div className="flex gap-2">
                        <button onClick={() => router.push("/plan-view/" + lesson.id + "?day=" + bp.day)} className="flex-1 min-h-11 rounded-xl border-2 border-primary-500 text-primary-500 text-sm font-semibold flex items-center justify-center gap-1">
                          {"\uD83D\uDCC4"} View Plan
                        </button>
                        <button onClick={() => handleComplete(bp.day)} className="flex-1 min-h-11 rounded-xl bg-accent-700 text-white text-sm font-semibold flex items-center justify-center gap-1">
                          {"\u2705"} Completed
                        </button>
                      </div>
                    )}

                    {/* Completed */}
                    {dayStatus === "completed" && (
                      <div className="flex gap-2">
                        <button onClick={() => router.push("/plan-view/" + lesson.id + "?day=" + bp.day)} className="flex-1 min-h-11 rounded-xl border border-[#D0EAE4] text-primary-500 text-sm font-semibold flex items-center justify-center">
                          View Plan
                        </button>
                        <button onClick={() => router.push("/quick-plan/" + lesson.id + "?day=" + bp.day)} className="flex-1 min-h-11 rounded-xl border border-[#D0EAE4] text-primary-500 text-sm font-semibold flex items-center justify-center">
                          Re-plan
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Competencies */}
        {lesson.competencies.length > 0 && (
          <section>
            <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-3">What Students Will Learn</p>
            <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm px-4 py-4 space-y-2.5">
              {lesson.competencies.map((comp: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-accent-100 text-accent-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-sm text-primary-600 leading-relaxed">{comp}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Vocabulary Flashcards — lesson set, use on any day */}
        {lesson.vocabulary.length > 0 && (() => {
          const lessonCards = getLessonFlashcards(lesson, lang);
          return (
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider">Lesson Flashcards</p>
              <span className="text-xs text-accent-700 font-semibold">{lessonCards.length} cards</span>
            </div>
            <p className="text-xs text-primary-400 mb-2">Use on Day 1 or Day 2 — teacher chooses when to print.</p>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {lessonCards.map((card, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#D0EAE4] p-2 text-center shadow-sm">
                  <FlashcardVisual word={card.word} emoji={card.emoji} imageUrl={card.imageUrl} emojiClassName="text-xl block" imgClassName="w-10 h-10 mx-auto object-contain" />
                  <p className="text-[10px] font-bold text-primary-800 mt-0.5 capitalize truncate">{card.word}</p>
                  {card.meaning && <p className="text-[9px] text-primary-400 truncate">{card.meaning}</p>}
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                localStorage.setItem("flashcards_to_print", JSON.stringify(lessonCards));
                router.push("/flashcards?lesson=" + lesson.id);
              }}
              className="w-full py-3 rounded-xl bg-accent-700 text-white font-semibold text-sm flex items-center justify-center gap-2 active:bg-accent-800"
            >
              {"\uD83D\uDDA8\uFE0F"} Select & Print Flashcards
            </button>
          </section>
          );
        })()}

        {/* Language Structures */}
        {lesson.structures.length > 0 && (
          <section>
            <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-3">Language Structures</p>
            <div className="space-y-2">
              {lesson.structures.map((s: string, i: number) => (
                <div key={i} className="bg-accent-50 rounded-xl border border-[#D0EAE4] shadow-sm px-4 py-3 font-mono text-sm text-primary-700">{s}</div>
              ))}
            </div>
          </section>
        )}

        {/* Assessment Group */}
        {groupData && (
          <section>
            <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-3">Assessment Group</p>
            <div className="bg-warm-50 rounded-xl border border-warm-200 shadow-sm px-4 py-4">
              <p className="text-base font-semibold text-warm-800">{groupData.name}</p>
              <p className="text-sm text-primary-400 mt-1">{groupData.focus}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {groupData.lessons.map((lid: string) => {
                  const l = findLessonById(lid);
                  return (<span key={lid} className={"px-2 py-0.5 rounded text-xs font-semibold " + (lid === lessonId ? "bg-warm-300 text-warm-900" : "bg-warm-100 text-warm-700")}>{lid} {l?.en}</span>);
                })}
              </div>
              <p className="text-xs text-warm-500 mt-2">Assessment after completing all lessons in this group</p>
            </div>
          </section>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackDay !== null && (
        <div className="fixed inset-0 bg-black/50 z-20 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-[480px] p-5 pb-8 animate-slide-up">
            <div className="w-10 h-1 bg-primary-200 rounded-full mx-auto mb-4"></div>
            <p className="text-base font-bold text-primary-800 mb-1">
              {lang === "mr" ? "\u0906\u091C\u091A\u093E \u0935\u0930\u094D\u0917 \u0915\u0938\u093E \u0917\u0947\u0932\u093E?" : lang === "hi" ? "\u0906\u091C \u0915\u093E \u0915\u094D\u0932\u093E\u0938 \u0915\u0948\u0938\u093E \u0930\u0939\u093E?" : "How did today's class go?"}
            </p>
            <p className="text-xs text-primary-300 mb-4">
              {lang === "mr" ? "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0909\u0924\u094D\u0924\u0930\u093E\u0935\u0930\u0942\u0928 \u092A\u0941\u0922\u091A\u093E \u0927\u0921\u093E \u0920\u0930\u0935\u0942" : "Your feedback helps plan the next lesson"}
            </p>
            <div className="space-y-2">
              <button onClick={() => submitFeedback("went_well")} className="w-full text-left p-3.5 rounded-xl border-2 border-accent-300 bg-accent-50 active:bg-accent-100">
                <p className="text-sm font-semibold text-primary-800">{"\uD83D\uDE0A"} Went well</p>
                <p className="text-xs text-primary-400 mt-0.5">Students understood the lesson</p>
              </button>
              <button onClick={() => submitFeedback("some_struggled")} className="w-full text-left p-3.5 rounded-xl border-2 border-warm-300 bg-warm-50 active:bg-warm-100">
                <p className="text-sm font-semibold text-primary-800">{"\uD83E\uDD14"} Some struggled</p>
                <p className="text-xs text-primary-400 mt-0.5">A few students need more practice</p>
              </button>
              <button onClick={() => submitFeedback("most_didnt_understand")} className="w-full text-left p-3.5 rounded-xl border-2 border-red-200 bg-red-50 active:bg-red-100">
                <p className="text-sm font-semibold text-primary-800">{"\uD83D\uDE1F"} Most didn't understand</p>
                <p className="text-xs text-primary-400 mt-0.5">Need to re-teach with simpler approach</p>
              </button>
              <button onClick={() => submitFeedback("couldnt_finish")} className="w-full text-left p-3.5 rounded-xl border-2 border-blue-200 bg-accent-50 active:bg-blue-100">
                <p className="text-sm font-semibold text-primary-800">{"\u23F0"} Couldn't finish</p>
                <p className="text-xs text-primary-400 mt-0.5">Ran out of time, need to continue</p>
              </button>
              <button onClick={() => submitFeedback("ready_for_more")} className="w-full text-left p-3.5 rounded-xl border-2 border-violet-200 bg-violet-50 active:bg-violet-100">
                <p className="text-sm font-semibold text-primary-800">{"\uD83D\uDE80"} Ready for more!</p>
                <p className="text-xs text-primary-400 mt-0.5">Students were ahead, can move faster</p>
              </button>
            </div>
            <button onClick={() => setFeedbackDay(null)} className="w-full mt-3 py-2.5 text-sm text-primary-300 font-medium">Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
}
