import { NextRequest, NextResponse } from "next/server";
import { requireEnv } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  try {
    const { words } = await req.json();

    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json({ error: "Missing words array" }, { status: 400 });
    }
    if (words.length > 20) {
      return NextResponse.json({ error: "Too many words (max 20)" }, { status: 400 });
    }

    const apiKey = requireEnv("UNSPLASH_ACCESS_KEY");
    if (!apiKey) {
      return NextResponse.json({ error: "Image service not configured" }, { status: 503 });
    }

    const results: { word: string; imageUrl: string }[] = [];

    for (const word of words) {
      if (typeof word !== "string") continue;
      try {
        const query = encodeURIComponent(word + " clipart simple illustration for kids");
        const res = await fetch(
          "https://api.unsplash.com/search/photos?query=" + query + "&per_page=1&orientation=squarish",
          { headers: { Authorization: "Client-ID " + apiKey }, signal: AbortSignal.timeout(15_000) }
        );
        if (!res.ok) {
          results.push({ word, imageUrl: "" });
          continue;
        }
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          results.push({ word, imageUrl: data.results[0].urls.small });
        } else {
          results.push({ word, imageUrl: "" });
        }
      } catch {
        results.push({ word, imageUrl: "" });
      }
    }

    return NextResponse.json({ images: results });
  } catch {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
