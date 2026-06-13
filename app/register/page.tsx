"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ConfirmationResult } from "firebase/auth";
import { translations } from "@/lib/translations";
import type { Language } from "@/lib/translations";
import { pullFromCloud, scheduleProfileSync } from "@/lib/cloud-sync";
import { getAuthMode } from "@/lib/auth-session";
import {
  clearFirebaseRecaptcha,
  firebaseAuthErrorMessage,
  prepareFirebaseRecaptcha,
  sendFirebaseOtp,
  verifyFirebaseOtp,
} from "@/lib/firebase/phone-auth";

function getLang(): Language {
  if (typeof window === "undefined") return "mr";
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

function isRegisteredLocal(phone: string): boolean {
  return localStorage.getItem("registered_" + phone) === "true";
}

function markRegisteredLocal(phone: string) {
  localStorage.setItem("registered_" + phone, "true");
}

const OTP_LENGTH = 6;

export default function RegisterPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const otpRefs = Array.from({ length: OTP_LENGTH }, () => useRef<HTMLInputElement>(null));
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const [lang, setLang] = useState<Language>("mr");
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const t = translations[lang];
  const isRtl = lang === "ur";
  const authMode = getAuthMode();

  useEffect(() => {
    setLang(getLang());

    if (authMode === "firebase") {
      prepareFirebaseRecaptcha()
        .then(() => setRecaptchaReady(true))
        .catch((e) => setError(firebaseAuthErrorMessage(e)));
    } else {
      setRecaptchaReady(true);
    }
  }, [authMode]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    return () => clearFirebaseRecaptcha();
  }, []);

  const sendOtp = async () => {
    if (phone.length !== 10) {
      setError(lang === "mr" ? "\u0915\u0943\u092A\u092F\u093E 10 \u0905\u0902\u0915\u0940 \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 \u091F\u093E\u0915\u093E" : "Please enter a valid 10-digit mobile number");
      return;
    }
    if (authMode === "firebase" && !recaptchaReady) {
      setError("Loading security check… wait a moment and try again.");
      return;
    }
    setError("");
    setSending(true);

    try {
      if (authMode === "firebase") {
        confirmationRef.current = await sendFirebaseOtp(phone);
      } else if (authMode === "supabase") {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Could not send OTP");
          setSending(false);
          return;
        }
      }
      setOtpSent(true);
      setCountdown(30);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } catch (e) {
      setError(firebaseAuthErrorMessage(e));
    }
    setSending(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs[index + 1].current?.focus();
    }

    if (value && index === OTP_LENGTH - 1 && newOtp.every((d) => d !== "")) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const afterLogin = async (digits: string) => {
    localStorage.setItem("phoneNumber", digits);
    scheduleProfileSync();

    if (authMode === "supabase") {
      await pullFromCloud();
    }

    const name = localStorage.getItem("teacherName");
    if (name || isRegisteredLocal(digits)) {
      if (name) {
        router.replace("/home");
      } else {
        router.push("/register/step2");
      }
    } else {
      markRegisteredLocal(digits);
      router.push("/register/step2");
    }
  };

  const verifyOtp = async (otpCode: string) => {
    setVerifying(true);
    setError("");

    try {
      if (authMode === "firebase") {
        if (!confirmationRef.current) {
          setError("Request OTP again");
          setVerifying(false);
          return;
        }
        await verifyFirebaseOtp(confirmationRef.current, otpCode);
        await afterLogin(phone);
      } else if (authMode === "supabase") {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, token: otpCode }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Invalid OTP");
          setVerifying(false);
          return;
        }
        await afterLogin(phone);
      } else if (otpCode.length >= 6) {
        await afterLogin(phone);
      } else {
        setError("Enter 6-digit OTP");
      }
    } catch (e) {
      setError(authMode === "firebase" ? firebaseAuthErrorMessage(e) : "Network error. Please try again.");
    }
    setVerifying(false);
  };

  const resendOtp = () => {
    if (countdown > 0) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    sendOtp();
  };

  const otpHint =
    authMode === "firebase" || authMode === "supabase"
      ? lang === "mr"
        ? "\u0906\u092E\u094D\u0939\u0940 OTP \u092A\u093E\u0920\u0935\u0942"
        : "We'll send a 6-digit code"
      : lang === "mr"
        ? "\u0938\u092D\u094D\u092F\u093E \u092E\u094B\u0921 — OTP \u0915\u094B\u0923\u0924\u093E\u0939\u0940 \u091F\u093E\u0915\u093E"
        : "Offline mode — enter any 6 digits";

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="flex flex-col min-h-screen bg-white" suppressHydrationWarning>

      <header className="bg-white border-b border-[#D0EAE4] px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-primary-400 text-lg">{"\u2190"}</button>
          <div>
            <h1 className="text-xl font-bold text-primary-800">PedaStudio</h1>
            <p className="text-sm text-primary-300 mt-0.5">{t.greeting}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center px-5 py-8">
        <div className="bg-white rounded-xl border border-[#D0EAE4] shadow-sm px-5 py-6">
          {!otpSent ? (
            <div className="flex flex-col gap-5">
              <div className="text-center">
                <span className="text-4xl">{"\uD83D\uDCF1"}</span>
                <p className="text-base font-semibold text-primary-800 mt-2">
                  {lang === "mr" ? "\u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 \u091F\u093E\u0915\u093E" : "Enter your mobile number"}
                </p>
                <p className="text-xs text-primary-400 mt-1">{otpHint}</p>
              </div>

              <div>
                <div className="flex items-center border-2 border-[#D0EAE4] rounded-xl overflow-hidden focus-within:border-accent-500 transition-colors">
                  <span className="px-4 py-4 text-base font-semibold text-primary-600 bg-accent-50 border-r border-[#D0EAE4]">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder={t.phonePlaceholder || "9876543210"}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
                    className="flex-1 px-4 py-4 text-lg text-primary-800 outline-none bg-white tracking-wider"
                    autoFocus
                  />
                </div>
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
              </div>

              <button
                onClick={sendOtp}
                disabled={phone.length < 10 || sending || (authMode === "firebase" && !recaptchaReady)}
                className="w-full min-h-14 rounded-xl bg-accent-700 text-white text-base font-semibold shadow-sm disabled:bg-accent-200 disabled:text-white/50 active:bg-accent-800"
              >
                {sending ? "Sending..." : !recaptchaReady && authMode === "firebase" ? "Loading..." : (t.sendOtp || "Send OTP")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="text-center">
                <span className="text-4xl">{"\uD83D\uDD10"}</span>
                <p className="text-base font-semibold text-primary-800 mt-2">Enter OTP</p>
                <p className="text-xs text-primary-400 mt-1">+91 {phone}</p>
                <button onClick={() => { setOtpSent(false); setOtp(Array(OTP_LENGTH).fill("")); setError(""); confirmationRef.current = null; clearFirebaseRecaptcha(); }} className="text-xs text-accent-700 font-semibold mt-1 underline">
                  Change number
                </button>
              </div>

              <div className="flex justify-center gap-2">
                {otp.map((_, i) => (
                  <input
                    key={i}
                    ref={otpRefs[i]}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i]}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-xl font-bold text-primary-800 border-2 border-[#D0EAE4] rounded-xl outline-none focus:border-accent-500 transition-colors bg-white"
                  />
                ))}
              </div>

              {error && <p className="text-xs text-red-500 text-center">{error}</p>}

              {verifying && (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-accent-200 border-t-accent-700 animate-spin" />
                  <span className="text-sm text-primary-400">Verifying...</span>
                </div>
              )}

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-xs text-primary-300">Resend in {countdown}s</p>
                ) : (
                  <button onClick={resendOtp} className="text-sm text-accent-700 font-semibold">Resend OTP</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
