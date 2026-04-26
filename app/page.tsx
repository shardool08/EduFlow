"use client";

import { useRouter } from "next/navigation";

const LANGUAGES = [
  { code: "mr", label: "मराठी" },
  { code: "hi", label: "हिन्दी" },
  { code: "ur", label: "اردو", dir: "rtl" as const },
  { code: "en", label: "English" },
];

export default function LanguagePage() {
  const router = useRouter();

  function selectLanguage(code: string) {
    localStorage.setItem("lang", code);
    router.push("/register");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <h1 className="text-4xl font-bold text-[#2B5F3F] mb-1">EduFlow</h1>
      <p className="text-lg text-gray-600 mb-10">Pathshala AI</p>
      <div className="w-full max-w-sm flex flex-col gap-4">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            dir={lang.dir}
            onClick={() => selectLanguage(lang.code)}
            className="w-full min-h-14 rounded-xl bg-[#2B5F3F] text-white text-2xl font-semibold flex items-center justify-center"
          >
            {lang.label}
          </button>
        ))}
      </div>
    </main>
  );
}
