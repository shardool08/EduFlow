"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getAllLessons, getAssessmentGroups } from "@/lib/curriculum";
import type { BalbharatiLesson } from "@/lib/curriculum";
import { savePlan } from "@/lib/plan-storage";
import { getEmoji } from "@/lib/emoji-map";
import { TLM_RESOURCES, loadTeacherTlms } from "@/lib/tlm";
import { useAuthGuard } from "@/lib/auth";

function getLang() {
  if (typeof window === "undefined") return "mr";
  return localStorage.getItem("lang") || "mr";
}
function ls(key: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) || "";
}

const HOOK_OPTIONS: Record<string, { label: string; icon: string }[]> = {
  poem: [
    { label: "Recite with actions", icon: "\uD83C\uDFAD" },
    { label: "Sing together", icon: "\uD83C\uDFA4" },
    { label: "Listen & repeat", icon: "\uD83D\uDC42" },
    { label: "Picture discussion", icon: "\uD83D\uDDBC\uFE0F" },
  ],
  song: [
    { label: "Sing with actions", icon: "\uD83C\uDFA4" },
    { label: "Clap rhythm first", icon: "\uD83D\uDC4F" },
    { label: "Listen then join", icon: "\uD83C\uDFA7" },
    { label: "Dance along", icon: "\uD83D\uDC83" },
  ],
  story: [
    { label: "Show cover & predict", icon: "\uD83D\uDCDA" },
    { label: "Ask a question", icon: "\u2753" },
    { label: "Act out a scene", icon: "\uD83C\uDFAD" },
    { label: "Show key picture", icon: "\uD83D\uDDBC\uFE0F" },
  ],
  phonics: [
    { label: "Sound game", icon: "\uD83D\uDD0A" },
    { label: "Letter song", icon: "\uD83C\uDFA4" },
    { label: "Spot the letter", icon: "\uD83D\uDD0D" },
    { label: "Air writing", icon: "\u270D\uFE0F" },
  ],
  conversation: [
    { label: "Role-play starter", icon: "\uD83C\uDFAD" },
    { label: "Real-life question", icon: "\uD83D\uDCAC" },
    { label: "Show & tell", icon: "\uD83D\uDCE6" },
    { label: "Simon says game", icon: "\uD83D\uDE46" },
  ],
  "picture-talk": [
    { label: "Show picture & ask", icon: "\uD83D\uDDBC\uFE0F" },
    { label: "I spy game", icon: "\uD83D\uDD0D" },
    { label: "Guess what's next", icon: "\u2753" },
    { label: "Describe & draw", icon: "\uD83C\uDFA8" },
  ],
};

const TEACHING_OPTIONS = [
  { label: "Show → Say → Repeat (drill)", icon: "\uD83D\uDD01" },
  { label: "Tell a story around it", icon: "\uD83D\uDCDA" },
  { label: "Act out / TPR", icon: "\uD83C\uDFAD" },
  { label: "Picture walk & discuss", icon: "\uD83D\uDDBC\uFE0F" },
  { label: "Discovery — students explore first", icon: "\uD83D\uDD0D" },
  { label: "Board work — write & explain", icon: "\uD83D\uDCDD" },
];

const PRACTICE_OPTIONS = [
  { label: "Whole class together", icon: "\uD83D\uDC65", desc: "Everyone practises at once" },
  { label: "Pair work", icon: "\uD83D\uDC6B", desc: "Students help each other" },
  { label: "Small groups (4-5)", icon: "\uD83D\uDC6A", desc: "Collaborative learning" },
  { label: "Individual practice", icon: "\uD83E\uDDD1", desc: "Each student works alone" },
  { label: "Game / competition", icon: "\uD83C\uDFC6", desc: "Fun competitive activity" },
];

const ASSESS_OPTIONS = [
  { label: "Oral questions", icon: "\uD83D\uDDE3\uFE0F", desc: "Quick verbal check" },
  { label: "Show me game", icon: "\u270B", desc: "Students hold up answers" },
  { label: "Exit ticket", icon: "\uD83C\uDFAB", desc: "Write 1 thing before leaving" },
  { label: "Peer check", icon: "\uD83D\uDC6B", desc: "Partners test each other" },
  { label: "Worksheet", icon: "\uD83D\uDCC4", desc: "Written practice to check" },
];

const TLM_LIST = TLM_RESOURCES.map((r) => ({
  id: r.id,
  label: r.label,
  icon: r.id === "blackboard" ? "\uD83D\uDCDD" : r.id === "flashcards" ? "\uD83C\uDCCF" : r.id === "chart" ? "\uD83D\uDCCA" : r.id === "textbook" ? "\uD83D\uDCDA" : r.id === "notebook" ? "\uD83D\uDCD3" : r.id === "phone" ? "\uD83D\uDCF1" : r.id === "projector" ? "\uD83D\uDCFA" : r.id === "puppets" ? "\uD83E\uDDF8" : r.id === "ball" ? "\u26BD" : "\uD83D\uDCE6",
}));

export default function QuickPlanPage() {
  const router = useRouter();
  useAuthGuard();
  const params = useParams();
  const searchParams = useSearchParams();
  const lessonId = params.id as string;
  const day = parseInt(searchParams.get("day") || "1");
  const mode = searchParams.get("mode") as "practice" | "reteach" | "continue" | null;

  const [lesson, setLesson] = useState<BalbharatiLesson | null>(null);
  const [dayInfo, setDayInfo] = useState<any>(null);

  // Form state
  const [goal, setGoal] = useState("");
  const [hook, setHook] = useState("");
  const [tlms, setTlms] = useState<Set<string>>(new Set(["blackboard", "textbook", "notebook"]));
  const [teaching, setTeaching] = useState("");
  const [practice, setPractice] = useState("");
  const [assessment, setAssessment] = useState("");
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const allLessons = getAllLessons();
    const found = allLessons.find(l => l.id === lessonId);
    if (found) {
      setLesson(found);
      const di = found.bloomsProgression.find(bp => bp.day === day);
      setDayInfo(di);
      if (di) setGoal(di.focus);
    }
    // Load saved TLMs from registration
    setTlms(new Set(loadTeacherTlms()));
  }, [lessonId, day]);

  const toggleTlm = (id: string) => {
    const next = new Set(tlms);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setTlms(next);
  };

  const isReady = hook && teaching && practice && assessment;

  const generatePlan = async () => {
    if (!lesson || !isReady) return;
    setGenerating(true);
    setError("");

    const planData: Record<string, string> = {
      goal,
      hook,
      tlms: Array.from(tlms).join(", "),
      teaching,
      practice,
      assessment,
      notes,
    };
    const teacherProfile = {
      name: ls("teacherName"),
      medium: ls("medium"),
      studentCount: ls("studentCount") || "35",
      seating: ls("seatingArrangement") || "Rows",
      resources: Array.from(tlms).join(", "),
      language: getLang(),
      comfort: ls("englishComfort"),
    };

    try {
      const r = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          day,
          selections: planData,
          teacherProfile,
          mode: mode || undefined,
        }),
      });
      if (!r.ok) {
        setError("Could not generate plan. Please try again.");
        setGenerating(false);
        return;
      }
      const data = await r.json();

      if (data.plan) {
        const phases = [
          { title: "Goal", emoji: "\uD83C\uDFAF", selection: goal, detail: goal },
          { title: "Hook", emoji: "\uD83C\uDF1F", selection: hook, detail: hook },
          { title: "TLM", emoji: "\uD83D\uDCCB", selection: Array.from(tlms).join(", "), detail: Array.from(tlms).join(", ") },
          { title: "Teaching", emoji: "\uD83D\uDC69\u200D\uD83C\uDFEB", selection: teaching, detail: teaching },
          { title: "Practice", emoji: "\u270F\uFE0F", selection: practice, detail: practice },
          { title: "Assessment", emoji: "\uD83D\uDCCA", selection: assessment, detail: assessment },
          { title: "Notes", emoji: "\uD83D\uDCDD", selection: notes, detail: notes },
        ];
        savePlan(lesson.id, day, planData, phases, data.plan);
        // Navigate to plan view
        router.push("/plan-view/" + lesson.id + "?day=" + day + "&from=quick-plan");
      } else {
        setError("Could not generate plan. Please try again.");
        setGenerating(false);
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setGenerating(false);
    }
  };

  if (!lesson) {
    return (
      <main className="flex flex-col min-h-screen bg-white">
        <header className="bg-white border-b border-[#D0EAE4] px-5 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-primary-400 text-lg">{"\u2190"}</button>
          <h1 className="text-base font-bold text-primary-800">Lesson not found</h1>
        </header>
      </main>
    );
  }

  const hookOptions = HOOK_OPTIONS[lesson.type] || HOOK_OPTIONS.conversation;

  const modeBanner =
    mode === "practice"
      ? { title: "Extra practice day", desc: "Students struggled — we'll plan a simpler repeat activity." }
      : mode === "reteach"
        ? { title: "Re-teach this day", desc: "Most didn't understand — we'll use an easier approach." }
        : mode === "continue"
          ? { title: "Continue where you left off", desc: "Pick up the rest of today's lesson." }
          : null;

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#D0EAE4] px-5 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-primary-400 text-lg">{"\u2190"}</button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-primary-800 truncate">{lesson.id}: {lesson.en}</p>
            <p className="text-xs text-primary-300">Day {day} {"\u2022"} {dayInfo?.level || ""} {"\u2022"} Plan your lesson</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-accent-50 text-accent-800 font-semibold shrink-0">1 API call</span>
        </div>
      </header>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-32">
        {modeBanner && (
          <div className="mb-5 bg-warm-50 border border-warm-300 rounded-xl px-4 py-3">
            <p className="text-sm font-bold text-warm-900">{modeBanner.title}</p>
            <p className="text-xs text-warm-700 mt-0.5">{modeBanner.desc}</p>
          </div>
        )}
        {/* Section 1: Goal */}
        <section className="mb-6">
          <p className="text-sm font-bold text-primary-800 mb-1">{"\uD83C\uDFAF"} Today's goal</p>
          <p className="text-xs text-primary-300 mb-3">What students should achieve by end of class</p>
          <div className="bg-accent-50 rounded-xl border border-[#D0EAE4] px-4 py-3">
            <p className="text-sm text-primary-700">{dayInfo?.focus || "Set the lesson objective"}</p>
            <p className="text-xs text-accent-700 mt-1 font-semibold">{dayInfo?.level || "Remember"} level {"\u2022"} {lesson.type}</p>
          </div>
        </section>

        {/* Section 2: Hook */}
        <section className="mb-6">
          <p className="text-sm font-bold text-primary-800 mb-1">{"\uD83C\uDF1F"} How will you start?</p>
          <p className="text-xs text-primary-300 mb-3">First 2-3 minutes to grab attention</p>
          <div className="grid grid-cols-2 gap-2">
            {hookOptions.map(opt => (
              <button
                key={opt.label}
                onClick={() => setHook(opt.label)}
                className={`p-3 rounded-xl border-2 text-start transition-all ${
                  hook === opt.label
                    ? "border-accent-700 bg-accent-50"
                    : "border-[#D0EAE4] bg-white"
                }`}
              >
                <span className="text-xl block mb-1">{opt.icon}</span>
                <span className={`text-xs font-semibold ${hook === opt.label ? "text-accent-800" : "text-primary-600"}`}>{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Section 3: TLM Audit */}
        <section className="mb-6">
          <p className="text-sm font-bold text-primary-800 mb-1">{"\uD83D\uDCCB"} What's available in your class?</p>
          <p className="text-xs text-primary-300 mb-3">Tick what you have — plan adapts to your resources</p>
          <div className="space-y-1.5">
            {TLM_LIST.map(tlm => {
              const checked = tlms.has(tlm.id);
              return (
                <button
                  key={tlm.id}
                  onClick={() => toggleTlm(tlm.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-start ${
                    checked
                      ? "border-accent-700 bg-accent-50"
                      : "border-[#D0EAE4] bg-white"
                  }`}
                >
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-xs shrink-0 ${
                    checked ? "bg-accent-700 text-white" : "border border-primary-200"
                  }`}>
                    {checked ? "\u2713" : ""}
                  </span>
                  <span className="text-sm shrink-0">{tlm.icon}</span>
                  <span className={`text-sm ${checked ? "text-accent-800 font-medium" : "text-primary-600"}`}>{tlm.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 4: Teaching approach */}
        <section className="mb-6">
          <p className="text-sm font-bold text-primary-800 mb-1">{"\uD83D\uDCDA"} How will you teach?</p>
          <p className="text-xs text-primary-300 mb-3">Main teaching method for the core content</p>
          <div className="space-y-2">
            {TEACHING_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => setTeaching(opt.label)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-start transition-all ${
                  teaching === opt.label
                    ? "border-accent-700 bg-accent-50"
                    : "border-[#D0EAE4] bg-white"
                }`}
              >
                <span className="text-lg shrink-0">{opt.icon}</span>
                <span className={`text-sm ${teaching === opt.label ? "text-accent-800 font-semibold" : "text-primary-600"}`}>{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Section 5: Practice style */}
        <section className="mb-6">
          <p className="text-sm font-bold text-primary-800 mb-1">{"\uD83D\uDC65"} How will students practise?</p>
          <p className="text-xs text-primary-300 mb-3">Choose the practice format</p>
          <div className="space-y-2">
            {PRACTICE_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => setPractice(opt.label)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-start transition-all ${
                  practice === opt.label
                    ? "border-accent-700 bg-accent-50"
                    : "border-[#D0EAE4] bg-white"
                }`}
              >
                <span className="text-lg shrink-0">{opt.icon}</span>
                <div>
                  <span className={`text-sm block ${practice === opt.label ? "text-accent-800 font-semibold" : "text-primary-600"}`}>{opt.label}</span>
                  <span className="text-xs text-primary-300">{opt.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Section 6: Assessment */}
        <section className="mb-6">
          <p className="text-sm font-bold text-primary-800 mb-1">{"\u2705"} How will you check understanding?</p>
          <p className="text-xs text-primary-300 mb-3">Quick assessment at the end</p>
          <div className="space-y-2">
            {ASSESS_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => setAssessment(opt.label)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-start transition-all ${
                  assessment === opt.label
                    ? "border-accent-700 bg-accent-50"
                    : "border-[#D0EAE4] bg-white"
                }`}
              >
                <span className="text-lg shrink-0">{opt.icon}</span>
                <div>
                  <span className={`text-sm block ${assessment === opt.label ? "text-accent-800 font-semibold" : "text-primary-600"}`}>{opt.label}</span>
                  <span className="text-xs text-primary-300">{opt.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Section 7: Notes (optional) */}
        <section className="mb-6">
          <p className="text-sm font-bold text-primary-800 mb-1">{"\uD83D\uDCDD"} Anything specific? <span className="font-normal text-primary-300">(optional)</span></p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. 5 students are very weak, focus on them. Or: skip writing today, students forgot notebooks..."
            className="w-full border border-[#D0EAE4] rounded-xl px-4 py-3 text-sm text-primary-700 placeholder:text-primary-200 outline-none focus:border-accent-500 resize-none"
            rows={3}
          />
        </section>

        {/* Vocabulary preview */}
        <section className="mb-6">
          <p className="text-sm font-bold text-primary-800 mb-2">{"\uD83D\uDCDA"} Vocabulary for this lesson</p>
          <div className="flex flex-wrap gap-1.5">
            {lesson.vocabulary.slice(0, 10).map((w, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-warm-50 border border-warm-200 text-xs text-warm-800">
                <span>{getEmoji(w)}</span> {w}
              </span>
            ))}
            {lesson.vocabulary.length > 10 && (
              <span className="text-xs text-primary-300 self-center">+{lesson.vocabulary.length - 10} more</span>
            )}
          </div>
        </section>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D0EAE4] px-5 py-4 shadow-lg">
        <div className="max-w-[480px] mx-auto">
          {error && (
            <p className="text-xs text-red-500 mb-2 text-center">{error}</p>
          )}

          {!isReady && (
            <p className="text-xs text-primary-300 text-center mb-2">
              Pick: {!hook ? "hook" : ""}{!hook && (!teaching || !practice || !assessment) ? ", " : ""}
              {!teaching ? "teaching approach" : ""}{!teaching && (!practice || !assessment) ? ", " : ""}
              {!practice ? "practice style" : ""}{!practice && !assessment ? ", " : ""}
              {!assessment ? "assessment" : ""}
            </p>
          )}

          <button
            onClick={generatePlan}
            disabled={!isReady || generating}
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
              isReady && !generating
                ? "bg-accent-700 text-white active:bg-accent-800"
                : "bg-accent-100 text-primary-300"
            }`}
          >
            {generating ? "\u23F3 Creating your lesson plan..." : "\u2728 Generate My Lesson Plan"}
          </button>

          {isReady && !generating && (
            <p className="text-[10px] text-primary-200 text-center mt-2">Uses 1 API call {"\u2022"} Takes ~10 seconds</p>
          )}
        </div>
      </div>
    </main>
  );
}
