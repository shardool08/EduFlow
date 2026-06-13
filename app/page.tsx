"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isProfileCompleteLocal } from "@/lib/profile-store";
import { getAuthMode, hasRemoteSession } from "@/lib/auth-session";

const LANGUAGES = [
  { code: "mr", label: "\u092E\u0930\u093E\u0920\u0940", sublabel: "Marathi" },
  { code: "hi", label: "\u0939\u093F\u0928\u094D\u0926\u0940", sublabel: "Hindi" },
  { code: "ur", label: "\u0627\u0631\u062F\u0648", sublabel: "Urdu", dir: "rtl" as const },
  { code: "en", label: "English", sublabel: "English" },
];

export default function LanguagePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const mode = getAuthMode();
      if (mode === "local") {
        if (isProfileCompleteLocal()) {
          router.replace("/home");
          return;
        }
      } else {
        const signedIn = await hasRemoteSession();
        if (signedIn && isProfileCompleteLocal()) {
          router.replace("/home");
          return;
        }
      }
      setChecking(false);
    }
    check();
  }, [router]);

  function select(code: string) {
    localStorage.setItem("lang", code);
    router.push("/register");
  }

  if (checking) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h1 className="text-3xl font-bold text-primary-500">PedaStudio</h1>
        <div className="mt-4 w-8 h-8 rounded-full border-3 border-accent-200 border-t-accent-700 animate-spin" />
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary-500 tracking-tight">PedaStudio</h1>
          <p className="text-primary-400 mt-2 text-base">Choose your language</p>
        </div>

        <div className="flex flex-col gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              dir={lang.dir}
              onClick={() => select(lang.code)}
              className="w-full min-h-14 rounded-xl bg-accent-700 text-white font-semibold flex items-center justify-between px-5 shadow-sm active:bg-accent-800"
            >
              <span className="text-xl">{lang.label}</span>
              <span className="text-sm text-white/70">{lang.sublabel}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
