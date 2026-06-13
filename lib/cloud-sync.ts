import type { SavedPlan } from "@/lib/plan-storage";
import { getAllPlans } from "@/lib/plan-storage";
import { readLocalProfile, writeLocalProfile } from "@/lib/profile-store";
import { isCloudEnabled } from "@/lib/supabase/config";
import { tryCreateClient } from "@/lib/supabase/client";

let profileSyncTimer: ReturnType<typeof setTimeout> | null = null;
let planSyncTimer: ReturnType<typeof setTimeout> | null = null;

async function hasSession(): Promise<boolean> {
  const supabase = tryCreateClient();
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

/** Merge local + cloud plans — keep newer timestamp per key */
export function mergePlans(
  local: Record<string, SavedPlan>,
  cloud: Record<string, SavedPlan>
): Record<string, SavedPlan> {
  const merged = { ...cloud };
  for (const [key, localPlan] of Object.entries(local)) {
    const cloudPlan = merged[key];
    if (!cloudPlan) {
      merged[key] = localPlan;
      continue;
    }
    const localTs = new Date(localPlan.savedAt || localPlan.completedAt || 0).getTime();
    const cloudTs = new Date(cloudPlan.savedAt || cloudPlan.completedAt || 0).getTime();
    if (localTs >= cloudTs) merged[key] = localPlan;
  }
  return merged;
}

/** Pull cloud data into localStorage after login */
export async function pullFromCloud(): Promise<{ ok: boolean; error?: string }> {
  if (!isCloudEnabled()) return { ok: false, error: "Cloud not configured" };
  if (!(await hasSession())) return { ok: false, error: "Not signed in" };

  try {
    const [profileRes, plansRes] = await Promise.all([
      fetch("/api/sync/profile"),
      fetch("/api/sync/plans"),
    ]);

    if (profileRes.ok) {
      const { profile } = await profileRes.json();
      if (profile && typeof profile === "object") {
        writeLocalProfile(profile as Record<string, string>);
      }
    }

    if (plansRes.ok) {
      const { plans } = await plansRes.json();
      if (plans && typeof plans === "object") {
        const local = getAllPlans();
        const merged = mergePlans(local, plans as Record<string, SavedPlan>);
        localStorage.setItem("savedPlans", JSON.stringify(merged));
        schedulePlanSync();
      }
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Sync failed" };
  }
}

/** Push local profile to cloud (debounced) */
export function scheduleProfileSync(): void {
  if (!isCloudEnabled()) return;
  if (profileSyncTimer) clearTimeout(profileSyncTimer);
  profileSyncTimer = setTimeout(async () => {
    if (!(await hasSession())) return;
    const profile = readLocalProfile();
    await fetch("/api/sync/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
  }, 800);
}

/** Push local plans to cloud (debounced) */
export function schedulePlanSync(): void {
  if (!isCloudEnabled()) return;
  if (planSyncTimer) clearTimeout(planSyncTimer);
  planSyncTimer = setTimeout(async () => {
    if (!(await hasSession())) return;
    const plans = getAllPlans();
    await fetch("/api/sync/plans", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plans }),
    });
  }, 1200);
}
