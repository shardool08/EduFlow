"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getAllLessons } from "@/lib/curriculum";
import { getEmoji as getEmojiForPlan } from "@/lib/emoji-map";
import { translations } from "@/lib/translations";
import type { Language } from "@/lib/translations";
import { savePlan, completePlan, getPlan, getNextAction } from "@/lib/plan-storage";
import type { SavedPlan, PlanPhase } from "@/lib/plan-storage";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  options?: { id: string; label: string; description?: string }[];
  optionType?: "single" | "checklist" | "confirm";
  materials?: { type: "flashcards" | "worksheet"; items: any[] };
};
type TLMItem = { id: string; name: string; hasIt: boolean | null };

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

export default function PlanPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const lessonId = params.id as string;
  const day = parseInt(searchParams.get("day") || "1");
  const lesson = getAllLessons().find(l => l.id === lessonId) || getAllLessons()[0];
  const dayInfo = lesson.bloomsProgression.find(b => b.day === day);

  const [lang, setLang] = useState<Language>("mr");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showKb, setShowKb] = useState(false);
  const [phase, setPhase] = useState(1);
  const [planData, setPlanData] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [nextAction, setNextAction] = useState<ReturnType<typeof getNextAction> | null>(null);
  const [tlmList, setTlmList] = useState<TLMItem[]>([]);
  const [missingTlms, setMissingTlms] = useState<string[]>([]);
  const [existingPlan, setExistingPlan] = useState<SavedPlan | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLang(getLang());
    const existing = getPlan(lessonId, day);
    setExistingPlan(existing);
    if (existing.status === "planned" && existing.planData) {
      setPlanData(existing.planData);
      setMessages([{ role: "assistant", content: lang === "mr"
        ? "\u0924\u0941\u092E\u091A\u093E \u092F\u093E \u0926\u093F\u0935\u0938\u093E\u091A\u093E plan \u0906\u0927\u0940\u091A save \u0906\u0939\u0947. \u0924\u094B \u0935\u093E\u092A\u0930\u093E\u092F\u091A\u093E \u0915\u093E?"
        : "You have a saved plan for this day. Use it or start fresh?",
        options: [
          { id: "use_saved", label: "\u2705 Use saved plan" },
          { id: "start_fresh", label: "\u270F Plan again from scratch" },
        ], optionType: "single" }]);
      setLoading(false);
    } else {
      startConvo();
    }
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const prof = () => ({
    name: localStorage.getItem("teacherName") || "", school: localStorage.getItem("schoolName") || "",
    district: localStorage.getItem("district") || "", adminType: localStorage.getItem("adminType") || "",
    medium: localStorage.getItem("medium") || "", englishComfort: localStorage.getItem("englishComfort") || "stumbling",
    studentCount: localStorage.getItem("studentCount") || "30", resources: localStorage.getItem("teacherResources") || "Blackboard",
    location: localStorage.getItem("location") || "", seating: localStorage.getItem("seatingArrangement") || "",
    printing: localStorage.getItem("printingAccess") || "", internet: localStorage.getItem("internetAccess") || "",
    socioEconomic: localStorage.getItem("socioEconomic") || "", firstGen: localStorage.getItem("firstGenLearners") || "",
    parental: localStorage.getItem("parentalInvolvement") || "", language: localStorage.getItem("lang") || "mr",
  });

  const callAI = async (msgs: Message[], p: number, sel?: string) => {
    try {
      const c = msgs.filter(m => m.role !== "system").map(m => ({ role: m.role, content: m.content }));
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, day, phase: p, selection: sel, planSoFar: planData, messages: c, teacherProfile: prof() }) });
      return (await r.json()).message;
    } catch { return "Connection error."; }
  };

  const mkTlm = (): TLMItem[] => {
    const v = lesson.vocabulary.slice(0, 8);
    const l: TLMItem[] = [];
    if (["song","poem","conversation","picture-talk"].includes(lesson.type)) l.push({ id: "fc", name: "Flashcards: " + v.join(", "), hasIt: null });
    if (lesson.type === "picture-talk") l.push({ id: "pc", name: "Picture chart for " + lesson.en, hasIt: null });
    if (lesson.type === "story") l.push({ id: "sp", name: "Story sequence pictures", hasIt: null });
    if (lesson.type === "phonics") l.push({ id: "lc", name: "Letter cards", hasIt: null });
    l.push({ id: "bb", name: "Blackboard / whiteboard", hasIt: null });
    return l;
  };

  const opts = (p: number) => {
    const cs = parseInt(prof().studentCount) || 30;
    if (p === 1) return { t: "single" as const, o: [
      { id: "o1", label: lesson.vocabulary.slice(0,4).join(", "), description: "Children say these words" },
      { id: "o2", label: lesson.structures[0] || "Sentences", description: "Children use this structure" },
      { id: "o3", label: "Both words + sentences", description: "Vocabulary and sentences" }] };
    if (p === 2) {
      const h = lesson.type === "song" || lesson.type === "poem"
        ? [{ id: "h1", label: "\uD83C\uDFB5 Song/rhyme" }, { id: "h2", label: "\uD83D\uDDBC Picture+question" }]
        : lesson.type === "story"
        ? [{ id: "h1", label: "\uD83D\uDDBC Picture+predict" }, { id: "h2", label: "\uD83C\uDFAD Act a scene" }]
        : [{ id: "h1", label: "\u2753 Question" }, { id: "h2", label: "\uD83D\uDDBC Show+tell" }, { id: "h3", label: "\u270B TPR" }];
      return { t: "single" as const, o: h }; }
    if (p === 3) return { t: "checklist" as const, o: [] };
    if (p === 4) {
      const a = lesson.type === "song" || lesson.type === "poem"
        ? [{ id: "a1", label: "\uD83C\uDFB5 Sing+act" }, { id: "a2", label: "\uD83C\uDFAE Flashcard game" }, { id: "a3", label: "\u270B Point+say" }]
        : lesson.type === "story"
        ? [{ id: "a1", label: "\uD83C\uDFAD Act out" }, { id: "a2", label: "\uD83D\uDDBC Sequence" }, { id: "a3", label: "\uD83D\uDDE3 Retell" }]
        : [{ id: "a1", label: "\uD83C\uDFAE Match" }, { id: "a2", label: "\u270B TPR" }, { id: "a3", label: "\u270D Draw+label" }];
      return { t: "single" as const, o: a }; }
    if (p === 5) return { t: "single" as const, o: [
      { id: "g", label: "\uD83D\uDC69\u200D\uD83C\uDFEB Guided" }, { id: "i", label: "\uD83D\uDC64 Individual" },
      { id: "gr", label: "\uD83D\uDC65 Group", description: cs > 35 ? "Pairs/groups" : "Groups of 3-4" }] };
    if (p === 6) return { t: "single" as const, o: [
      { id: "ay", label: "\uD83D\uDCDD Written assessment" }, { id: "an", label: "\uD83D\uDDE3 Oral only" }] };
    if (p === 7) return { t: "confirm" as const, o: [
      { id: "confirm", label: "\u2705 Save plan & generate materials" }, { id: "change", label: "\u270F Start over" }] };
    return { t: undefined, o: undefined };
  };

  const pLabel: Record<number, string> = { 1: "\uD83C\uDFAF Objective", 2: "\uD83C\uDF1F Hook", 3: "\uD83D\uDCCB TLM", 4: "\uD83C\uDFAE Activity", 5: "\uD83D\uDC65 Practice", 6: "\u2705 Assessment", 7: "\uD83D\uDCCB Review" };

  const startConvo = async () => {
    setLoading(true);
    const r = await callAI([], 1);
    const { t, o } = opts(1);
    setMessages([{ role: "assistant", content: r, options: o, optionType: t }]);
    setLoading(false);
  };

  const clr = (msgs: Message[], msg: Message): Message[] =>
    [...msgs.map(m => ({ ...m, options: undefined, optionType: undefined })), msg];

  const tlmSubmit = async (items: TLMItem[]) => {
    const miss = items.filter(x => x.hasIt === false);
    setMissingTlms(miss.map(m => m.name));
    const txt = miss.length === 0 ? "\u2705 I have everything" : "\u274C Missing: " + miss.map(m => m.name).join(", ");
    const upd = clr(messages, { role: "user", content: txt });
    if (miss.length > 0) {
      setMessages([...upd, { role: "assistant", content: "Some materials missing. What to do?",
        options: [{ id: "tm", label: "\u270D Make by hand" }, { id: "tp", label: "\uD83D\uDDA8 Generate printable" }, { id: "ts", label: "\u23ED Skip" }], optionType: "single" }]);
    } else { setLoading(true); setPhase(4); const r = await callAI(upd, 4); const { t, o } = opts(4); setMessages([...upd, { role: "assistant", content: r, options: o, optionType: t }]); setLoading(false); }
  };

  const genFlash = async (upd: Message[]) => {
    setMessages([...upd, { role: "system", content: "Generating flashcards..." }]);
    try {
      const r = await fetch("/api/worksheet", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, day, tlmMode: true, missingTlms, teacherProfile: { language: lang, medium: localStorage.getItem("medium") || "Marathi" } }) });
      const d = await r.json();
      if (d.items?.length > 0) {
        const mat: Message = { role: "assistant", content: "Flashcards ready!", materials: { type: "flashcards", items: d.items } };
        setPhase(4); setLoading(true);
        const r2 = await callAI([...upd, mat], 4); const { t, o } = opts(4);
        setMessages([...upd.filter(m => m.role !== "system"), mat, { role: "assistant", content: r2, options: o, optionType: t }]); setLoading(false);
      } else { goP4(upd); }
    } catch { goP4(upd); }
  };

  const goP4 = async (upd: Message[]) => {
    setPhase(4); setLoading(true);
    const r = await callAI(upd, 4); const { t, o } = opts(4);
    setMessages([...upd.filter(m => m.role !== "system"), { role: "assistant", content: r, options: o, optionType: t }]); setLoading(false);
  };

  const genWorksheet = async () => {
    setMessages(prev => [...prev, { role: "system", content: "Generating worksheet..." }]);
    try {
      const r = await fetch("/api/worksheet", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, day, teacherProfile: { language: lang, medium: localStorage.getItem("medium") || "Marathi" } }) });
      const d = await r.json();
      if (d.items) setMessages(prev => [...prev.filter(m => m.content !== "Generating worksheet..."), { role: "assistant", content: "Worksheet ready!", materials: { type: "worksheet", items: d.items } }]);
    } catch { setMessages(prev => [...prev.filter(m => m.content !== "Generating worksheet..."), { role: "assistant", content: "Could not generate worksheet." }]); }
  };

  const handleFeedback = (fb: SavedPlan["feedback"]) => {
    if (!fb) return;
    completePlan(lessonId, day, fb);
    const next = getNextAction(lessonId, day, fb, lesson.days);
    setNextAction(next);
    setShowFeedback(false);
  };

  const handleOpt = async (id: string, label: string) => {
    const upd = clr(messages, { role: "user", content: label });
    setPlanData(prev => ({ ...prev, ["p" + phase]: label }));

    // Saved plan options
    if (id === "use_saved") {
      setDone(true);
      setMessages([...upd, { role: "assistant", content: lang === "mr" ? "\u0924\u0941\u092E\u091A\u093E save \u0915\u0947\u0932\u0947\u0932\u093E plan \u0924\u092F\u093E\u0930 \u0906\u0939\u0947!" : "Your saved plan is ready!",
        options: [
          { id: "gw", label: "\uD83D\uDCDD Generate Worksheet" },
          { id: "mc", label: "\u2705 Mark as Completed" },
          { id: "gd", label: "\u2190 Back to lesson" },
        ], optionType: "single" }]);
      return;
    }
    if (id === "start_fresh") { setExistingPlan(null); startConvo(); return; }

    // Completion + feedback
    if (id === "mc") { setShowFeedback(true); return; }

    // Post-plan options
    if (phase === 7 && id === "confirm") {
      const aiResponses = messages.filter(m => m.role === "assistant" && m.content).map(m => m.content);
      const phaseDetails = [
        { emoji: "\uD83C\uDFAF", title: "Objective", selection: planData.p1 || "", detail: aiResponses[1] || planData.p1 || "" },
        { emoji: "\uD83C\uDF1F", title: "Hook (5 min)", selection: planData.p2 || "", detail: aiResponses[2] || planData.p2 || "" },
        { emoji: "\uD83D\uDCCB", title: "TLM Materials", selection: planData.p3 || "", detail: aiResponses[3] || planData.p3 || "" },
        { emoji: "\uD83C\uDFAE", title: "Activity (10-15 min)", selection: planData.p4 || "", detail: aiResponses[4] || planData.p4 || "" },
        { emoji: "\uD83D\uDC65", title: "Practice", selection: planData.p5 || "", detail: aiResponses[5] || planData.p5 || "" },
        { emoji: "\u2705", title: "Assessment", selection: planData.p6 || "", detail: aiResponses[6] || planData.p6 || "" },
      ];
      savePlan(lessonId, day, planData, phaseDetails);
      setDone(true);
      setMessages([...upd, { role: "assistant", content: lang === "mr" ? "\u0924\u0941\u092E\u091A\u093E plan save \u0906\u0923\u093F \u0924\u092F\u093E\u0930 \u0906\u0939\u0947! \uD83C\uDF89" : "Plan saved and ready! \uD83C\uDF89",
        options: [{ id: "gw", label: "\uD83D\uDCDD Generate Worksheet" }, { id: "mc", label: "\u2705 Mark as Completed" }, { id: "gd", label: "\u2190 Back to lesson" }], optionType: "single" }]);
      setTimeout(() => router.push("/lesson/" + lessonId), 2500);
      return;
    }
    if (id === "gw") { genWorksheet(); return; }
    if (id === "gd") { router.push("/lesson/" + lessonId); return; }
    if (phase === 7 && id === "change") { setPhase(1); setPlanData({}); setDone(false); setMessages([]); startConvo(); return; }

    // TLM handlers
    if (id === "tm") { setLoading(true); const g = await callAI(upd, 3, "guide:" + missingTlms.join(",")); await goP4([...upd, { role: "assistant", content: g }]); return; }
    if (id === "tp") { await genFlash(upd); return; }
    if (id === "ts") { await goP4(upd); return; }

    // Normal progression
    setLoading(true);
    const np = phase + 1; setPhase(np);
    if (np === 3) { setTlmList(mkTlm()); const r = await callAI(upd, 3); setMessages([...upd, { role: "assistant", content: r, optionType: "checklist" }]); setLoading(false); return; }
    const r = await callAI(upd, np); const { t, o } = opts(np);
    setMessages([...upd, { role: "assistant", content: r, options: np <= 7 ? o : undefined, optionType: np <= 7 ? t : undefined }]); setLoading(false);
  };

  const sendMsg = async (text: string) => {
    if (!text.trim()) return;
    const upd = clr(messages, { role: "user", content: text });
    setMessages(upd); setInput(""); setShowKb(false); setLoading(true);
    const r = await callAI(upd, phase); const { t, o } = opts(phase);
    setMessages([...upd, { role: "assistant", content: r, options: o, optionType: t }]); setLoading(false);
  };

  const printMat = (elId: string) => {
    const el = document.getElementById(elId);
    if (!el) return;
    const w = window.open("", "_blank"); if (!w) return;
    w.document.write("<html><head><title>PedaStudio</title><style>body{font-family:sans-serif;padding:20mm}.card{border:2px solid #000;border-radius:8px;padding:16px;margin:8px;text-align:center;page-break-inside:avoid;display:inline-block;width:45%}.word{font-size:28px;font-weight:bold;margin-top:8px}.item{border:1px solid #ccc;border-radius:8px;padding:12px;margin-bottom:8px;page-break-inside:avoid}.hdr{text-align:center;border-bottom:2px solid #000;padding-bottom:12px;margin-bottom:20px}.ftr{text-align:center;margin-top:24px;font-size:10px;color:#999;border-top:1px solid #ccc;padding-top:8px}</style></head><body>");
    w.document.write("<div class='hdr'><h2>PedaStudio</h2><p>" + lesson.id + " " + lesson.en + " - Day " + day + "</p><p>Name: _______________ Date: ___________</p></div>");
    w.document.write(el.innerHTML);
    w.document.write("<div class='ftr'>Generated by PedaStudio</div></body></html>");
    w.document.close(); setTimeout(() => w.print(), 300);
  };

  const shareMat = (type: string, items: any[]) => {
    let text = "*PedaStudio " + type + "*\n*" + lesson.id + " " + lesson.en + "* Day " + day + "\n\n";
    if (type === "Flashcards") text += items.map((f: any) => "\u2022 " + (f.word || "")).join("\n");
    else text += items.map((it: any, i: number) => "*" + (i+1) + ".* " + (it.instruction_en || "")).join("\n");
    text += "\n\n_Generated by PedaStudio_";
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  };

  const safe = (v: any): string => typeof v === "string" ? v : typeof v === "number" ? String(v) : JSON.stringify(v);

  const t = translations[lang];
  const isRtl = lang === "ur";
  const bc: Record<string, string> = { "Remember": "bg-accent-50 text-blue-700 border-blue-200", "Understand": "bg-amber-50 text-amber-700 border-amber-200", "Apply": "bg-accent-50 text-accent-800 border-accent-300", "Remember & Apply": "bg-violet-50 text-violet-700 border-violet-200", "Understand & Apply": "bg-orange-50 text-orange-700 border-orange-200" };

  const feedbackOptions = [
    { id: "went_well" as const, label: "\uD83D\uDE0A Went well", description: "Students understood the lesson", color: "border-emerald-300 bg-accent-50" },
    { id: "some_struggled" as const, label: "\uD83E\uDD14 Some struggled", description: "A few students need more practice", color: "border-amber-300 bg-amber-50" },
    { id: "most_didnt_understand" as const, label: "\uD83D\uDE1F Most didn't understand", description: "Need to re-teach with simpler approach", color: "border-red-300 bg-red-50" },
    { id: "couldnt_finish" as const, label: "\u23F0 Couldn't finish", description: "Ran out of time, need to continue", color: "border-blue-300 bg-accent-50" },
    { id: "ready_for_more" as const, label: "\uD83D\uDE80 Ready for more!", description: "Students were ahead, can move faster", color: "border-violet-300 bg-violet-50" },
  ];

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="flex flex-col min-h-screen bg-white">
      <header className="bg-white border-b border-[#D0EAE4] px-5 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/lesson/" + lessonId)} className="text-primary-400 text-lg">{"\u2190"}</button>
          <div className="flex-1">
            <p className="text-base font-semibold text-primary-800">{lesson.id} {lesson.en}</p>
            <p className="text-xs text-primary-300">{lesson[lang]}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold " + (bc[dayInfo?.level || "Remember"] || "bg-gray-50 text-gray-600 border-gray-200")}>
            <span>Day {day}/{lesson.days}</span><span>{"\u2022"}</span><span>{dayInfo?.level || "Remember"}</span>
          </div>
          <div className="flex-1" />
          <span className="text-xs text-primary-300">{pLabel[phase] || ""}</span>
        </div>
        <div className="mt-2 flex gap-1">
          {[1,2,3,4,5,6,7].map(p => (<div key={p} className={"h-1 flex-1 rounded-full " + (p < phase ? "bg-accent-500" : p === phase ? "bg-accent-300" : "bg-accent-100")} />))}
        </div>
      </header>

      <div className="flex-1 px-4 py-5 pb-28 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="mb-4">
            {msg.role === "system" && (<div className="flex justify-center"><p className="text-xs text-primary-300 bg-accent-50 px-3 py-1.5 rounded-full">{msg.content}</p></div>)}

            {msg.role !== "system" && !msg.materials && msg.content && (
              <div className={"flex " + (msg.role === "user" ? "justify-end" : "justify-start")}>
                <div className={msg.role === "assistant" ? "bg-white rounded-2xl rounded-tl-md p-4 max-w-[88%] shadow-sm border border-[#D0EAE4]" : "bg-accent-700 text-white rounded-2xl rounded-tr-md p-4 max-w-[88%] shadow-sm"}>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            )}

            {msg.materials?.type === "flashcards" && (
              <div className="mt-2 bg-white rounded-xl border border-[#D0EAE4] shadow-sm overflow-hidden">
                <div className="bg-warm-50 px-4 py-2 border-b border-warm-200"><p className="text-sm font-bold text-warm-800">{"\uD83C\uDCCF"} Flashcards</p></div>
                <div id={"fc-" + i} className="p-3 grid grid-cols-3 gap-2">
                  {msg.materials.items.map((fc: any, j: number) => (
                    <div key={j} className="border-2 border-[#D0EAE4] rounded-xl p-2 text-center">
                      <p className="text-2xl">{safe(fc.emoji) || getEmojiForPlan(safe(fc.word))}</p>
                      <p className="text-xs font-bold text-primary-800 mt-1 capitalize">{safe(fc.word)}</p>
                    </div>
                  ))}
                </div>
                <div className="px-3 pb-3 flex gap-2">
                  <button onClick={() => { localStorage.setItem("flashcards_to_print", JSON.stringify(msg.materials!.items.map((fc: any) => ({ word: safe(fc.word), emoji: safe(fc.emoji) || getEmojiForPlan(safe(fc.word)), meaning: "" })))); router.push("/flashcards"); }} className="flex-1 py-2.5 rounded-lg bg-accent-700 text-white text-xs font-semibold">{"\uD83D\uDDA8\uFE0F"} Select & Print</button>
                  <button onClick={() => shareMat("Flashcards", msg.materials!.items)} className="flex-1 py-2.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold">{"\uD83D\uDCE4"} WhatsApp</button>
                </div>
              </div>
            )}

            {msg.materials?.type === "worksheet" && (
              <div className="mt-2 bg-white rounded-xl border border-[#D0EAE4] shadow-sm overflow-hidden">
                <div className="bg-white px-4 py-2 border-b border-[#D0EAE4]"><p className="text-sm font-bold text-primary-700">{"\uD83D\uDCDD"} Worksheet</p></div>
                <div id={"ws-" + i} className="p-3 space-y-3">
                  {msg.materials.items.map((item: any, j: number) => (
                    <div key={j} className="border border-[#D0EAE4] rounded-lg p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{j+1}</span>
                        <div><p className="text-sm font-semibold text-primary-800">{safe(item.instruction_local)}</p><p className="text-xs text-primary-300">{safe(item.instruction_en)}</p></div>
                      </div>
                      {item.type === "trace" && item.content?.words && (<div className="flex flex-wrap gap-2 mt-1">{item.content.words.map((w: any, k: number) => (<span key={k} className="text-xl font-bold text-slate-200 tracking-widest border-b-2 border-dotted border-slate-300 px-3 py-1">{safe(w)}</span>))}</div>)}
                      {item.type === "match" && item.content?.pairs && (<div className="flex flex-wrap gap-2 mt-1">{item.content.pairs.map((p: any, k: number) => (<span key={k} className="px-2 py-1 border border-[#D0EAE4] rounded text-sm">{safe(typeof p === "string" ? p : p.word || p)}</span>))}</div>)}
                      {item.type === "circle" && item.content?.questions && (<div className="space-y-2 mt-1">{item.content.questions.map((q: any, k: number) => (<div key={k}>{q.image_desc && <p className="text-xs text-primary-400 mb-1">[{safe(q.image_desc)}]</p>}<div className="flex gap-2 flex-wrap">{Array.isArray(q.options) && q.options.map((o: any, l: number) => (<span key={l} className="px-3 py-1 border border-[#D0EAE4] rounded-full text-sm">{safe(o)}</span>))}</div></div>))}</div>)}
                      {item.type === "fill_blank" && item.content?.sentences && (<div className="space-y-1 mt-1">{item.content.sentences.map((s: any, k: number) => (<p key={k} className="text-sm border-b border-dotted border-slate-300 pb-1">{safe(s)}</p>))}</div>)}
                      {item.type === "label" && item.content?.items && (<div className="grid grid-cols-2 gap-2 mt-1">{item.content.items.map((it: any, k: number) => (<div key={k} className="border border-[#D0EAE4] rounded-lg p-3 text-center"><p className="text-xs text-primary-300 mb-2">[{safe(it.image_desc || "picture")}]</p><div className="border-b-2 border-dotted border-slate-300 w-3/4 mx-auto"></div></div>))}</div>)}
                      {item.type === "draw" && item.content && (<div className="border-2 border-dashed border-[#D0EAE4] rounded-lg p-4 mt-1 min-h-[80px] flex items-center justify-center"><p className="text-xs text-primary-300">{safe(item.content.prompt || "Draw here")}</p></div>)}
                      {item.type === "categorize" && item.content && (<div className="mt-1"><div className="flex flex-wrap gap-1 mb-2">{item.content.words?.map((w: any, k: number) => (<span key={k} className="px-2 py-1 bg-accent-50 rounded text-sm font-semibold">{safe(w)}</span>))}</div><div className="grid grid-cols-2 gap-2">{item.content.categories?.map((c: any, k: number) => (<div key={k} className="border border-[#D0EAE4] rounded-lg p-2"><p className="text-xs font-bold text-primary-500 mb-1">{safe(c)}</p><div className="border-b border-dotted border-slate-300 h-5 mb-1"></div><div className="border-b border-dotted border-slate-300 h-5"></div></div>))}</div></div>)}
                    </div>
                  ))}
                </div>
                <div className="px-3 pb-3 flex gap-2">
                  <button onClick={() => printMat("ws-" + i)} className="flex-1 py-2 rounded-lg bg-accent-700 text-white text-xs font-semibold">{"\uD83D\uDCC4"} PDF</button>
                  <button onClick={() => shareMat("Worksheet", msg.materials!.items)} className="flex-1 py-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold">{"\uD83D\uDCE4"} WhatsApp</button>
                </div>
              </div>
            )}

            {msg.optionType === "checklist" && tlmList.length > 0 && (
              <div className="mt-3 space-y-2 max-w-[92%]">
                <p className="text-xs font-semibold text-primary-300 uppercase mb-1">Check what you have:</p>
                {tlmList.map((item, idx) => (
                  <div key={item.id} className={"flex items-center gap-3 p-3 rounded-xl border-2 " + (item.hasIt === true ? "border-emerald-300 bg-accent-50" : item.hasIt === false ? "border-red-200 bg-red-50" : "border-[#D0EAE4] bg-white")}>
                    <span className="flex-1 text-sm font-medium text-primary-700">{item.name}</span>
                    <button onClick={() => { const n = [...tlmList]; n[idx] = { ...n[idx], hasIt: true }; setTlmList(n); }} className={"px-3 py-1 rounded-lg text-xs font-semibold " + (item.hasIt === true ? "bg-accent-700 text-white" : "bg-accent-50 text-primary-400")}>{"\u2705"}</button>
                    <button onClick={() => { const n = [...tlmList]; n[idx] = { ...n[idx], hasIt: false }; setTlmList(n); }} className={"px-3 py-1 rounded-lg text-xs font-semibold " + (item.hasIt === false ? "bg-red-500 text-white" : "bg-accent-50 text-primary-400")}>{"\u274C"}</button>
                  </div>
                ))}
                {tlmList.every(x => x.hasIt !== null) && (<button onClick={() => tlmSubmit(tlmList)} className="w-full py-3 rounded-xl bg-accent-700 text-white font-semibold text-sm mt-2">Continue {"\u2192"}</button>)}
              </div>
            )}

            {msg.options && msg.options.length > 0 && msg.optionType !== "checklist" && (
              <div className="mt-3 space-y-2 max-w-[92%]">
                {msg.options.map((opt) => (
                  <button key={opt.id} onClick={() => handleOpt(opt.id, opt.label)} className="w-full text-left p-3 rounded-xl border-2 border-[#D0EAE4] bg-white hover:border-primary-500 active:bg-[#e0f0e5] transition-all shadow-sm">
                    <p className="text-sm font-semibold text-primary-800">{opt.label}</p>
                    {opt.description && <p className="text-xs text-primary-400 mt-0.5">{opt.description}</p>}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Feedback modal */}
        {showFeedback && (
          <div className="my-4 bg-white rounded-xl border-2 border-accent-500 shadow-lg p-4">
            <p className="text-base font-bold text-primary-500 mb-1">{lang === "mr" ? "\u0906\u091C\u091A\u093E \u0935\u0930\u094D\u0917 \u0915\u0938\u093E \u0917\u0947\u0932\u093E?" : "How did today's class go?"}</p>
            <p className="text-xs text-primary-400 mb-3">{lang === "mr" ? "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0909\u0924\u094D\u0924\u0930\u093E\u0935\u0930\u0942\u0928 \u092A\u0941\u0922\u091A\u093E \u0927\u0921\u093E \u0920\u0930\u0935\u0942" : "Your feedback helps plan the next lesson"}</p>
            <div className="space-y-2">
              {feedbackOptions.map(fb => (
                <button key={fb.id} onClick={() => handleFeedback(fb.id)} className={"w-full text-left p-3 rounded-xl border-2 " + fb.color}>
                  <p className="text-sm font-semibold text-primary-800">{fb.label}</p>
                  <p className="text-xs text-primary-400 mt-0.5">{fb.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Next action recommendation */}
        {nextAction && (
          <div className="my-4 bg-primary-500 rounded-xl p-4 text-white">
            <p className="text-xs text-primary-300 uppercase tracking-wider mb-1">Recommended next step</p>
            <p className="text-base font-bold mb-1">{nextAction.label}</p>
            <p className="text-sm text-white/70 mb-3">{nextAction.description}</p>
            <div className="flex gap-2">
              <button onClick={() => router.push(nextAction.route)} className="flex-1 py-2.5 rounded-xl bg-white text-primary-500 font-semibold text-sm">{nextAction.label} {"\u2192"}</button>
              <button onClick={() => router.push("/lesson/" + lessonId)} className="py-2.5 px-4 rounded-xl border border-white/30 text-white/80 text-sm">{"\u2190"} Lesson</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-[#D0EAE4]">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-primary-200 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary-200 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-primary-200 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {!done && !showFeedback && !nextAction && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D0EAE4] px-4 py-3 shadow-lg">
          <div className="max-w-[480px] mx-auto">
            {showKb ? (
              <div className="flex gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMsg(input)} placeholder="Type..." className="flex-1 px-4 py-3 text-base border border-[#D0EAE4] rounded-xl outline-none focus:border-primary-500 bg-white" autoFocus />
                <button onClick={() => sendMsg(input)} disabled={!input.trim() || loading} className="px-5 py-3 rounded-xl bg-accent-700 text-white font-semibold disabled:bg-accent-200">{"\u2192"}</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setShowKb(true)} className="flex-1 min-h-[48px] rounded-xl bg-accent-700 text-white text-base font-semibold active:bg-accent-800 shadow-sm" disabled={loading}>{t.micButton}</button>
                <button onClick={() => setShowKb(true)} className="min-h-[48px] px-4 rounded-xl border border-[#D0EAE4] text-primary-400 text-sm">{"\u2328"}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}