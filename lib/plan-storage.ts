import { schedulePlanSync } from "@/lib/cloud-sync";

export interface PlanPhase {
  title: string;
  emoji: string;
  selection: string;
  detail: string;
}
export interface SavedPlan {
  lessonId: string;
  day: number;
  status: "not_started" | "planned" | "completed";
  planData?: Record<string, string>;
  phases?: PlanPhase[];
  richPlan?: any;
  materials?: {
    flashcards?: any[];
    worksheet?: any[];
  };
  feedback?: "went_well" | "some_struggled" | "most_didnt_understand" | "couldnt_finish" | "ready_for_more";
  savedAt?: string;
  completedAt?: string;
}

export function saveMaterials(lessonId: string, day: number, type: "flashcards" | "worksheet", items: any[]): void {
  const plans = getAllPlans();
  const key = lessonId + "-day" + day;
  const existing = plans[key] || { lessonId, day, status: "planned" };
  if (!existing.materials) existing.materials = {};
  existing.materials[type] = items;
  plans[key] = existing;
  localStorage.setItem("savedPlans", JSON.stringify(plans));
  schedulePlanSync();
}

export function getAllPlans(): Record<string, SavedPlan> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem("savedPlans");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function getPlan(lessonId: string, day: number): SavedPlan {
  const plans = getAllPlans();
  const key = lessonId + "-day" + day;
  return plans[key] || { lessonId, day, status: "not_started" };
}

export function savePlan(
  lessonId: string,
  day: number,
  planData: Record<string, string>,
  phases: PlanPhase[],
  richPlan?: any
): void {
  const plans = getAllPlans();
  const key = lessonId + "-day" + day;
  plans[key] = {
    lessonId,
    day,
    status: "planned",
    planData,
    phases,
    richPlan,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem("savedPlans", JSON.stringify(plans));
  schedulePlanSync();
}

export function updateRichPlan(lessonId: string, day: number, richPlan: any): void {
  const plans = getAllPlans();
  const key = lessonId + "-day" + day;
  const existing = plans[key] || { lessonId, day, status: "planned" as const };
  plans[key] = { ...existing, richPlan, savedAt: existing.savedAt || new Date().toISOString() };
  localStorage.setItem("savedPlans", JSON.stringify(plans));
  schedulePlanSync();
}

export function completePlan(lessonId: string, day: number, feedback: SavedPlan["feedback"]): void {
  const plans = getAllPlans();
  const key = lessonId + "-day" + day;
  const existing = plans[key] || { lessonId, day, status: "planned" };
  plans[key] = { ...existing, status: "completed", feedback, completedAt: new Date().toISOString() };
  localStorage.setItem("savedPlans", JSON.stringify(plans));
  schedulePlanSync();
}

export function getLessonStatus(lessonId: string, totalDays: number): "not_started" | "planned" | "in_progress" | "completed" {
  const plans = getAllPlans();
  let hasPlanned = false;
  let hasCompleted = false;
  let allCompleted = true;
  for (let d = 1; d <= totalDays; d++) {
    const plan = plans[lessonId + "-day" + d];
    if (plan?.status === "planned") hasPlanned = true;
    if (plan?.status === "completed") hasCompleted = true;
    if (!plan || plan.status !== "completed") allCompleted = false;
  }
  if (allCompleted && totalDays > 0) return "completed";
  if (hasCompleted) return "in_progress";
  if (hasPlanned) return "planned";
  return "not_started";
}

export function getFirstUnplannedDay(lessonId: string, totalDays: number): number | null {
  for (let d = 1; d <= totalDays; d++) {
    const plan = getPlan(lessonId, d);
    if (plan.status === "not_started") return d;
  }
  return null;
}

export function getFirstPlannedDay(lessonId: string, totalDays: number): number | null {
  for (let d = 1; d <= totalDays; d++) {
    const plan = getPlan(lessonId, d);
    if (plan.status === "planned" || plan.status === "completed") return d;
  }
  return null;
}

export function getNextAction(lessonId: string, day: number, feedback: SavedPlan["feedback"], totalDays: number) {
  const base = "/quick-plan/" + lessonId + "?day=";
  if (feedback === "went_well" || feedback === "ready_for_more") {
    if (day < totalDays) return { action: "next_day", label: "Continue to Day " + (day + 1), description: "Students understood well. Move ahead.", route: base + (day + 1) };
    return { action: "next_lesson", label: "Move to next lesson", description: "All days completed!", route: "/home" };
  }
  if (feedback === "some_struggled") return { action: "practice", label: "Add a practice day", description: "Repeat with a different activity.", route: base + day + "&mode=practice" };
  if (feedback === "most_didnt_understand") return { action: "reteach", label: "Re-teach this day", description: "Try a simpler approach.", route: base + day + "&mode=reteach" };
  if (feedback === "couldnt_finish") return { action: "continue", label: "Continue same plan", description: "Pick up where you left off.", route: base + day + "&mode=continue" };
  return { action: "next", label: "Continue", description: "", route: base + (day + 1) };
}
