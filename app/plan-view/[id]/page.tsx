"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getEmoji as getEmojiForView } from "@/lib/emoji-map";
import { translations } from "@/lib/translations";
import type { Language } from "@/lib/translations";
import { getPlan, saveMaterials, updateRichPlan } from "@/lib/plan-storage";
import { findLessonById } from "@/lib/lesson-utils";
import { useAuthGuard } from "@/lib/auth";
import { emojiForImageDesc } from "@/lib/image-desc-emoji";
import { getLessonFlashcards } from "@/lib/flashcards";
import { FlashcardVisual } from "@/components/FlashcardVisual";

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

function safe(v: any): string {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.map(safe).join(", ");
  if (v === null || v === undefined) return "";
  return JSON.stringify(v);
}

export default function ViewPlanPage() {
  const router = useRouter();
  useAuthGuard();
  const params = useParams();
  const searchParams = useSearchParams();
  const lessonId = params.id as string;
  const day = parseInt(searchParams.get("day") || "1");
  const fromQuickPlan = searchParams.get("from") === "quick-plan";
  const lesson = findLessonById(lessonId);
  const dayInfo = lesson?.bloomsProgression.find((b) => b.day === day);

  const [lang, setLang] = useState<Language>("mr");
  const [richPlan, setRichPlan] = useState<any>(null);
  const [savedPlan, setSavedPlan] = useState<ReturnType<typeof getPlan> | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [savedFlashcards, setSavedFlashcards] = useState<any[] | null>(null);
  const [savedWorksheet, setSavedWorksheet] = useState<any[] | null>(null);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showWorksheet, setShowWorksheet] = useState(false);
  const [genLoading, setGenLoading] = useState<string | null>(null);

  useEffect(() => {
    setLang(getLang());
    const saved = getPlan(lessonId, day);
    setSavedPlan(saved);
    if (saved.materials?.flashcards) setSavedFlashcards(saved.materials.flashcards);
    if (saved.materials?.worksheet) setSavedWorksheet(saved.materials.worksheet);
    if (saved.richPlan) {
      setRichPlan(saved.richPlan);
      setLoading(false);
    } else if (saved.planData) {
      generateRichPlan(saved.planData);
    } else {
      setLoading(false);
    }
  }, [lessonId, day]);

  if (!lesson) {
    return (
      <main className="flex flex-col min-h-screen bg-white">
        <header className="bg-white border-b border-[#D0EAE4] px-5 py-4 flex items-center gap-3">
          <button onClick={() => router.push("/home")} className="text-primary-400 text-lg">{"\u2190"}</button>
          <p className="text-base font-semibold flex-1 text-primary-800">Lesson not found</p>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-primary-300 mb-4">Could not find lesson &quot;{lessonId}&quot;.</p>
          <button onClick={() => router.push("/home")} className="px-6 py-3 rounded-xl bg-accent-700 text-white font-semibold">Go Home</button>
        </div>
      </main>
    );
  }

  const persistPlan = (plan: any) => {
    updateRichPlan(lessonId, day, plan);
  };

  const generateRichPlan = async (selections: Record<string, string>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, day, selections, teacherProfile: {
          language: localStorage.getItem("lang") || "mr", medium: localStorage.getItem("medium") || "Marathi",
          studentCount: localStorage.getItem("studentCount") || "30", seating: localStorage.getItem("seatingArrangement") || "Rows",
          resources: localStorage.getItem("teacherResources") || "Blackboard",
          name: localStorage.getItem("teacherName") || "Teacher",
          comfort: localStorage.getItem("englishComfort") || "moderate",
        }}),
      });
      if (!res.ok) { setLoading(false); return; }
      const data = await res.json();
      if (data.plan) {
        setRichPlan(data.plan);
        persistPlan(data.plan);
      }
    } catch (e) { console.error("Error:", e); }
    setLoading(false);
  };

  const loadFlashcards = () => {
    const cards = getLessonFlashcards(lesson, lang);
    saveMaterials(lessonId, day, "flashcards", cards);
    setSavedFlashcards(cards);
    setShowFlashcards(true);
  };

  const generateMaterial = async (type: "flashcards" | "worksheet") => {
    if (type === "flashcards") {
      loadFlashcards();
      return;
    }
    setGenLoading(type);
    try {
      const vocabularyFocus: string[] = richPlan?.vocabulary_focus || [];
      const body: Record<string, unknown> = {
        lessonId, day,
        teacherProfile: { language: lang, medium: localStorage.getItem("medium") || "Marathi" },
        vocabularyFocus,
      };
      const res = await fetch("/api/worksheet", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { setGenLoading(null); return; }
      const data = await res.json();
      if (data.items) {
        saveMaterials(lessonId, day, type, data.items);
        setSavedWorksheet(data.items);
        setShowWorksheet(true);
      }
    } catch (e) { console.error("Error:", e); }
    setGenLoading(null);
  };

  const printMaterial = (title: string, items: any[], type: "flashcards" | "worksheet") => {
    const w = window.open("", "_blank"); if (!w) return;
    w.document.write("<html><head><title>" + title + "</title><style>");
    w.document.write("body{font-family:sans-serif;padding:20mm;max-width:700px;margin:0 auto}");
    w.document.write(".hdr{text-align:center;border-bottom:2px solid #1a3d28;padding-bottom:10px;margin-bottom:16px}");
    w.document.write("h1{font-size:18px;color:#1a3d28;margin-bottom:4px}");
    w.document.write(".name{display:flex;justify-content:space-between;font-size:12px;color:#64748b;margin-top:8px}");
    w.document.write(".card{border:2px solid #000;border-radius:10px;padding:20px;margin:8px;text-align:center;page-break-inside:avoid;display:inline-block;width:44%}");
    w.document.write(".card-word{font-size:32px;font-weight:bold;margin-top:8px}");
    w.document.write(".card-emoji{font-size:48px}");
    w.document.write(".item{border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:10px;page-break-inside:avoid}");
    w.document.write(".item-num{display:inline-block;width:24px;height:24px;background:#1a3d28;color:white;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:bold;margin-right:8px}");
    w.document.write(".item-title{font-weight:bold;font-size:13px}");
    w.document.write(".item-sub{font-size:11px;color:#64748b;font-style:italic}");
    w.document.write(".ftr{text-align:center;font-size:9px;color:#94a3b8;margin-top:20px;border-top:1px solid #e2e8f0;padding-top:6px}");
    w.document.write("</style></head><body>");
    w.document.write("<div class='hdr'><h1>PedaStudio " + (type === "flashcards" ? "Flashcards" : "Worksheet") + "</h1>");
    w.document.write("<p>" + lesson.id + " " + lesson.en + " \u2022 Day " + day + "</p>");
    w.document.write("<div class='name'><span>Name: ___________________</span><span>Date: ___________</span></div></div>");
    if (type === "flashcards") {
      items.forEach((fc: any) => {
        w.document.write("<div class='card'>");
        if (fc.imageUrl) {
          w.document.write("<img src='" + safe(fc.imageUrl) + "' alt='" + safe(fc.word) + "' style='width:80px;height:80px;object-fit:contain;border-radius:8px' />");
        } else if (fc.emoji) {
          w.document.write("<div class='card-emoji'>" + fc.emoji + "</div>");
        }
        w.document.write("<div class='card-word'>" + safe(fc.word) + "</div>");
        if (fc.meaning) w.document.write("<div style='font-size:12px;color:#64748b;margin-top:4px'>" + safe(fc.meaning) + "</div>");
        w.document.write("</div>");
      });
    } else {
      items.forEach((it: any, i: number) => {
        w.document.write("<div class='item'><span class='item-num'>" + (i+1) + "</span>");
        w.document.write("<span class='item-title'>" + safe(it.instruction_local || it.instruction_en || "") + "</span>");
        if (it.instruction_en) w.document.write("<br/><span class='item-sub'>" + safe(it.instruction_en) + "</span>");
        if (it.content?.words) w.document.write("<p style='margin-top:8px;font-size:20px;color:#cbd5e1;letter-spacing:8px;font-weight:bold'>" + it.content.words.map(safe).join("&nbsp;&nbsp;&nbsp;") + "</p>");
        if (it.content?.pairs) w.document.write("<p style='margin-top:8px'>" + it.content.pairs.map((p: any) => safe(p.word || p) + " \u2192 " + emojiForImageDesc(safe(p.image_desc || ""), safe(p.word || ""))).join(" &bull; ") + "</p>");
        if (it.content?.questions) it.content.questions.forEach((q: any) => {
          w.document.write("<p style='margin-top:6px;font-size:24px'>" + emojiForImageDesc(safe(q.image_desc || ""), safe(q.answer || "")) + " " + (Array.isArray(q.options) ? q.options.map(safe).join(" / ") : "") + "</p>");
        });
        if (it.content?.sentences) it.content.sentences.forEach((s: any) => {
          w.document.write("<p style='margin-top:4px;border-bottom:1px dotted #ccc;padding-bottom:4px'>" + safe(s) + "</p>");
        });
        w.document.write("</div>");
      });
    }
    w.document.write("<div class='ftr'>Generated by PedaStudio</div></body></html>");
    w.document.close(); setTimeout(() => w.print(), 300);
  };

  const shareMaterial = (type: string, items: any[]) => {
    let t = "*PedaStudio " + type + "*\n*" + lesson.id + " " + lesson.en + "* Day " + day + "\n\n";
    if (type === "Flashcards") t += items.map((f: any) => "\u2022 " + safe(f.word)).join("\n");
    else t += items.map((it: any, i: number) => "*" + (i+1) + ".* " + safe(it.instruction_en || "")).join("\n");
    t += "\n\n_Generated by PedaStudio_";
    window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
  };

  const isRtl = lang === "ur";
  const bc: Record<string, string> = { "Remember": "bg-accent-50 text-blue-700 border-blue-200", "Understand": "bg-amber-50 text-amber-700 border-amber-200", "Apply": "bg-accent-50 text-accent-800 border-accent-300", "Remember & Apply": "bg-violet-50 text-violet-700 border-violet-200", "Understand & Apply": "bg-orange-50 text-orange-700 border-orange-200" };

  const saveSection = () => {
    if (richPlan) persistPlan(richPlan);
    setEditingSection(null);
  };

  if (loading) return (
    <main className="flex flex-col min-h-screen bg-white">
      <header className="bg-white border-b border-[#D0EAE4] px-5 py-4 flex items-center gap-3">
        <button onClick={() => router.push("/lesson/" + lessonId)} className="text-primary-400 text-lg">{"\u2190"}</button>
        <p className="text-base font-semibold flex-1 text-primary-800">{lesson.id} {lesson.en}</p>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex gap-1.5 mb-3">
          <span className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{animationDelay:"150ms"}}></span>
          <span className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{animationDelay:"300ms"}}></span>
        </div>
        <p className="text-sm text-primary-300">Generating your lesson plan...</p>
      </div>
    </main>
  );

  if (!richPlan) return (
    <main className="flex flex-col min-h-screen bg-white">
      <header className="bg-white border-b border-[#D0EAE4] px-5 py-4 flex items-center gap-3">
        <button onClick={() => router.push("/lesson/" + lessonId)} className="text-primary-400 text-lg">{"\u2190"}</button>
        <p className="text-base font-semibold flex-1 text-primary-800">{lesson.id} {lesson.en}</p>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-primary-300 mb-4">No plan found.</p>
        <button onClick={() => router.push("/quick-plan/" + lessonId + "?day=" + day)} className="px-6 py-3 rounded-xl bg-accent-700 text-white font-semibold">Plan Day {day} {"\u2192"}</button>
      </div>
    </main>
  );

  const exportPlanAndShare = () => {
    // Opens print-ready page (Save as PDF) with WhatsApp share hint
    const w = window.open("", "_blank");
    if (!w) {
      let t = "*PedaStudio Lesson Plan*\n*" + lesson.id + " " + lesson.en + "*\nDay " + day + "\n\n";
      if (richPlan.objective) t += "\uD83C\uDFAF *Objective*\n" + safe(richPlan.objective.text) + "\n\n";
      t += "_Generated by PedaStudio_";
      window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      return;
    }

    let sections = "";
    if (richPlan.objective) sections += `<div class="sec"><div class="sec-h">\uD83C\uDFAF Objective</div><p>${safe(richPlan.objective.text)}</p>${richPlan.objective.success_criteria ? `<p class="sub">Success: ${safe(richPlan.objective.success_criteria)}</p>` : ""}</div>`;
    if (richPlan.hook) sections += `<div class="sec"><div class="sec-h">\uD83C\uDF1F Hook (${safe(richPlan.hook.duration)})</div>${(richPlan.hook.steps || []).map((s: any) => `<p>${safe(s)}</p>`).join("")}</div>`;
    if (richPlan.activity) sections += `<div class="sec"><div class="sec-h">\uD83C\uDFAE ${safe(richPlan.activity.name)} (${safe(richPlan.activity.duration)})</div>${(richPlan.activity.steps || []).map((s: any) => `<p><b>Step ${safe(s.step)}:</b> ${safe(s.instruction)}</p>`).join("")}${richPlan.activity.management_tip ? `<p class="tip">\uD83D\uDCA1 ${safe(richPlan.activity.management_tip)}</p>` : ""}</div>`;
    if (richPlan.practice) sections += `<div class="sec"><div class="sec-h">\uD83D\uDC65 Practice — ${safe(richPlan.practice.mode)}</div><p>${safe(richPlan.practice.instruction)}</p><p class="sub">Students: ${safe(richPlan.practice.student_action)}</p></div>`;
    if (richPlan.assessment) sections += `<div class="sec"><div class="sec-h">\u2705 Assessment</div>${(richPlan.assessment.questions || []).map((q: any, i: number) => `<p>${i+1}. ${safe(q)}</p>`).join("")}${richPlan.assessment.exit_token ? `<p class="sub">Exit token: ${safe(richPlan.assessment.exit_token)}</p>` : ""}</div>`;
    if (richPlan.closure) sections += `<div class="sec"><div class="sec-h">\uD83C\uDF93 Closure</div><p>${safe(richPlan.closure.instruction)}</p></div>`;

    w.document.write(`<!DOCTYPE html><html><head><title>Lesson Plan - PedaStudio</title>
      <style>
        @page { margin: 12mm; }
        body { font-family: Arial, sans-serif; padding: 16px; max-width: 700px; margin: 0 auto; color: #2A3D4E; }
        h1 { color: #496580; font-size: 18px; margin: 0; }
        .subtitle { color: #7A9AAC; font-size: 12px; margin-top: 4px; }
        .meta { color: #7A9AAC; font-size: 10px; margin: 8px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #D0EAE4; }
        .sec { margin-bottom: 14px; }
        .sec-h { font-size: 14px; font-weight: bold; color: #2A7A6A; margin-bottom: 6px; padding: 4px 8px; background: #F0FAF8; border-radius: 6px; }
        p { font-size: 13px; line-height: 1.6; margin: 4px 0 4px 8px; }
        .sub { font-size: 11px; color: #7A9AAC; font-style: italic; }
        .tip { font-size: 11px; color: #D4710A; background: #FFF9F4; padding: 6px 8px; border-radius: 4px; margin-top: 4px; }
        .footer { text-align: center; font-size: 9px; color: #A0BAB4; margin-top: 16px; padding-top: 6px; border-top: 1px solid #D0EAE4; }
        .share-hint { text-align: center; padding: 12px; background: #F0FAF8; border-radius: 8px; margin-top: 12px; font-size: 12px; color: #2A7A6A; }
        @media print { .share-hint { display: none; } }
      </style></head><body>
      <h1>${lesson.id}: ${lesson.en}</h1>
      <div class="subtitle">${lesson[lang] || ""} \u2022 Day ${day} \u2022 ${dayInfo?.level || ""}</div>
      <div class="meta">PedaStudio Lesson Plan | ${new Date().toLocaleDateString()} | ${localStorage.getItem("teacherName") || "Teacher"}</div>
      ${sections}
      <div class="footer">Generated by PedaStudio \u2022 AI-powered lesson planning</div>
      <div class="share-hint">
        \uD83D\uDCA1 <b>Step 1:</b> Save as PDF \u2192 <b>Step 2:</b> Share on WhatsApp<br><br>
        <a href="https://wa.me/" target="_blank" style="display:inline-block;padding:10px 20px;background:#25D366;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">\uD83D\uDCE4 Open WhatsApp</a>
      </div>
      <script>setTimeout(function(){ window.print(); }, 500);</script>
      </body></html>`);
    w.document.close();
  };

  const savePlanAndReturn = () => {
    if (richPlan) persistPlan(richPlan);
    router.push("/lesson/" + lessonId);
  };

  const regeneratePlan = () => {
    router.push("/quick-plan/" + lessonId + "?day=" + day);
  };

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="flex flex-col h-[100dvh] bg-white overflow-hidden">
      <header className="shrink-0 bg-white border-b border-[#D0EAE4] px-5 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/lesson/" + lessonId)} className="text-primary-400 text-lg">{"\u2190"}</button>
          <div className="flex-1">
            <p className="text-xs text-primary-300 uppercase tracking-wider">Lesson Plan</p>
            <p className="text-base font-semibold text-primary-800">{lesson.id} {lesson.en}</p>
          </div>
          <button onClick={() => { if (editing && richPlan) persistPlan(richPlan); setEditing(!editing); setEditingSection(null); }} className="px-3 py-1.5 rounded-lg bg-accent-50 text-accent-700 border border-[#D0EAE4] text-xs font-semibold">
            {editing ? "\u2705 Done" : "\u270F\uFE0F Edit"}
          </button>
        </div>
      </header>

      <div className="shrink-0 bg-white border-b border-[#D0EAE4] px-5 py-3">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className={"text-xs font-semibold px-2.5 py-1 rounded-full border " + (bc[dayInfo?.level || "Remember"] || "")}>Day {day}/{lesson.days} {"\u2022"} {dayInfo?.level || "Remember"}</span>
          <span className="text-xs text-primary-300">{lesson.type} {"\u2022"} p. {lesson.pages} {"\u2022"} 40 min</span>
        </div>
        {fromQuickPlan && (
          <p className="text-xs text-accent-800 font-semibold mb-2">{"\u2705"} Day {day} plan ready — save or share below</p>
        )}
        <button
          onClick={exportPlanAndShare}
          className="w-full py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold flex items-center justify-center gap-2"
        >
          {"\uD83D\uDCC4"} Save PDF & Share on WhatsApp
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4">

        {/* Objective */}
        {richPlan.objective && (
          <PlanSection emoji="\uD83C\uDFAF" title="Objective" editing={editing} isEditing={editingSection === "obj"} editText={editText}
            onEdit={() => { setEditingSection("obj"); setEditText(safe(richPlan.objective.text)); }}
            onSave={() => { richPlan.objective.text = editText; saveSection(); }}
            onEditChange={setEditText}>
            <div className={"inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2 border " + (bc[safe(richPlan.objective.blooms_level)] || "bg-accent-50 text-primary-600 border-[#D0EAE4]")}>{safe(richPlan.objective.blooms_level)}</div>
            <p className="text-sm text-primary-700 leading-relaxed">{safe(richPlan.objective.text)}</p>
            <p className="text-xs text-primary-400 mt-2 italic">{"\u2705"} {safe(richPlan.objective.success_criteria)}</p>
          </PlanSection>
        )}

        {/* Hook */}
        {richPlan.hook && (
          <PlanSection emoji="\uD83C\uDF1F" title={"Hook (" + safe(richPlan.hook.duration) + ")"} editing={editing} isEditing={editingSection === "hook"} editText={editText}
            onEdit={() => { setEditingSection("hook"); setEditText((richPlan.hook.steps || []).map(safe).join("\n")); }}
            onSave={() => { richPlan.hook.steps = editText.split("\n"); saveSection(); }}
            onEditChange={setEditText}>
            {richPlan.hook.teacher_says && (
              <div className="bg-primary-500/5 rounded-lg px-3 py-2 mb-3">
                <p className="text-xs text-primary-400 mb-0.5">Teacher says:</p>
                <p className="text-sm font-semibold text-primary-500">{safe(richPlan.hook.teacher_says)}</p>
              </div>
            )}
            <div className="space-y-2">
              {(richPlan.hook.steps || []).map((s: any, i: number) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="w-5 h-5 rounded-full bg-accent-50 text-primary-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i+1}</span>
                  <p className="text-sm text-primary-700">{safe(s)}</p>
                </div>
              ))}
            </div>
          </PlanSection>
        )}

        {/* TLM + Flashcards */}
        {(richPlan.tlm || savedPlan?.planData?.tlms) && (
          <PlanSection emoji="\uD83D\uDCCB" title="TLM Materials" editing={editing} isEditing={editingSection === "tlm"} editText={editText}
            onEdit={() => { setEditingSection("tlm"); setEditText(((richPlan.tlm?.items) || []).map((i: any) => safe(i.name)).join("\n")); }}
            onSave={() => saveSection()} onEditChange={setEditText}>
            <div className="space-y-2">
              {((richPlan.tlm?.items) || (savedPlan?.planData?.tlms || "").split(",").filter(Boolean).map((n: string) => ({ name: n.trim(), is_printable: false }))).map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-sm shrink-0 mt-0.5">{item.is_printable ? "\uD83D\uDDA8" : "\u2705"}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-primary-700">{safe(item.name)}</p>
                    {item.description && <p className="text-xs text-primary-400 mt-0.5">{safe(item.description)}</p>}
                  </div>
                </div>
              ))}
            </div>
            {/* Smart flashcard button */}
            <div className="mt-3 pt-3 border-t border-[#D0EAE4]">
              {savedFlashcards ? (
                <div>
                  <button onClick={() => setShowFlashcards(!showFlashcards)} className="w-full py-2 rounded-lg border border-primary-500 text-primary-500 text-xs font-semibold mb-2">
                    {showFlashcards ? "Hide Flashcards" : "\uD83C\uDCCF Lesson Flashcards (" + savedFlashcards.length + " cards)"}
                  </button>
                  {showFlashcards && (
                    <div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {savedFlashcards.map((fc: any, i: number) => (
                          <div key={i} className="border-2 border-[#D0EAE4] rounded-xl p-2 text-center">
                            <FlashcardVisual word={safe(fc.word)} emoji={safe(fc.emoji) || getEmojiForView(safe(fc.word))} imageUrl={fc.imageUrl} emojiClassName="text-2xl block mb-0.5" imgClassName="w-12 h-12 mx-auto object-contain rounded-lg mb-0.5" />
                            <p className="text-xs font-bold text-primary-800 capitalize">{safe(fc.word)}</p>
                            {fc.meaning && <p className="text-[10px] text-primary-400 leading-tight mt-0.5">{safe(fc.meaning)}</p>}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { localStorage.setItem("flashcards_to_print", JSON.stringify(savedFlashcards)); router.push("/flashcards?lesson=" + lessonId); }} className="flex-1 py-2 rounded-lg bg-accent-700 text-white text-xs font-semibold">{"\uD83D\uDDA8\uFE0F"} Select & Print</button>
                        <button onClick={() => shareMaterial("Flashcards", savedFlashcards)} className="flex-1 py-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold">{"\uD83D\uDCE4"} WhatsApp</button>
                        <button onClick={() => generateMaterial("flashcards")} className="flex-1 py-2 rounded-lg border border-[#D0EAE4] text-primary-400 text-xs font-semibold">{"\uD83D\uDD04"} Reload</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={loadFlashcards} className="w-full py-2 rounded-lg bg-accent-700 text-white text-xs font-semibold">
                  {"\uD83C\uDCCF"} Lesson Flashcards ({lesson.vocabulary.length} cards)
                </button>
              )}
            </div>
          </PlanSection>
        )}

        {/* Activity */}
        {richPlan.activity && (
          <PlanSection emoji="\uD83C\uDFAE" title={safe(richPlan.activity.name) + " (" + safe(richPlan.activity.duration) + ")"} editing={editing} isEditing={editingSection === "act"} editText={editText}
            onEdit={() => { setEditingSection("act"); setEditText((richPlan.activity.steps || []).map((s: any) => safe(s.instruction)).join("\n")); }}
            onSave={() => saveSection()} onEditChange={setEditText}>
            <div className="space-y-2">
              {(richPlan.activity.steps || []).map((s: any, i: number) => (
                <div key={i} className="pl-3 py-1" style={{borderLeft: "3px solid #496580"}}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-primary-500">Step {safe(s.step)}</span>
                    <span className="text-xs text-primary-300">{safe(s.duration)}</span>
                  </div>
                  <p className="text-sm text-primary-700">{safe(s.instruction)}</p>
                </div>
              ))}
            </div>
            {(richPlan.activity.tip || richPlan.activity.management_tip) && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
                <p className="text-xs text-amber-700">{"\uD83D\uDCA1"} {safe(richPlan.activity.tip || richPlan.activity.management_tip)}</p>
              </div>
            )}
          </PlanSection>
        )}

        {/* Practice */}
        {richPlan.practice && (
          <PlanSection emoji="\uD83D\uDC65" title={"Practice \u2014 " + safe(richPlan.practice.mode) + " (" + safe(richPlan.practice.duration) + ")"} editing={editing} isEditing={editingSection === "prac"} editText={editText}
            onEdit={() => { setEditingSection("prac"); setEditText((richPlan.practice.steps || []).map(safe).join("\n")); }}
            onSave={() => { richPlan.practice.steps = editText.split("\n"); saveSection(); }}
            onEditChange={setEditText}>
            {(richPlan.practice.steps || []).length > 0 ? (
            <div className="space-y-2">
              {(richPlan.practice.steps || []).map((s: any, i: number) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="w-5 h-5 rounded-full bg-accent-50 text-primary-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i+1}</span>
                  <p className="text-sm text-primary-700">{safe(s)}</p>
                </div>
              ))}
            </div>
            ) : richPlan.practice.instruction ? (
              <p className="text-sm text-primary-700 leading-relaxed">{safe(richPlan.practice.instruction)}</p>
            ) : null}
            {richPlan.practice.student_action && (
              <div className="bg-accent-50 border border-blue-200 rounded-lg px-3 py-2 mt-3">
                <p className="text-xs text-blue-700">{"\uD83D\uDC64"} Each student: {safe(richPlan.practice.student_action)}</p>
              </div>
            )}
          </PlanSection>
        )}

        {/* Assessment + Worksheet */}
        {richPlan.assessment && (
          <PlanSection emoji="\u2705" title={"Assessment \u2014 " + safe(richPlan.assessment.type) + " (" + safe(richPlan.assessment.duration) + ")"} editing={editing} isEditing={editingSection === "assess"} editText={editText}
            onEdit={() => { setEditingSection("assess"); setEditText((richPlan.assessment.questions || []).map(safe).join("\n")); }}
            onSave={() => { richPlan.assessment.questions = editText.split("\n"); saveSection(); }}
            onEditChange={setEditText}>
            <div className="space-y-1.5">
              {(richPlan.assessment.questions || []).map((q: any, i: number) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-xs text-primary-300 shrink-0 mt-0.5">Q{i+1}.</span>
                  <p className="text-sm text-primary-700">{safe(q)}</p>
                </div>
              ))}
            </div>
            {richPlan.assessment.exit_token && (
              <div className="bg-accent-50 border border-accent-300 rounded-lg px-3 py-2 mt-3">
                <p className="text-xs text-accent-800">{"\uD83D\uDEAA"} Exit: {safe(richPlan.assessment.exit_token)}</p>
              </div>
            )}
            {/* Smart worksheet button */}
            <div className="mt-3 pt-3 border-t border-[#D0EAE4]">
              {savedWorksheet ? (
                <div>
                  <button onClick={() => setShowWorksheet(!showWorksheet)} className="w-full py-2 rounded-lg border border-primary-500 text-primary-500 text-xs font-semibold mb-2">
                    {showWorksheet ? "Hide Worksheet" : "\uD83D\uDCDD View Worksheet (" + savedWorksheet.length + " items)"}
                  </button>
                  {showWorksheet && (
                    <div>
                      <div className="space-y-2 mb-2">
                        {savedWorksheet.map((it: any, i: number) => (
                          <div key={i} className="border border-[#D0EAE4] rounded-lg p-2.5">
                            <p className="text-xs font-semibold text-primary-700">{(i+1)}. {safe(it.instruction_local || it.instruction_en || "")}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => router.push("/worksheet/" + lessonId + "?day=" + day)} className="flex-1 py-1.5 rounded-lg border border-accent-700 text-accent-700 text-xs font-semibold">{"\uD83D\uDCCB"} Full View</button>
                        <button onClick={() => printMaterial("Worksheet", savedWorksheet, "worksheet")} className="flex-1 py-1.5 rounded-lg bg-accent-700 text-white text-xs font-semibold">{"\uD83D\uDCC4"} PDF</button>
                        <button onClick={() => shareMaterial("Worksheet", savedWorksheet)} className="flex-1 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold">{"\uD83D\uDCE4"} WhatsApp</button>
                        <button onClick={() => generateMaterial("worksheet")} className="flex-1 py-1.5 rounded-lg border border-[#D0EAE4] text-primary-400 text-xs font-semibold">{"\uD83D\uDD04"}</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => generateMaterial("worksheet")} disabled={genLoading === "worksheet"} className="w-full py-2 rounded-lg bg-accent-700 text-white text-xs font-semibold disabled:opacity-50">
                  {genLoading === "worksheet" ? "Generating..." : "\uD83D\uDCDD Generate Worksheet"}
                </button>
              )}
            </div>
          </PlanSection>
        )}

        {/* Board plan */}
        {richPlan.board_plan && (
          <PlanSection emoji="\uD83D\uDCDD" title="Blackboard Plan" editing={editing} isEditing={editingSection === "board"} editText={editText}
            onEdit={() => { setEditingSection("board"); setEditText(safe(richPlan.board_plan)); }}
            onSave={() => { richPlan.board_plan = editText; saveSection(); }}
            onEditChange={setEditText}>
            <p className="text-sm text-primary-700 leading-relaxed whitespace-pre-wrap">{safe(richPlan.board_plan)}</p>
          </PlanSection>
        )}

        {/* Closure */}
        {richPlan.closure && (
          <PlanSection emoji="\uD83D\uDC4B" title={"Closure (" + safe(richPlan.closure.duration) + ")"} editing={editing} isEditing={editingSection === "close"} editText={editText}
            onEdit={() => { setEditingSection("close"); setEditText(safe(richPlan.closure.instruction)); }}
            onSave={() => { richPlan.closure.instruction = editText; saveSection(); }}
            onEditChange={setEditText}>
            <p className="text-sm text-primary-700 leading-relaxed">{safe(richPlan.closure.instruction)}</p>
          </PlanSection>
        )}

        {/* Vocabulary */}
        <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm px-4 py-4">
          <p className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-2">{"\uD83D\uDCDA"} Vocabulary</p>
          <div className="flex flex-wrap gap-1.5">
            {lesson.vocabulary.map((w: string, i: number) => (
              <span key={i} className="text-xs px-2.5 py-1 bg-white border border-[#D0EAE4] rounded-lg text-primary-700 font-medium">{w}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom — save or regenerate only */}
      <div className="shrink-0 bg-white border-t border-[#D0EAE4] px-5 py-3 shadow-lg">
        <div className="max-w-[480px] mx-auto flex gap-2">
          <button
            onClick={savePlanAndReturn}
            className="flex-1 py-2.5 rounded-xl bg-accent-700 text-white text-sm font-semibold"
          >
            {"\u2705"} Save plan
          </button>
          <button
            onClick={regeneratePlan}
            className="flex-1 py-2.5 rounded-xl border border-[#D0EAE4] text-primary-600 text-sm font-semibold"
          >
            {"\uD83D\uDD04"} Regenerate
          </button>
        </div>
      </div>
    </main>
  );
}

function PlanSection({ emoji, title, children, editing, isEditing, editText, onEdit, onSave, onEditChange }: {
  emoji: string; title: string; children: React.ReactNode;
  editing: boolean; isEditing: boolean; editText: string;
  onEdit: () => void; onSave: () => void; onEditChange: (v: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-1 flex items-center justify-between">
        <p className="text-xs font-bold text-primary-500 uppercase tracking-wider">{emoji} {title}</p>
        {editing && !isEditing && <button onClick={onEdit} className="text-xs text-primary-500 font-semibold">{"\u270F\uFE0F"}</button>}
      </div>
      <div className="px-4 pb-4">
        {isEditing ? (
          <div className="mt-2">
            <textarea value={editText} onChange={(e) => onEditChange(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-[#D0EAE4] rounded-xl outline-none focus:border-primary-500 bg-white min-h-[80px] resize-none" />
            <button onClick={onSave} className="mt-2 px-4 py-1.5 rounded-lg bg-accent-700 text-white text-xs font-semibold">{"\u2705"} Save</button>
          </div>
        ) : (
          <div className="mt-1">{children}</div>
        )}
      </div>
    </div>
  );
}
