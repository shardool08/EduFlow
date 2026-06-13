"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getEmoji } from "@/lib/emoji-map";
import { findLessonById } from "@/lib/lesson-utils";
import { getLessonFlashcards } from "@/lib/flashcards";
import { FlashcardVisual } from "@/components/FlashcardVisual";
import type { Language } from "@/lib/translations";

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

interface FlashcardData {
  word: string;
  emoji: string;
  meaning: string;
  imageUrl?: string;
}

function cardVisualHtml(c: FlashcardData, emojiSize: string, imgSize: string): string {
  if (c.imageUrl) {
    return `<img src="${c.imageUrl}" alt="${c.word}" style="width:${imgSize};height:${imgSize};object-fit:contain;border-radius:8px;" onerror="this.outerHTML='<div style=\\'font-size:${emojiSize};line-height:1.2\\'>${c.emoji}</div>'" />`;
  }
  return `<div style="font-size: ${emojiSize}; line-height: 1.2;">${c.emoji}</div>`;
}

function FlashcardPrintContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonParam = searchParams.get("lesson");
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [printSize, setPrintSize] = useState<"2" | "4" | "6">("2"); // cards per A4 page

  useEffect(() => {
    const lang = getLang();
    const raw = localStorage.getItem("flashcards_to_print");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const mapped = parsed.map((c: any) => ({
          word: c.word || "",
          emoji: c.emoji || getEmoji(c.word || ""),
          meaning: c.meaning || "",
          imageUrl: c.imageUrl || "",
        }));
        setCards(mapped);
        setSelected(new Set(mapped.map((_: any, i: number) => i)));
        return;
      } catch {}
    }
    if (lessonParam) {
      const lesson = findLessonById(lessonParam);
      if (lesson) {
        const mapped = getLessonFlashcards(lesson, lang);
        setCards(mapped);
        setLessonTitle(lesson.id + " " + lesson.en);
        setSelected(new Set(mapped.map((_, i) => i)));
      }
    }
  }, [lessonParam]);

  const toggleCard = (idx: number) => {
    const next = new Set(selected);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelected(next);
  };

  const selectAll = () => setSelected(new Set(cards.map((_, i) => i)));
  const deselectAll = () => setSelected(new Set());
  const allSelected = selected.size === cards.length;

  const selectedCards = cards.filter((_, i) => selected.has(i));

  const printCards = () => {
    const w = window.open("", "_blank");
    if (!w) return;

    const perPage = parseInt(printSize);
    // Layout: 2 per page = huge (classroom), 4 = medium, 6 = small
    const cardHeight = perPage === 2 ? "46vh" : perPage === 4 ? "22vh" : "14vh";
    const emojiSize = perPage === 2 ? "120px" : perPage === 4 ? "72px" : "48px";
    const wordSize = perPage === 2 ? "48px" : perPage === 4 ? "32px" : "22px";
    const meaningSize = perPage === 2 ? "18px" : perPage === 4 ? "14px" : "11px";
    const cols = perPage === 6 ? 2 : 1;

    const imgSize = perPage === 2 ? "120px" : perPage === 4 ? "72px" : "48px";

    const cardsHtml = selectedCards.map(c => `
      <div style="
        height: ${cardHeight};
        border: 3px solid #2A7A6A;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        break-inside: avoid;
        background: white;
        ${cols === 2 ? "width: 48%;" : "width: 100%;"}
      ">
        ${cardVisualHtml(c, emojiSize, imgSize)}
        <div style="font-size: ${wordSize}; font-weight: 800; color: #2A3D4E; margin-top: 8px; text-transform: capitalize; letter-spacing: 2px;">${c.word}</div>
        ${c.meaning ? `<div style="font-size: ${meaningSize}; color: #7A9AAC; margin-top: 6px; text-align: center; max-width: 80%;">${c.meaning}</div>` : ""}
      </div>
    `).join("\n");

    w.document.write(`<!DOCTYPE html><html><head>
      <title>Flashcards - PedaStudio</title>
      <style>
        @page { margin: 10mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; }
        .page {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: ${cols === 2 ? "row" : "column"};
          ${cols === 2 ? "flex-wrap: wrap; justify-content: space-between;" : ""}
          gap: 12px;
          padding: 8px 0;
          break-after: page;
        }
        .header {
          width: 100%;
          text-align: center;
          padding: 8px;
          color: #7A9AAC;
          font-size: 11px;
          border-bottom: 1px dashed #D0EAE4;
          margin-bottom: 8px;
          break-after: avoid;
        }
        .cut-line {
          width: 100%;
          border-bottom: 2px dashed #D0EAE4;
          margin: 4px 0;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head><body>`);

    // Group cards into pages
    for (let i = 0; i < selectedCards.length; i += perPage) {
      const pageCards = selectedCards.slice(i, i + perPage);
      const pageHtml = pageCards.map(c => `
        <div style="
          height: ${cardHeight};
          border: 3px solid #2A7A6A;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          break-inside: avoid;
          background: white;
          ${cols === 2 ? "width: 48%;" : "width: 100%;"}
        ">
          ${cardVisualHtml(c, emojiSize, imgSize)}
          <div style="font-size: ${wordSize}; font-weight: 800; color: #2A3D4E; margin-top: 8px; text-transform: capitalize; letter-spacing: 2px;">${c.word}</div>
          ${c.meaning ? `<div style="font-size: ${meaningSize}; color: #7A9AAC; margin-top: 6px; text-align: center; max-width: 80%;">${c.meaning}</div>` : ""}
        </div>
      `).join(cols === 1 ? '<div class="cut-line"></div>' : "");

      w.document.write(`
        <div class="page">
          ${i === 0 ? '<div class="header">PedaStudio Flashcards | Print & Cut | ' + new Date().toLocaleDateString() + '</div>' : ""}
          ${pageHtml}
        </div>
      `);
    }

    w.document.write("</body></html>");
    w.document.close();
    setTimeout(() => w.print(), 300);
  };

  const shareWhatsApp = () => {
    // Generate a PDF-ready page with selected flashcards, then prompt save + share
    const w = window.open("", "_blank");
    if (!w) {
      // Fallback text share
      const text = "*PedaStudio Flashcards*\n\n" + selectedCards.map(c =>
        `${c.emoji}  *${c.word}*${c.meaning ? " — " + c.meaning : ""}`
      ).join("\n");
      window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
      return;
    }
    const perPage = parseInt(printSize);
    const emojiSize = perPage === 2 ? "100px" : perPage === 4 ? "64px" : "40px";
    const wordSize = perPage === 2 ? "40px" : perPage === 4 ? "28px" : "20px";
    const cardPad = perPage === 2 ? "24px" : perPage === 4 ? "16px" : "10px";

    const cardsHtml = selectedCards.map(c => `
      <div style="border:3px solid #2A7A6A;border-radius:16px;padding:${cardPad};text-align:center;break-inside:avoid;margin-bottom:12px;">
        ${c.imageUrl
          ? `<img src="${c.imageUrl}" alt="${c.word}" style="width:${emojiSize};height:${emojiSize};object-fit:contain;border-radius:8px;" />`
          : `<div style="font-size:${emojiSize};">${c.emoji}</div>`}
        <div style="font-size:${wordSize};font-weight:800;color:#2A3D4E;margin-top:6px;text-transform:capitalize;letter-spacing:2px;">${c.word}</div>
        ${c.meaning ? `<div style="font-size:12px;color:#7A9AAC;margin-top:4px;">${c.meaning}</div>` : ""}
      </div>
    `).join("");

    w.document.write(`<!DOCTYPE html><html><head><title>Flashcards - PedaStudio</title>
      <style>
        @page { margin: 10mm; }
        body { font-family: Arial, sans-serif; padding: 12px; }
        .header { text-align: center; color: #496580; font-size: 16px; font-weight: bold; margin-bottom: 4px; }
        .meta { text-align: center; color: #7A9AAC; font-size: 10px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #D0EAE4; }
        .footer { text-align: center; font-size: 9px; color: #A0BAB4; margin-top: 16px; padding-top: 6px; border-top: 1px solid #D0EAE4; }
        .share-hint { text-align: center; padding: 12px; background: #F0FAF8; border-radius: 8px; margin-top: 12px; font-size: 12px; color: #2A7A6A; }
        @media print { .share-hint { display: none; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style></head><body>
      <div class="header">PedaStudio Flashcards</div>
      <div class="meta">${selectedCards.length} cards | ${new Date().toLocaleDateString()} | ${localStorage.getItem("teacherName") || "Teacher"}</div>
      ${cardsHtml}
      <div class="footer">Generated by PedaStudio</div>
      <div class="share-hint">
        \uD83D\uDCA1 <b>Step 1:</b> Save as PDF \u2192 <b>Step 2:</b> Share on WhatsApp<br><br>
        <a href="https://wa.me/" target="_blank" style="display:inline-block;padding:10px 20px;background:#25D366;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">\uD83D\uDCE4 Open WhatsApp</a>
      </div>
      <script>setTimeout(function(){ window.print(); }, 500);</script>
      </body></html>`);
    w.document.close();
  };

  if (cards.length === 0) {
    return (
      <main className="flex flex-col min-h-screen bg-white">
        <header className="bg-white border-b border-[#D0EAE4] px-5 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-primary-400 text-lg">{"\u2190"}</button>
          <h1 className="text-base font-bold text-primary-800">Flashcards</h1>
        </header>
        <div className="flex-1 flex items-center justify-center text-primary-300 px-6 text-center">
          <p>No flashcards to show. Generate flashcards from a lesson or by scanning a textbook page.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <header className="bg-white border-b border-[#D0EAE4] px-5 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-primary-400 text-lg">{"\u2190"}</button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-primary-800">Select Flashcards</h1>
            <p className="text-xs text-primary-300">{selected.size} of {cards.length} selected{lessonTitle ? " \u2022 " + lessonTitle : ""}</p>
          </div>
          <button onClick={allSelected ? deselectAll : selectAll} className="text-xs font-semibold text-accent-700 px-3 py-1.5 rounded-lg bg-accent-50 border border-[#D0EAE4]">
            {allSelected ? "Deselect All" : "Select All"}
          </button>
        </div>
      </header>

      <div className="flex-1 px-4 py-4 overflow-y-auto pb-48">
        {/* Card grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {cards.map((card, i) => {
            const isSelected = selected.has(i);
            return (
              <button
                key={i}
                onClick={() => toggleCard(i)}
                className={`relative rounded-xl border-2 p-3 text-center transition-all ${
                  isSelected
                    ? "border-accent-700 bg-accent-50 shadow-sm"
                    : "border-[#D0EAE4] bg-white opacity-50"
                }`}
              >
                {/* Selection indicator */}
                <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  isSelected ? "bg-accent-700 text-white" : "bg-primary-100 text-primary-300"
                }`}>
                  {isSelected ? "\u2713" : ""}
                </div>
                <FlashcardVisual word={card.word} emoji={card.emoji} imageUrl={card.imageUrl || undefined} emojiClassName="text-3xl block mb-1" imgClassName="w-14 h-14 mx-auto object-contain rounded-lg mb-1" />
                <p className="text-xs font-bold text-primary-800 capitalize">{card.word}</p>
                {card.meaning && <p className="text-[9px] text-primary-400 mt-0.5 leading-tight line-clamp-2">{card.meaning}</p>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom action bar — fixed */}
      {selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D0EAE4] px-4 py-4 shadow-lg">
          <div className="max-w-[480px] mx-auto space-y-3">
            {/* Print size selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary-400 shrink-0">Print size:</span>
              <div className="flex gap-1.5 flex-1">
                {([
                  { val: "2" as const, label: "Large (2/page)", desc: "Classroom visible" },
                  { val: "4" as const, label: "Medium (4/page)", desc: "Group work" },
                  { val: "6" as const, label: "Small (6/page)", desc: "Individual" },
                ]).map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setPrintSize(opt.val)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      printSize === opt.val
                        ? "bg-accent-700 text-white"
                        : "bg-accent-50 text-primary-500 border border-[#D0EAE4]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button onClick={printCards} className="flex-1 py-3.5 rounded-xl bg-accent-700 text-white font-semibold text-sm flex items-center justify-center gap-2 active:bg-accent-800">
                {"\uD83D\uDDA8\uFE0F"} Print {selected.size} Cards
              </button>
              <button onClick={shareWhatsApp} className="flex-1 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm flex items-center justify-center gap-2">
                {"\uD83D\uDCE4"} WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function FlashcardPrintPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-col min-h-screen bg-white items-center justify-center">
          <p className="text-sm text-primary-300">Loading flashcards...</p>
        </main>
      }
    >
      <FlashcardPrintContent />
    </Suspense>
  );
}
