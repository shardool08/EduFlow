import { NextRequest, NextResponse } from "next/server";
import { isApiAuthConfigured, verifyFirebaseIdToken } from "@/lib/firebase/admin";

/** Require a logged-in Firebase user. Dev without service account allows local testing. */
export async function requireApiUser(req: NextRequest): Promise<{ uid: string } | NextResponse> {
  const header = req.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token) {
    if (process.env.NODE_ENV === "development" && !isApiAuthConfigured()) {
      return { uid: "dev-local" };
    }
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const uid = await verifyFirebaseIdToken(token);
  if (!uid) {
    // Local dev: Android sends a real Firebase token but Admin SDK may be unconfigured.
    if (process.env.NODE_ENV === "development") {
      return { uid: "dev-local" };
    }
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }
  return { uid };
}
