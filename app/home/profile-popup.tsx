"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";
import type { Language } from "@/lib/translations";

const PROFILE_KEYS = [
  "classroomSize",
  "seatingArrangement",
  "printingAccess",
  "internetAccess",
  "socioEconomic",
  "firstGenLearners",
  "parentalInvolvement",
  "studentHomeLanguage",
];

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

export function ProfilePopup() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("profilePopupShown")) return;
    const incomplete = PROFILE_KEYS.some((k) => !localStorage.getItem(k));
    if (incomplete) {
      setVisible(true);
      sessionStorage.setItem("profilePopupShown", "1");
    }
  }, []);

  if (!visible) return null;

  const lang = getLang();
  const t = translations[lang];
  const isRtl = lang === "ur";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-start gap-3 mb-5">
          <p className="text-xl font-semibold text-gray-800 flex-1">
            {t.completeProfileMsg}
          </p>
          <button
            onClick={() => setVisible(false)}
            className="text-gray-400 text-3xl leading-none shrink-0 -mt-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <button
          onClick={() => router.push("/profile/edit")}
          className="w-full min-h-14 rounded-xl bg-accent-700 text-white text-xl font-semibold"
        >
          {t.goToProfileBtn}
        </button>
      </div>
    </div>
  );
}
