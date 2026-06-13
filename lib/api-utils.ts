import { NextResponse } from "next/server";

export function requireEnv(name: string): string | null {
  const value = process.env[name];
  return value && value.length > 0 ? value : null;
}

export async function anthropicMessages(body: object) {
  const apiKey = requireEnv("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return { ok: false as const, response: NextResponse.json({ error: "API key not configured" }, { status: 503 }) };
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });

  let data: any;
  try {
    data = await response.json();
  } catch {
    return { ok: false as const, response: NextResponse.json({ error: "Invalid response from AI service" }, { status: 502 }) };
  }

  if (!response.ok || data.error) {
    const status = response.status >= 400 ? response.status : 502;
    return {
      ok: false as const,
      response: NextResponse.json({ error: "AI service error" }, { status }),
    };
  }

  return { ok: true as const, data };
}

export function parseLessonGrade(lessonId: string): number {
  const match = lessonId.match(/^L?\d+/);
  if (!match) return 1;
  const digits = match[0].replace(/\D/g, "");
  return parseInt(digits, 10) || 1;
}
