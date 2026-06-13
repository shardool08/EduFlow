"use client";

import { tryGetFirebaseAuth } from "@/lib/firebase/client";
import { isFirebaseEnabled } from "@/lib/firebase/config";
import { isCloudEnabled } from "@/lib/supabase/config";
import { tryCreateClient } from "@/lib/supabase/client";

export type AuthMode = "firebase" | "supabase" | "local";

/** Firebase takes priority when both are configured */
export function getAuthMode(): AuthMode {
  if (isFirebaseEnabled()) return "firebase";
  if (isCloudEnabled()) return "supabase";
  return "local";
}

export function isRemoteAuthEnabled(): boolean {
  return getAuthMode() !== "local";
}

export async function hasRemoteSession(): Promise<boolean> {
  const mode = getAuthMode();
  if (mode === "local") return true;

  if (mode === "firebase") {
    const auth = tryGetFirebaseAuth();
    if (!auth) return false;
    if (auth.currentUser) return true;
    return new Promise((resolve) => {
      const unsub = auth.onAuthStateChanged((user) => {
        unsub();
        resolve(!!user);
      });
    });
  }

  const supabase = tryCreateClient();
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}
