"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";
import type { Language } from "@/lib/translations";
import {
  maharashtraDistricts,
  zillaParishads,
  municipalCorporations,
  administrationTypes,
  mediums,
  locationTypes,
  seatingTypes,
  classroomSizes,
  socioEconomicLevels,
  firstGenLearners,
  parentalInvolvement,
  internetAccess,
  printingAccess,
} from "@/lib/maharashtra-data";

import { useAuthGuard } from "@/lib/auth";
import { scheduleProfileSync } from "@/lib/cloud-sync";

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

function ls(key: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) ?? "";
}

type Comfort = "difficult" | "stumbling" | "comfortable";

interface ProfileForm {
  teacherName: string;
  englishComfort: string;
  teacherMedium: string;
  teacherSection: string;
  currentLesson: string;
  district: string;
  adminType: string;
  zpName: string;
  corpName: string;
  schoolType: string;
  schoolName: string;
  location: string;
  pinCode: string;
  studentCount: number;
  classroomSize: string;
  seatingArrangement: string;
  canRearrange: string;
  hasCharts: boolean;
  hasStoryBooks: boolean;
  hasSpeaker: boolean;
  hasSmartBoard: boolean;
  hasProjector: boolean;
  internetAccess: string;
  printingAccess: string;
  socioEconomic: string;
  studentHomeLanguage: string;
  firstGenLearners: string;
  parentalInvolvement: string;
}

function loadForm(): ProfileForm {
  return {
    teacherName: ls("teacherName"),
    englishComfort: ls("englishComfort"),
    teacherMedium: ls("medium"),
    teacherSection: ls("teacherSection"),
    currentLesson: ls("currentLesson"),
    district: ls("district"),
    adminType: ls("adminType"),
    zpName: ls("zpName") || (ls("adminType") === "zp" ? ls("adminName") : ""),
    corpName: ls("corpName") || (ls("adminType") === "corp" ? ls("adminName") : ""),
    schoolType: ls("schoolType"),
    schoolName: ls("schoolName"),
    location: ls("location"),
    pinCode: ls("pinCode"),
    studentCount: Number(ls("studentCount") || "30"),
    classroomSize: ls("classroomSize"),
    seatingArrangement: ls("seatingArrangement"),
    canRearrange: ls("canRearrange"),
    hasCharts: ls("hasCharts") === "true",
    hasStoryBooks: ls("hasStoryBooks") === "true",
    hasSpeaker: ls("hasSpeaker") === "true",
    hasSmartBoard: ls("hasSmartBoard") === "true",
    hasProjector: ls("hasProjector") === "true",
    internetAccess: ls("internetAccess"),
    printingAccess: ls("printingAccess"),
    socioEconomic: ls("socioEconomic"),
    studentHomeLanguage: ls("studentHomeLanguage"),
    firstGenLearners: ls("firstGenLearners"),
    parentalInvolvement: ls("parentalInvolvement"),
  };
}

export default function ProfileEditPage() {
  const router = useRouter();
  useAuthGuard();
  const lang = getLang();
  const t = translations[lang];
  const isRtl = lang === "ur";

  const [form, setForm] = useState<ProfileForm>(loadForm);
  const [districtSearch, setDistrictSearch] = useState(form.district);
  const [showDistrictList, setShowDistrictList] = useState(false);

  function setField<K extends keyof ProfileForm>(key: K, val: ProfileForm[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSave() {
    localStorage.setItem("teacherName", form.teacherName);
    localStorage.setItem("englishComfort", form.englishComfort);
    localStorage.setItem("medium", form.teacherMedium);
    localStorage.setItem("teacherSection", form.teacherSection);
    localStorage.setItem("currentLesson", form.currentLesson);
    localStorage.setItem("district", form.district);
    localStorage.setItem("adminType", form.adminType);
    localStorage.setItem("zpName", form.zpName);
    localStorage.setItem("corpName", form.corpName);
    localStorage.setItem("schoolType", form.schoolType);
    localStorage.setItem("schoolName", form.schoolName);
    localStorage.setItem("location", form.location);
    localStorage.setItem("pinCode", form.pinCode);
    localStorage.setItem("studentCount", String(form.studentCount));
    localStorage.setItem("classroomSize", form.classroomSize);
    localStorage.setItem("seatingArrangement", form.seatingArrangement);
    localStorage.setItem("canRearrange", form.canRearrange);
    localStorage.setItem("hasCharts", String(form.hasCharts));
    localStorage.setItem("hasStoryBooks", String(form.hasStoryBooks));
    localStorage.setItem("hasSpeaker", String(form.hasSpeaker));
    localStorage.setItem("hasSmartBoard", String(form.hasSmartBoard));
    localStorage.setItem("hasProjector", String(form.hasProjector));
    localStorage.setItem("internetAccess", form.internetAccess);
    localStorage.setItem("printingAccess", form.printingAccess);
    localStorage.setItem("socioEconomic", form.socioEconomic);
    localStorage.setItem("studentHomeLanguage", form.studentHomeLanguage);
    localStorage.setItem("firstGenLearners", form.firstGenLearners);
    localStorage.setItem("parentalInvolvement", form.parentalInvolvement);
    scheduleProfileSync();
    router.back();
  }

  const filteredDistricts = maharashtraDistricts.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const COMFORT_OPTIONS: { value: Comfort; label: string }[] = [
    { value: "difficult", label: t.comfortLow },
    { value: "stumbling", label: t.comfortMed },
    { value: "comfortable", label: t.comfortHigh },
  ];

  const inputCls =
    "w-full px-4 py-4 text-xl border-2 border-primary-500 rounded-xl outline-none bg-white";

  function SectionHeader({ title }: { title: string }) {
    return (
      <div className="bg-gray-100 -mx-6 px-6 py-3 mt-2">
        <h2 className="text-lg font-bold text-gray-700">{title}</h2>
      </div>
    );
  }

  function ToggleGroup({
    options,
    value,
    onChange,
  }: {
    options: { value: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
  }) {
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`min-h-12 rounded-xl border-2 text-base font-semibold px-3 py-2 transition-colors ${
                selected
                  ? "bg-accent-700 border-accent-700 text-white"
                  : "bg-white border-primary-500 text-primary-500"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  function BoolToggle({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) {
    return (
      <button
        onClick={() => onChange(!value)}
        className={`w-full min-h-12 rounded-xl border-2 text-base font-semibold px-4 py-3 text-start flex items-center gap-3 transition-colors ${
          value
            ? "bg-accent-700 border-accent-700 text-white"
            : "bg-white border-gray-300 text-gray-700"
        }`}
      >
        <span className="text-lg">{value ? "✓" : "○"}</span>
        {label}
      </button>
    );
  }

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="flex flex-col min-h-screen bg-white"
    >
      {/* Header */}
      <header className="bg-white border-b border-[#D0EAE4] px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-primary-400 text-xl shrink-0">
          {t.back}
        </button>
        <h1 className="text-xl font-bold flex-1 text-center text-primary-800">{t.profileEditTitle}</h1>
        <button
          onClick={handleSave}
          className="bg-white text-primary-500 font-bold text-base px-4 py-2 rounded-xl shrink-0"
        >
          {t.saveButton}
        </button>
      </header>

      <div className="flex-1 px-6 py-4 flex flex-col gap-5">
        {/* ── SCHOOL DETAILS ── */}
        <SectionHeader title={t.schoolDetailsSec} />

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">{t.stateLabel}</label>
          <div className={`${inputCls} text-gray-500 cursor-not-allowed`}>Maharashtra</div>
        </div>

        {/* District */}
        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">{t.districtLabel}</label>
          <div className="relative">
            <input
              type="text"
              placeholder={t.districtPlaceholder}
              value={districtSearch}
              onChange={(e) => {
                setDistrictSearch(e.target.value);
                setField("district", "");
                setShowDistrictList(true);
              }}
              onFocus={() => setShowDistrictList(true)}
              onBlur={() => setTimeout(() => setShowDistrictList(false), 150)}
              className={inputCls}
            />
            {showDistrictList && districtSearch.length > 0 && filteredDistricts.length > 0 && (
              <ul className="absolute z-20 w-full bg-white border-2 border-primary-500 rounded-xl mt-1 max-h-44 overflow-y-auto shadow-lg">
                {filteredDistricts.map((d) => (
                  <li
                    key={d}
                    onMouseDown={() => {
                      setField("district", d);
                      setDistrictSearch(d);
                      setShowDistrictList(false);
                    }}
                    className="px-4 py-3 text-xl hover:bg-[#EAF3ED] cursor-pointer border-b border-gray-100 last:border-0"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Admin type */}
        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">{t.adminTypeLabel}</label>
          <select
            value={form.adminType}
            onChange={(e) => {
              setField("adminType", e.target.value);
              setField("zpName", "");
              setField("corpName", "");
            }}
            className={inputCls}
          >
            <option value="" disabled>—</option>
            {administrationTypes.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        {form.adminType === "zp" && (
          <div>
            <label className="block text-xl font-semibold text-gray-800 mb-2">{t.zpLabel}</label>
            <select value={form.zpName} onChange={(e) => setField("zpName", e.target.value)} className={inputCls}>
              <option value="" disabled>—</option>
              {zillaParishads.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
        )}

        {form.adminType === "corp" && (
          <div>
            <label className="block text-xl font-semibold text-gray-800 mb-2">{t.corpNameLabel}</label>
            <select value={form.corpName} onChange={(e) => setField("corpName", e.target.value)} className={inputCls}>
              <option value="" disabled>—</option>
              {municipalCorporations.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">{t.schoolNameLabel}</label>
          <input
            type="text"
            placeholder={t.schoolNamePlaceholder}
            value={form.schoolName}
            onChange={(e) => setField("schoolName", e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-3">{t.locationLabel}</label>
          <ToggleGroup
            options={locationTypes.map((l) => ({
              value: l.value,
              label:
                l.value === "urban"
                  ? t.locationUrban
                  : l.value === "semi_urban"
                  ? t.locationSemiUrban
                  : t.locationRural,
            }))}
            value={form.location}
            onChange={(v) => setField("location", v)}
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">{t.pinCodeLabel}</label>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={6}
            placeholder={t.pinCodePlaceholder}
            value={form.pinCode}
            onChange={(e) => setField("pinCode", e.target.value.replace(/\D/g, ""))}
            className={inputCls}
          />
        </div>

        {/* ── CLASSROOM DETAILS ── */}
        <SectionHeader title={t.classroomDetailsSec} />

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-3">
            {t.studentCountLabel}: <span className="text-primary-500 font-bold">{form.studentCount}</span>
          </label>
          <input
            type="range"
            min={10}
            max={80}
            value={form.studentCount}
            onChange={(e) => setField("studentCount", Number(e.target.value))}
            className="w-full accent-accent-500"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1"><span>10</span><span>80</span></div>
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-3">{t.classroomSizeLabel}</label>
          <ToggleGroup
            options={classroomSizes.map((c) => ({ value: c.value, label: c.label }))}
            value={form.classroomSize}
            onChange={(v) => setField("classroomSize", v)}
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-3">{t.seatingLabel}</label>
          <ToggleGroup
            options={seatingTypes.map((s) => ({ value: s.value, label: s.label }))}
            value={form.seatingArrangement}
            onChange={(v) => setField("seatingArrangement", v)}
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-3">{t.canRearrangeLabel}</label>
          <ToggleGroup
            options={[
              { value: "yes", label: t.yesLabel },
              { value: "no", label: t.noLabel },
            ]}
            value={form.canRearrange}
            onChange={(v) => setField("canRearrange", v)}
          />
        </div>

        {/* ── RESOURCES ── */}
        <SectionHeader title={t.resourcesSec} />

        <div className="flex flex-col gap-3">
          <BoolToggle label={t.chartsLabel} value={form.hasCharts} onChange={(v) => setField("hasCharts", v)} />
          <BoolToggle label={t.storyBooksLabel} value={form.hasStoryBooks} onChange={(v) => setField("hasStoryBooks", v)} />
          <BoolToggle label={t.speakerLabel} value={form.hasSpeaker} onChange={(v) => setField("hasSpeaker", v)} />
          <BoolToggle label={t.smartBoardLabel} value={form.hasSmartBoard} onChange={(v) => setField("hasSmartBoard", v)} />
          <BoolToggle label={t.projectorLabel} value={form.hasProjector} onChange={(v) => setField("hasProjector", v)} />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">Internet</label>
          <select value={form.internetAccess} onChange={(e) => setField("internetAccess", e.target.value)} className={inputCls}>
            <option value="" disabled>—</option>
            {internetAccess.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">Printing</label>
          <select value={form.printingAccess} onChange={(e) => setField("printingAccess", e.target.value)} className={inputCls}>
            <option value="" disabled>—</option>
            {printingAccess.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* ── STUDENT CONTEXT ── */}
        <SectionHeader title={t.studentContextSec} />

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">{t.socioEconLabel}</label>
          <select value={form.socioEconomic} onChange={(e) => setField("socioEconomic", e.target.value)} className={inputCls}>
            <option value="" disabled>—</option>
            {socioEconomicLevels.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">{t.homeLanguageLabel}</label>
          <input
            type="text"
            placeholder={t.homeLanguagePlaceholder}
            value={form.studentHomeLanguage}
            onChange={(e) => setField("studentHomeLanguage", e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">{t.firstGenLabel}</label>
          <select value={form.firstGenLearners} onChange={(e) => setField("firstGenLearners", e.target.value)} className={inputCls}>
            <option value="" disabled>—</option>
            {firstGenLearners.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">{t.parentalLabel}</label>
          <select value={form.parentalInvolvement} onChange={(e) => setField("parentalInvolvement", e.target.value)} className={inputCls}>
            <option value="" disabled>—</option>
            {parentalInvolvement.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* ── TEACHER ── */}
        <SectionHeader title={t.teacherSec} />

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">{t.nameLabel}</label>
          <input
            type="text"
            placeholder={t.namePlaceholder}
            value={form.teacherName}
            onChange={(e) => setField("teacherName", e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-3">{t.comfortLabel}</label>
          <ToggleGroup
            options={COMFORT_OPTIONS}
            value={form.englishComfort}
            onChange={(v) => setField("englishComfort", v)}
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">{t.mediumLabel}</label>
          <select value={form.teacherMedium} onChange={(e) => setField("teacherMedium", e.target.value)} className={inputCls}>
            <option value="" disabled>—</option>
            {mediums.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        {/* Bottom save */}
        <div className="pt-2 pb-8">
          <button
            onClick={handleSave}
            className="w-full min-h-14 rounded-xl bg-accent-700 text-white text-2xl font-semibold"
          >
            {t.saveButton}
          </button>
        </div>
      </div>
    </main>
  );
}
