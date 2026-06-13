import type { Language } from "@/lib/translations";

/** Local meanings for flashcard backs / print — keyed by English word */
export const WORD_MEANINGS: Record<string, Partial<Record<Language, string>>> = {
  head: { mr: "डोके", hi: "सिर", ur: "سر" },
  shoulders: { mr: "खांदे", hi: "कंधे", ur: "کندھے" },
  eyes: { mr: "डोळे", hi: "आँखें", ur: "آنکھیں" },
  ears: { mr: "कान", hi: "कान", ur: "کان" },
  nose: { mr: "नाक", hi: "नाक", ur: "ناک" },
  mouth: { mr: "तोंड", hi: "मुँह", ur: "منہ" },
  hand: { mr: "हात", hi: "हाथ", ur: "ہاتھ" },
  hands: { mr: "हात", hi: "हाथ", ur: "ہاتھ" },
  feet: { mr: "पाय", hi: "पैर", ur: "پاؤں" },
  foot: { mr: "पाय", hi: "पैर", ur: "پاؤں" },
  neck: { mr: "मान", hi: "गर्दन", ur: "گردن" },
  fingers: { mr: "बोटे", hi: "उंगलियाँ", ur: "انگلیاں" },
  finger: { mr: "बोट", hi: "उंगली", ur: "انگلی" },
  chin: { mr: "हनु", hi: "ठोड़ी", ur: "ٹھوڑی" },
  knee: { mr: "गुडघा", hi: "घुटना", ur: "گھٹنا" },
  toes: { mr: "पायचे बोट", hi: "पैर की उंगलियाँ", ur: "پاؤں کی انگلیاں" },
};

export function getWordMeaning(word: string, lang: Language): string {
  const entry = WORD_MEANINGS[word.toLowerCase().trim()];
  if (!entry) return "";
  return entry[lang] || entry.mr || "";
}
