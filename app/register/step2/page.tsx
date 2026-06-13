"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";
import type { Language } from "@/lib/translations";
import { maharashtraDistricts, administrationTypes, municipalCorporations, zillaParishads, mediums } from "@/lib/maharashtra-data";
import { scheduleProfileSync } from "@/lib/cloud-sync";

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

const GRADES = [
  { id: 0, label: "KG" }, { id: 1, label: "Grade 1" }, { id: 2, label: "Grade 2" }, { id: 3, label: "Grade 3" }, { id: 4, label: "Grade 4" },
  { id: 5, label: "Grade 5" }, { id: 6, label: "Grade 6" }, { id: 7, label: "Grade 7" }, { id: 8, label: "Grade 8" },
];

const SUBJECTS = [
  { id: "english", label: "English" }, { id: "marathi", label: "Marathi" }, { id: "hindi", label: "Hindi" },
  { id: "maths", label: "Mathematics" }, { id: "evs", label: "EVS / Science" }, { id: "social", label: "Social Studies" },
];

export default function Step2Page() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>("mr");
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [adminType, setAdminType] = useState("");
  const [adminName, setAdminName] = useState("");
  const [medium, setMedium] = useState("");
  const [comfort, setComfort] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  useEffect(() => { setLang(getLang()); }, []);

  const t = translations[lang];
  const isRtl = lang === "ur";

  const filteredDistricts = districtSearch
    ? maharashtraDistricts.filter(d => d.toLowerCase().includes(districtSearch.toLowerCase()))
    : maharashtraDistricts;

  const toggleGrade = (g: number) => {
    setSelectedGrades(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g].sort());
  };

  const toggleSubject = (s: string) => {
    setSelectedSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const canContinue =
    name.trim() &&
    district &&
    adminType &&
    medium &&
    comfort &&
    selectedGrades.length > 0 &&
    (selectedGrades.every((g) => g === 0) || selectedSubjects.length > 0) &&
    ((adminType !== "zp" && adminType !== "corp") || adminName.trim());

  const handleContinue = () => {
    localStorage.setItem("teacherName", name);
    localStorage.setItem("district", district);
    localStorage.setItem("adminType", adminType);
    if (adminType === "zp") {
      localStorage.setItem("zpName", adminName);
      localStorage.removeItem("corpName");
    } else if (adminType === "corp") {
      localStorage.setItem("corpName", adminName);
      localStorage.removeItem("zpName");
    } else {
      localStorage.removeItem("zpName");
      localStorage.removeItem("corpName");
    }
    localStorage.removeItem("adminName");
    localStorage.setItem("medium", medium);
    localStorage.setItem("englishComfort", comfort);
    localStorage.setItem("teacherGrades", JSON.stringify(selectedGrades));
    localStorage.setItem("teacherSubjects", JSON.stringify(selectedSubjects));
    scheduleProfileSync();
    router.push("/register/step3");
  };

  const labels = {
    mr: { title: "\u0924\u0941\u092E\u091A\u094D\u092F\u093E\u092C\u0926\u094D\u0926\u0932", grades: "\u0924\u0941\u092E\u094D\u0939\u0940 \u0915\u094B\u0923\u0924\u094D\u092F\u093E \u0907\u092F\u0924\u094D\u0924\u093E \u0936\u093F\u0915\u0935\u0924\u093E?", subjects: "\u0924\u0941\u092E\u094D\u0939\u0940 \u0915\u094B\u0923\u0924\u0947 \u0935\u093F\u0937\u092F \u0936\u093F\u0915\u0935\u0924\u093E?", next: "\u092A\u0941\u0922\u0947 \u091C\u093E" },
    hi: { title: "\u0906\u092A\u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902", grades: "\u0906\u092A \u0915\u094C\u0928 \u0938\u0940 \u0915\u0915\u094D\u0937\u093E\u090F\u0901 \u092A\u0922\u093C\u093E\u0924\u0947 \u0939\u0948\u0902?", subjects: "\u0906\u092A \u0915\u094C\u0928 \u0938\u0947 \u0935\u093F\u0937\u092F \u092A\u0922\u093C\u093E\u0924\u0947 \u0939\u0948\u0902?", next: "\u0906\u0917\u0947 \u092C\u0922\u093C\u0947\u0902" },
    ur: { title: "\u0622\u067E \u06A9\u06D2 \u0628\u0627\u0631\u06D2 \u0645\u06CC\u06BA", grades: "\u0622\u067E \u06A9\u0648\u0646 \u0633\u06CC \u062C\u0645\u0627\u0639\u062A\u06CC\u06BA \u067E\u0691\u06BE\u0627\u062A\u06D2 \u06C1\u06CC\u06BA\u061F", subjects: "\u0622\u067E \u06A9\u0648\u0646 \u0633\u06D2 \u0645\u0636\u0627\u0645\u06CC\u0646 \u067E\u0691\u06BE\u0627\u062A\u06D2 \u06C1\u06CC\u06BA\u061F", next: "\u0622\u06AF\u06D2 \u0628\u0691\u06BE\u06CC\u06BA" },
    en: { title: "About You", grades: "Which grades do you teach?", subjects: "Which subjects do you teach?", next: "Continue" },
  };
  const l = labels[lang];

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="flex flex-col min-h-screen bg-white px-5 py-6 pb-28">
      <h1 className="text-xl font-bold text-primary-500 mb-6">{l.title}</h1>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="text-sm font-semibold text-primary-600 mb-1.5 block">{t.nameLabel}</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t.namePlaceholder} className="w-full px-4 py-3 text-base border border-[#D0EAE4] rounded-xl outline-none focus:border-primary-500 bg-white" />
        </div>

        {/* Grades - multi select */}
        <div>
          <label className="text-sm font-semibold text-primary-600 mb-1.5 block">{l.grades}</label>
          <div className="flex flex-wrap gap-2">
            {GRADES.map(g => (
              <button key={g.id} onClick={() => toggleGrade(g.id)} className={"px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors " + (selectedGrades.includes(g.id) ? "bg-accent-700 text-white border-accent-700" : "bg-white text-primary-600 border-[#D0EAE4]")}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects - multi select - hidden for KG */}
        {!selectedGrades.every(g => g === 0) && (
        <div>
          <label className="text-sm font-semibold text-primary-600 mb-1.5 block">{l.subjects}</label>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map(s => (
              <button key={s.id} onClick={() => toggleSubject(s.id)} className={"px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors " + (selectedSubjects.includes(s.id) ? "bg-accent-700 text-white border-accent-700" : "bg-white text-primary-600 border-[#D0EAE4]")}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        )}
        
        {/* District */}
        <div>
          <label className="text-sm font-semibold text-primary-600 mb-1.5 block">{t.districtLabel}</label>
          <input type="text" value={districtSearch} onChange={e => { setDistrictSearch(e.target.value); setDistrict(""); }} placeholder={t.districtPlaceholder} className="w-full px-4 py-3 text-base border border-[#D0EAE4] rounded-xl outline-none focus:border-primary-500 bg-white" />
          {districtSearch && !district && (
            <div className="mt-1 bg-white border border-[#D0EAE4] rounded-xl max-h-40 overflow-y-auto">
              {filteredDistricts.map(d => (
                <button key={d} onClick={() => { setDistrict(d); setDistrictSearch(d); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-white border-b border-accent-50">{d}</button>
              ))}
            </div>
          )}
        </div>

        {/* Admin type */}
        <div>
          <label className="text-sm font-semibold text-primary-600 mb-1.5 block">{t.adminTypeLabel}</label>
          <div className="space-y-2">
            {administrationTypes.map(at => (
              <button key={at.value} onClick={() => { setAdminType(at.value); setAdminName(""); }} className={"w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors " + (adminType === at.value ? "bg-accent-700 text-white border-accent-700" : "bg-white text-primary-600 border-[#D0EAE4]")}>
              {at.label}
              </button>
            ))}
          </div>
        </div>

        {/* ZP/Corp name */}
        {adminType === "zp" && (
          <div>
            <label className="text-sm font-semibold text-primary-600 mb-1.5 block">{t.zpLabel}</label>
            <select value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full px-4 py-3 text-base border border-[#D0EAE4] rounded-xl outline-none focus:border-primary-500 bg-white">
              <option value="">Select ZP</option>
              {zillaParishads.map(zp => (<option key={zp} value={zp}>{zp}</option>))}
            </select>
          </div>
        )}
        {adminType === "corp" && (
          <div>
            <label className="text-sm font-semibold text-primary-600 mb-1.5 block">{t.corpNameLabel}</label>
            <select value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full px-4 py-3 text-base border border-[#D0EAE4] rounded-xl outline-none focus:border-primary-500 bg-white">
              <option value="">Select Corporation</option>
              {municipalCorporations.map(c => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
        )}

        {/* Medium */}
        <div>
          <label className="text-sm font-semibold text-primary-600 mb-1.5 block">{t.mediumLabel}</label>
          <div className="flex flex-wrap gap-2">
            {mediums.map(m => (
  <button key={m.value} onClick={() => setMedium(m.value)} className={"px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors " + (medium === m.value ? "bg-accent-700 text-white border-accent-700" : "bg-white text-primary-600 border-[#D0EAE4]")}>
    {m.label}
  </button>
))}
          </div>
        </div>

        {/* English comfort */}
        <div>
          <label className="text-sm font-semibold text-primary-600 mb-1.5 block">{t.comfortLabel}</label>
          <div className="space-y-2">
            {[
              { id: "comfortLow", value: "difficult" },
              { id: "comfortMed", value: "stumbling" },
              { id: "comfortHigh", value: "comfortable" },
            ].map(c => (
              <button key={c.value} onClick={() => setComfort(c.value)} className={"w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors " + (comfort === c.value ? "bg-accent-700 text-white border-accent-700" : "bg-white text-primary-600 border-[#D0EAE4]")}>
                {c.value === "difficult" ? "Little / None" : c.value === "stumbling" ? "Some" : "Comfortable"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-4 border-t border-[#D0EAE4]">
        <div className="max-w-[480px] mx-auto">
          <button onClick={handleContinue} disabled={!canContinue} className="w-full min-h-12 rounded-xl bg-accent-700 text-white text-base font-semibold disabled:bg-accent-200 disabled:text-white/50">
            {l.next}
          </button>
        </div>
      </div>
    </main>
  );
}
