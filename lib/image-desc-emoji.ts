import { getEmoji } from "@/lib/emoji-map";

/** Turn worksheet image_desc or a vocabulary word into a display emoji */
export function emojiForImageDesc(desc: string, wordHint?: string): string {
  if (wordHint) {
    const fromWord = getEmoji(wordHint.toLowerCase().trim());
    if (fromWord && fromWord !== "❓") return fromWord;
  }
  const cleaned = desc.replace(/picture of |photo of |image of |drawing of /gi, "").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  for (let i = words.length - 1; i >= 0; i--) {
    const token = words[i].replace(/[^a-z]/gi, "").toLowerCase();
    if (!token) continue;
    const e = getEmoji(token);
    if (e && e !== "❓") return e;
  }
  return "🖼️";
}
