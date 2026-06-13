/** Teaching-learning material IDs shared between registration and quick-plan */
export const TLM_RESOURCES = [
  { id: "blackboard", label: "Blackboard / Whiteboard" },
  { id: "flashcards", label: "Flashcards" },
  { id: "chart", label: "Charts / Posters" },
  { id: "picture_cards", label: "Story Books / Picture cards" },
  { id: "textbook", label: "Textbook (Balbharati)" },
  { id: "notebook", label: "Notebooks for students" },
  { id: "phone", label: "Speaker / Audio player" },
  { id: "projector", label: "Projector / Smart Board / TV" },
  { id: "computer", label: "Computer / Laptop" },
  { id: "printer", label: "Printer" },
  { id: "real_objects", label: "Craft materials / Realia" },
  { id: "puppets", label: "Puppets / Props" },
  { id: "ball", label: "Educational toys / Games" },
] as const;

/** Map legacy registration resource IDs to current quick-plan IDs */
const LEGACY_TLM_MAP: Record<string, string> = {
  charts: "chart",
  chalk_markers: "blackboard",
  storybooks: "picture_cards",
  speaker: "phone",
  smartboard: "projector",
  craft: "real_objects",
  toys: "ball",
};

export function normalizeTlmIds(ids: string[]): string[] {
  const known = new Set(TLM_RESOURCES.map((r) => r.id));
  const out = new Set<string>();
  for (const id of ids) {
    const mapped = LEGACY_TLM_MAP[id] || id;
    if (known.has(mapped as (typeof TLM_RESOURCES)[number]["id"])) out.add(mapped);
    else out.add(id);
  }
  return Array.from(out);
}

export function loadTeacherTlms(): string[] {
  if (typeof window === "undefined") return ["blackboard", "textbook", "notebook"];
  const saved = localStorage.getItem("teacherResources");
  if (!saved) return ["blackboard", "textbook", "notebook"];
  try {
    const arr = JSON.parse(saved) as string[];
    return normalizeTlmIds(arr.length > 0 ? arr : ["blackboard", "textbook", "notebook"]);
  } catch {
    return ["blackboard", "textbook", "notebook"];
  }
}
