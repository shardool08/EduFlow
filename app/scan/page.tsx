"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";
import type { Language } from "@/lib/translations";
import { getEmoji as getEmojiLocal } from "@/lib/emoji-map";

import { useAuthGuard } from "@/lib/auth";

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}
function ls(key: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) ?? "";
}

const ACTIONS = [
  { id: "plan_lesson", icon: "\uD83D\uDCDD", label: "Plan a Lesson", desc: "Generate a complete 7-phase lesson plan" },
  { id: "design_assessment", icon: "\uD83D\uDCCA", label: "Design Assessment", desc: "Create quiz, test questions & answer key" },
  { id: "create_activity", icon: "\uD83C\uDFAF", label: "Create Activity", desc: "Design engaging classroom activities" },
  { id: "make_flashcards", icon: "\uD83C\uDCCF", label: "Make Flashcards", desc: "Generate visual vocabulary flashcards" },
  { id: "create_worksheet", icon: "\uD83D\uDCC4", label: "Create Worksheet", desc: "Generate printable practice worksheet" },
  { id: "explain_content", icon: "\uD83D\uDCA1", label: "Explain to Me", desc: "Understand the page & how to teach it" },
];

type Step = "capture" | "choose" | "loading" | "result";

interface Flashcard {
  word: string;
  emoji: string;
  meaning: string;
}

export default function ScanPage() {
  const router = useRouter();
  useAuthGuard();
  const [lang, setLang] = useState<Language>("mr");
  const [step, setStep] = useState<Step>("capture");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setLang(getLang()); }, []);
  const isRtl = lang === "ur";

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 1024;
        const scale = Math.min(maxW / img.width, maxW / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setImagePreview(dataUrl);
        setImageBase64(dataUrl.split(",")[1]);
        setStep("choose");
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAction = async (actionId: string) => {
    setSelectedAction(actionId);
    setStep("loading");
    setError("");
    setFlashcards([]);

    try {
      if (actionId === "make_flashcards") {
        // Use the worksheet API which generates emoji flashcards
        const r = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64,
            action: "extract_vocabulary",
            teacherProfile: {
              name: ls("teacherName"),
              grade: JSON.parse(ls("teacherGrades") || "[1]")[0],
              medium: ls("medium"),
              studentCount: ls("studentCount"),
            },
          }),
        });
        if (!r.ok) {
          setError("Could not analyze image. Please try again.");
          setStep("choose");
          return;
        }
        const data = await r.json();
        if (data.error) {
          setError(data.error);
          setStep("choose");
          return;
        }
        // Parse vocabulary from AI response and generate flashcards with emojis
        const parsed = parseVocabulary(data.result);
        const cards = generateFlashcards(parsed.map(p => p.word));
        // Merge meanings from AI
        const cardsWithMeanings = cards.map((c, i) => ({
          ...c,
          meaning: parsed[i]?.meaning || c.meaning,
        }));
        setFlashcards(cardsWithMeanings);
        setResult(data.result);
        setStep("result");
      } else {
        const profile = {
          name: ls("teacherName"),
          grade: JSON.parse(ls("teacherGrades") || "[1]")[0],
          medium: ls("medium"),
          studentCount: ls("studentCount"),
        };
        const r = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64, action: actionId, teacherProfile: profile }),
        });
        if (!r.ok) {
          setError("Could not analyze image. Please try again.");
          setStep("choose");
          return;
        }
        const data = await r.json();
        if (data.error) {
          setError(data.error);
          setStep("choose");
        } else {
          setResult(data.result);
          setStep("result");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setStep("choose");
    }
  };

  // Words that should NEVER appear on a flashcard
  const EXCLUDED_WORDS = new Set([
    // Grammar terms
    "noun", "nouns", "verb", "verbs", "adjective", "adjectives", "pronoun", "pronouns",
    "singular", "plural", "tense", "tenses", "vowel", "vowels", "consonant", "consonants",
    "preposition", "conjunction", "article", "articles", "gender", "masculine", "feminine",
    "prefix", "suffix", "syllable", "syllables", "blend", "blends", "digraph", "rhyme",
    "punctuation", "comma", "exclamation", "question", "capital", "lowercase",
    // Language names
    "marathi", "hindi", "english", "urdu", "gujarati", "kannada", "bengali", "telugu",
    "tamil", "sindhi", "sanskrit", "arabic", "french", "german", "spanish",
    // Instruction words
    "read", "write", "answer", "fill", "match", "complete", "tick", "underline", "circle",
    "choose", "practise", "practice", "revise", "revision", "listen", "repeat", "say",
    "look", "tell", "ask", "learn", "find", "draw", "colour", "color", "copy", "trace",
    // Meta words
    "lesson", "unit", "page", "exercise", "activity", "example", "question", "word", "words",
    "meaning", "sentence", "sentences", "paragraph", "story", "poem", "passage", "text",
    "comprehension", "composition", "essay", "letter", "dialogue", "conversation",
    "chapter", "section", "part", "number", "option", "correct", "incorrect", "true", "false",
    // Abstract/common
    "the", "and", "for", "are", "but", "not", "you", "all", "can", "has", "her", "his",
    "how", "its", "may", "new", "now", "old", "see", "two", "way", "who", "did", "get",
    "let", "she", "too", "use", "with", "this", "that", "from", "have", "been", "each",
    "make", "like", "also", "very", "much", "many", "some", "more", "most", "than",
    "what", "when", "where", "which", "will", "would", "could", "should", "shall",
    "about", "after", "before", "between", "under", "over", "into", "onto",
    // Education meta
    "student", "students", "teacher", "class", "classroom", "school", "textbook", "workbook",
    "homework", "test", "exam", "grade", "standard", "medium", "subject", "curriculum",
    "balbharati", "maharashtra", "board",
  ]);

  // Parse vocabulary words and meanings from AI response
  const parseVocabulary = (text: string): { word: string; meaning: string }[] => {
    const results: { word: string; meaning: string }[] = [];
    const seen = new Set<string>();
    const lines = text.split("\n");
    for (const line of lines) {
      // Match: - **word** - meaning  OR  - **word**: meaning
      const match = line.match(/\*\*([a-zA-Z\s]+)\*\*\s*[-:]\s*(.+)/);
      if (match) {
        const w = match[1].trim().toLowerCase();
        const m = match[2].trim().replace(/\*\*/g, "");
        if (w && w.length > 1 && w.length < 20 && !seen.has(w) && !EXCLUDED_WORDS.has(w)) {
          seen.add(w);
          results.push({ word: w, meaning: m });
        }
      }
    }
    // Fallback: extract individual words if structured parsing fails
    if (results.length < 3) {
      const allWords = text.match(/\b[a-zA-Z]{2,15}\b/g) || [];
      for (const w of allWords) {
        const lw = w.toLowerCase();
        if (!EXCLUDED_WORDS.has(lw) && !seen.has(lw) && lw.length > 2) {
          seen.add(lw);
          results.push({ word: lw, meaning: "" });
        }
        if (results.length >= 12) break;
      }
    }
    return results.slice(0, 12);
  };

  // Generate flashcards with emoji mapping (no API call needed)
  const generateFlashcards = (words: string[]): Flashcard[] => {
    return words.map(w => ({ word: w, emoji: getEmojiLocal(w), meaning: "" }));
  };

  const printFlashcards = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const cardsHtml = flashcards.map(c =>
      `<div style="border:2px solid #D0EAE4;border-radius:12px;padding:16px;text-align:center;break-inside:avoid;">
        <div style="font-size:48px;margin-bottom:8px;">${c.emoji}</div>
        <div style="font-size:18px;font-weight:bold;color:#2A3D4E;">${c.word}</div>
        ${c.meaning ? `<div style="font-size:12px;color:#7A9AAC;margin-top:4px;">${c.meaning}</div>` : ""}
      </div>`
    ).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>Flashcards - PedaStudio</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #496580; font-size: 18px; }
        .meta { color: #7A9AAC; font-size: 12px; margin-bottom: 16px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media print { body { padding: 10px; } }
      </style></head><body>
      <h1>Vocabulary Flashcards</h1>
      <div class="meta">Generated by PedaStudio | ${new Date().toLocaleDateString()} | Teacher: ${ls("teacherName") || "Teacher"}</div>
      <div class="grid">${cardsHtml}</div></body></html>`);
    w.document.close();
    w.print();
  };

  const savePdf = () => {
    if (selectedAction === "make_flashcards") { printFlashcards(); return; }
    const actionLabel = ACTIONS.find(a => a.id === selectedAction)?.label || "Scan Result";
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>${actionLabel} - PedaStudio</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; color: #2A3D4E; line-height: 1.6; }
        h1 { color: #496580; border-bottom: 2px solid #D0EAE4; padding-bottom: 8px; font-size: 20px; }
        h2 { color: #2A7A6A; font-size: 16px; margin-top: 20px; }
        .meta { color: #7A9AAC; font-size: 12px; margin-bottom: 16px; }
        .content { white-space: pre-wrap; font-size: 14px; }
        strong, b { color: #496580; }
        @media print { body { padding: 10px; } }
      </style></head><body>
      <h1>${actionLabel}</h1>
      <div class="meta">Generated by PedaStudio | ${new Date().toLocaleDateString()} | Teacher: ${ls("teacherName") || "Teacher"}</div>
      <div class="content">${result.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</div>
      </body></html>`);
    w.document.close();
    w.print();
  };

  const shareWhatsApp = () => {
    const actionLabel = ACTIONS.find(a => a.id === selectedAction)?.label || "Scan Result";

    // Generate a formatted PDF page, print it (Save as PDF on mobile), then open WhatsApp
    const w = window.open("", "_blank");
    if (!w) {
      // Fallback: share as text if popup blocked
      let text = `*${actionLabel}* (PedaStudio)\n\n`;
      if (selectedAction === "make_flashcards" && flashcards.length > 0) {
        text += flashcards.map(c => `${c.emoji} *${c.word}*${c.meaning ? " - " + c.meaning : ""}`).join("\n");
      } else {
        text += result.substring(0, 3000);
      }
      window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
      return;
    }

    let bodyContent = "";
    if (selectedAction === "make_flashcards" && flashcards.length > 0) {
      bodyContent = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">` +
        flashcards.map(c => `<div style="border:2px solid #2A7A6A;border-radius:12px;padding:16px;text-align:center;">
          <div style="font-size:48px;">${c.emoji}</div>
          <div style="font-size:18px;font-weight:bold;color:#2A3D4E;margin-top:4px;">${c.word}</div>
          ${c.meaning ? `<div style="font-size:11px;color:#7A9AAC;margin-top:2px;">${c.meaning}</div>` : ""}
        </div>`).join("") + `</div>`;
    } else {
      bodyContent = `<div style="white-space:pre-wrap;font-size:13px;line-height:1.7;color:#2A3D4E;">` +
        result.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") + `</div>`;
    }

    w.document.write(`<!DOCTYPE html><html><head><title>${actionLabel} - PedaStudio</title>
      <style>
        @page { margin: 12mm; }
        body { font-family: Arial, sans-serif; padding: 16px; max-width: 800px; margin: 0 auto; }
        h1 { color: #496580; font-size: 18px; margin: 0 0 4px; }
        .meta { color: #7A9AAC; font-size: 11px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #D0EAE4; }
        strong { color: #496580; }
        .footer { text-align: center; font-size: 9px; color: #A0BAB4; margin-top: 20px; padding-top: 8px; border-top: 1px solid #D0EAE4; }
        .share-hint { text-align: center; padding: 12px; background: #F0FAF8; border-radius: 8px; margin-top: 16px; font-size: 12px; color: #2A7A6A; }
        @media print { .share-hint { display: none; } }
      </style></head><body>
      <h1>${actionLabel}</h1>
      <div class="meta">PedaStudio | ${new Date().toLocaleDateString()} | ${ls("teacherName") || "Teacher"}</div>
      ${bodyContent}
      <div class="footer">Generated by PedaStudio \u2022 AI-powered lesson planning for teachers</div>
      <div class="share-hint">
        \uD83D\uDCA1 <strong>Step 1:</strong> Tap "Print" or "Save as PDF" below<br>
        <strong>Step 2:</strong> Save the PDF to your phone<br>
        <strong>Step 3:</strong> Open WhatsApp and share the saved PDF
      </div>
      <script>
        setTimeout(function() { window.print(); }, 500);
        window.onafterprint = function() {
          // After printing/saving, show WhatsApp button
          document.querySelector('.share-hint').innerHTML = '<a href="https://wa.me/" target="_blank" style="display:inline-block;padding:12px 24px;background:#25D366;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">\uD83D\uDCE4 Open WhatsApp to Share</a>';
        };
      </script>
      </body></html>`);
    w.document.close();
  };

  const tryAnother = () => {
    setStep("choose");
    setResult("");
    setFlashcards([]);
    setSelectedAction("");
  };

  const retake = () => {
    setStep("capture");
    setImageBase64("");
    setImagePreview("");
    setResult("");
    setFlashcards([]);
    setSelectedAction("");
    setError("");
  };

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="flex flex-col min-h-screen bg-white">
      <header className="bg-white border-b border-[#D0EAE4] px-5 py-4 flex items-center gap-3">
        <button onClick={() => router.push("/home")} className="text-primary-400 text-lg">{"\u2190"}</button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-primary-800">Scan Textbook</h1>
          <p className="text-xs text-primary-300">Take a photo of any textbook page</p>
        </div>
      </header>

      <div className="flex-1 px-5 py-5">
        {/* STEP 1: Capture */}
        {step === "capture" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="w-28 h-28 rounded-2xl bg-accent-50 border-2 border-dashed border-accent-300 flex items-center justify-center">
              <span className="text-4xl">{"\uD83D\uDCF7"}</span>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-primary-800">Scan a textbook page</p>
              <p className="text-sm text-primary-400 mt-2 leading-relaxed">Take a clear photo of any page and AI will help you create lesson plans, assessments, activities & more</p>
            </div>
            <div className="w-full max-w-xs space-y-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 rounded-xl bg-accent-700 text-white font-semibold text-base shadow-sm active:bg-accent-800"
              >
                Open Camera
              </button>
              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.removeAttribute("capture");
                    fileInputRef.current.click();
                    setTimeout(() => fileInputRef.current?.setAttribute("capture", "environment"), 500);
                  }
                }}
                className="w-full py-3 rounded-xl border border-[#D0EAE4] text-primary-600 font-semibold text-sm"
              >
                Choose from Gallery
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleCapture} className="hidden" />
          </div>
        )}

        {/* STEP 2: Choose action */}
        {step === "choose" && (
          <div className="space-y-5">
            <div className="relative rounded-xl overflow-hidden border border-[#D0EAE4] shadow-sm">
              <img src={imagePreview} alt="Scanned page" className="w-full max-h-48 object-cover" />
              <button onClick={retake} className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-white/90 text-xs font-semibold text-primary-600 shadow-sm border border-[#D0EAE4]">
                {"\uD83D\uDD04"} Retake
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-primary-800 mb-3">What would you like to create?</p>
              <div className="space-y-2">
                {ACTIONS.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action.id)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-[#D0EAE4] bg-white text-start active:bg-accent-50 transition-colors"
                  >
                    <span className="text-2xl shrink-0">{action.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary-800">{action.label}</p>
                      <p className="text-xs text-primary-400 mt-0.5">{action.desc}</p>
                    </div>
                    <span className="text-primary-300 shrink-0">{"\u2192"}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Loading */}
        {step === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-14 h-14 rounded-full border-4 border-accent-200 border-t-accent-700 animate-spin" />
            <div className="text-center">
              <p className="text-base font-semibold text-primary-800">
                {ACTIONS.find(a => a.id === selectedAction)?.icon} {ACTIONS.find(a => a.id === selectedAction)?.label}
              </p>
              <p className="text-sm text-primary-400 mt-1">AI is analyzing the textbook page</p>
              <p className="text-xs text-primary-300 mt-3">This usually takes 10-15 seconds</p>
            </div>
          </div>
        )}

        {/* STEP 4: Result */}
        {step === "result" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-accent-50 rounded-xl p-3 border border-[#D0EAE4]">
              <span className="text-2xl">{ACTIONS.find(a => a.id === selectedAction)?.icon}</span>
              <div>
                <p className="text-sm font-bold text-accent-800">{ACTIONS.find(a => a.id === selectedAction)?.label}</p>
                <p className="text-xs text-primary-400">Generated from scanned page</p>
              </div>
            </div>

            {/* Flashcards visual grid */}
            {selectedAction === "make_flashcards" && flashcards.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {flashcards.map((card, i) => (
                    <div key={i} className="bg-white rounded-xl border-2 border-[#D0EAE4] p-3 text-center shadow-sm">
                      <span className="text-3xl block mb-1">{card.emoji}</span>
                      <p className="text-sm font-bold text-primary-800 capitalize">{card.word}</p>
                      {card.meaning && <p className="text-[10px] text-primary-400 mt-0.5 leading-tight">{card.meaning}</p>}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem("flashcards_to_print", JSON.stringify(flashcards));
                    router.push("/flashcards");
                  }}
                  className="w-full py-3.5 rounded-xl bg-accent-700 text-white font-semibold text-sm flex items-center justify-center gap-2 active:bg-accent-800"
                >
                  {"\uD83D\uDDA8\uFE0F"} Select & Print Flashcards
                </button>
              </div>
            ) : (
              /* Text result */
              <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm px-4 py-4">
                <div className="text-sm text-primary-700 leading-relaxed">
                  {result.split("\n").map((line, i) => {
                    const bold = line.match(/^\*\*(.*?)\*\*(.*)$/);
                    if (bold) return <p key={i} className="mt-3 mb-1"><span className="font-bold text-primary-800">{bold[1]}</span>{bold[2]}</p>;
                    if (line.startsWith("# ")) return <h2 key={i} className="text-base font-bold text-primary-800 mt-4 mb-2">{line.slice(2)}</h2>;
                    if (line.startsWith("## ")) return <h3 key={i} className="text-sm font-bold text-accent-800 mt-3 mb-1">{line.slice(3)}</h3>;
                    if (line.startsWith("### ")) return <h4 key={i} className="text-sm font-semibold text-primary-700 mt-2 mb-1">{line.slice(4)}</h4>;
                    if (line.startsWith("- ")) return <p key={i} className="ml-3 text-primary-600">{"\u2022"} {line.slice(2)}</p>;
                    if (line.match(/^\d+\.\s/)) return <p key={i} className="ml-3 text-primary-600">{line}</p>;
                    if (line.trim() === "") return <div key={i} className="h-2" />;
                    return <p key={i} className="text-primary-600">{line.replace(/\*\*(.*?)\*\*/g, "$1")}</p>;
                  })}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button onClick={savePdf} className="flex-1 py-3 rounded-xl bg-accent-700 text-white font-semibold text-sm flex items-center justify-center gap-2">
                {"\uD83D\uDCC4"} Save PDF
              </button>
              <button onClick={shareWhatsApp} className="flex-1 py-3 rounded-xl bg-[#25D366] text-white font-semibold text-sm flex items-center justify-center gap-2">
                {"\uD83D\uDCE4"} WhatsApp
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={tryAnother} className="flex-1 py-3 rounded-xl border border-[#D0EAE4] text-primary-600 font-semibold text-sm">
                {"\uD83D\uDD04"} Try Another
              </button>
              <button onClick={retake} className="flex-1 py-3 rounded-xl border border-[#D0EAE4] text-primary-600 font-semibold text-sm">
                {"\uD83D\uDCF7"} New Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
