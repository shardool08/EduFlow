/**
 * Exports curriculum + Maharashtra data for the Android app assets folder.
 * Run: npm run android:curriculum
 */
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { balbharatiLessons as g1l2 } from "../lib/curriculum/grade1-english.ts";
import { grade1EnglishL1Lessons as g1l1 } from "../lib/curriculum/grade1-english-l1.ts";
import { grade2EnglishL1Lessons as g2l1 } from "../lib/curriculum/grade2-english-l1.ts";
import { grade2EnglishL2Lessons as g2l2 } from "../lib/curriculum/grade2-english-l2.ts";
import { grade3EnglishL2Lessons as g3l2 } from "../lib/curriculum/grade3-english-l2.ts";
import { grade4EnglishL2Lessons as g4l2 } from "../lib/curriculum/grade4-english-l2.ts";
import { grade5EnglishL2Lessons as g5l2 } from "../lib/curriculum/grade5-english-l2.ts";
import {
  maharashtraDistricts,
  administrationTypes,
  municipalCorporations,
  zillaParishads,
  mediums,
  internetAccess,
  printingAccess,
} from "../lib/maharashtra-data.ts";
import { TLM_RESOURCES } from "../lib/tlm.ts";

const OUT = join(process.cwd(), "android", "app", "src", "main", "assets");

function slim(lessons: Array<Record<string, unknown>>) {
  return lessons.map((l) => ({
    id: l.id,
    unit: l.unit,
    en: l.en,
    mr: l.mr ?? l.en,
    hi: l.hi ?? l.en,
    ur: l.ur ?? l.en,
    type: l.type,
    pages: l.pages,
    days: l.days,
  }));
}

mkdirSync(OUT, { recursive: true });

const curriculum = {
  "1_l2": slim(g1l2 as unknown as Array<Record<string, unknown>>),
  "1_l1": slim(g1l1 as unknown as Array<Record<string, unknown>>),
  "2_l2": slim(g2l2 as unknown as Array<Record<string, unknown>>),
  "2_l1": slim(g2l1 as unknown as Array<Record<string, unknown>>),
  "3_l2": slim(g3l2 as unknown as Array<Record<string, unknown>>),
  "4_l2": slim(g4l2 as unknown as Array<Record<string, unknown>>),
  "5_l2": slim(g5l2 as unknown as Array<Record<string, unknown>>),
};

writeFileSync(join(OUT, "curriculum.json"), JSON.stringify(curriculum));
writeFileSync(
  join(OUT, "maharashtra.json"),
  JSON.stringify({
    districts: maharashtraDistricts,
    administrationTypes,
    municipalCorporations,
    zillaParishads,
    mediums,
    internetAccess,
    printingAccess,
    tlmResources: TLM_RESOURCES.map((r) => ({ id: r.id, label: r.label })),
  })
);

console.log("Exported curriculum.json + maharashtra.json to android/app/src/main/assets/");
