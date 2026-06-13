/** All teacher settings stored in localStorage and synced to Supabase profile JSON */

export const PROFILE_KEYS = [
  "lang",
  "phoneNumber",
  "teacherName",
  "district",
  "adminType",
  "zpName",
  "corpName",
  "medium",
  "englishComfort",
  "teacherGrades",
  "teacherSubjects",
  "schoolName",
  "location",
  "pinCode",
  "studentCount",
  "teacherResources",
  "internetAccess",
  "printingAccess",
  "teacherSection",
  "currentLesson",
  "schoolType",
  "classroomSize",
  "seatingArrangement",
  "canRearrange",
  "hasCharts",
  "hasStoryBooks",
  "hasSpeaker",
  "hasSmartBoard",
  "hasProjector",
  "socioEconomic",
  "studentHomeLanguage",
  "firstGenLearners",
  "parentalInvolvement",
] as const;

export type ProfileKey = (typeof PROFILE_KEYS)[number];

export function readLocalProfile(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = {};
  for (const key of PROFILE_KEYS) {
    const val = localStorage.getItem(key);
    if (val != null && val !== "") out[key] = val;
  }
  // currentLesson per grade/subject keys
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith("currentLesson_")) {
      const v = localStorage.getItem(k);
      if (v) out[k] = v;
    }
  }
  return out;
}

export function writeLocalProfile(data: Record<string, string>): void {
  if (typeof window === "undefined") return;
  for (const [key, value] of Object.entries(data)) {
    if (value === "" || value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  }
}

export function isProfileCompleteLocal(): boolean {
  if (typeof window === "undefined") return false;
  return !!(localStorage.getItem("phoneNumber") && localStorage.getItem("teacherName"));
}
