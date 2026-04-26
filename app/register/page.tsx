"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";
import { useLang } from "@/lib/useLang";

export default function RegisterPage() {
  const router = useRouter();
  const lang = useLang();
  const [phone, setPhone] = useState("");

  const t = translations[lang];
  const isRtl = lang === "ur";

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="flex flex-col items-center justify-center min-h-screen bg-white px-6"
    >
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-bold text-[#2B5F3F] mb-8 text-center">
          {t.greeting}
        </h1>
        <label className="block text-xl font-semibold text-gray-800 mb-2">
          {t.phoneLabel}
        </label>
        <div className="flex items-center border-2 border-[#2B5F3F] rounded-xl overflow-hidden mb-6">
          <span className="px-4 py-4 text-xl font-semibold text-gray-700 bg-gray-50 border-r-2 border-[#2B5F3F]">
            +91
          </span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder={t.phonePlaceholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            className="flex-1 px-4 py-4 text-xl outline-none"
          />
        </div>
        <button
          onClick={() => router.push("/home")}
          className="w-full min-h-14 rounded-xl bg-[#2B5F3F] text-white text-2xl font-semibold"
        >
          {t.sendOtp}
        </button>
      </div>
    </main>
  );
}
