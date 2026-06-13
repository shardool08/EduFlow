"use client";

import {
  type ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { tryGetFirebaseAuth } from "@/lib/firebase/client";
import { toE164IndianPhone } from "@/lib/phone";

const RECAPTCHA_CONTAINER_ID = "firebase-recaptcha";

let recaptchaVerifier: RecaptchaVerifier | null = null;
let recaptchaPreparePromise: Promise<void> | null = null;

function getAuthOrThrow() {
  const auth = tryGetFirebaseAuth();
  if (!auth) throw new Error("Firebase not configured — restart npm run dev after editing .env");
  return auth;
}

function ensureRecaptchaContainer(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(RECAPTCHA_CONTAINER_ID)) return;
  const el = document.createElement("div");
  el.id = RECAPTCHA_CONTAINER_ID;
  document.body.appendChild(el);
}

async function createRecaptchaVerifier(): Promise<RecaptchaVerifier> {
  const auth = getAuthOrThrow();
  ensureRecaptchaContainer();

  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {
      /* ignore stale verifier */
    }
    recaptchaVerifier = null;
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, RECAPTCHA_CONTAINER_ID, {
    size: "invisible",
  });
  await recaptchaVerifier.render();
  return recaptchaVerifier;
}

/** Call once when register page loads — avoids send-time reCAPTCHA failures */
export function prepareFirebaseRecaptcha(): Promise<void> {
  if (!recaptchaPreparePromise) {
    recaptchaPreparePromise = createRecaptchaVerifier()
      .then(() => undefined)
      .catch((error) => {
        recaptchaPreparePromise = null;
        throw error;
      });
  }
  return recaptchaPreparePromise;
}

export function clearFirebaseRecaptcha(): void {
  if (!recaptchaVerifier) return;
  try {
    recaptchaVerifier.clear();
  } catch {
    /* ignore */
  }
  recaptchaVerifier = null;
  recaptchaPreparePromise = null;
}

export async function sendFirebaseOtp(phone: string): Promise<ConfirmationResult> {
  const auth = getAuthOrThrow();
  const e164 = toE164IndianPhone(phone);
  await prepareFirebaseRecaptcha();
  const verifier = recaptchaVerifier ?? (await createRecaptchaVerifier());
  return signInWithPhoneNumber(auth, e164, verifier);
}

export async function verifyFirebaseOtp(
  confirmation: ConfirmationResult,
  otp: string
): Promise<void> {
  await confirmation.confirm(otp);
}

export function firebaseAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
      ? (error as { code: string }).code
      : "";

  const detail =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
      ? (error as { message: string }).message
      : error instanceof Error
        ? error.message
        : "";

  switch (code) {
    case "auth/invalid-phone-number":
      return "Invalid mobile number";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";
    case "auth/captcha-check-failed":
      return "Security check failed. Refresh the page and try again.";
    case "auth/invalid-verification-code":
      return "Invalid OTP";
    case "auth/code-expired":
      return "OTP expired. Request a new code.";
    case "auth/quota-exceeded":
      return "SMS limit reached. Try again later.";
    case "auth/billing-not-enabled":
      return "Add your number under Firebase → Authentication → Phone → test numbers, or upgrade to Blaze.";
    case "auth/invalid-app-credential":
      return "Firebase key/domain issue. In Google Cloud, allow localhost for your API key.";
    case "auth/operation-not-allowed":
      return "Enable Phone sign-in in Firebase → Authentication → Sign-in method.";
    case "auth/app-not-authorized":
      return "Add localhost under Firebase → Authentication → Settings → Authorized domains.";
    case "auth/internal-error":
      return "Firebase internal error — use test number 9876543210 with code 123456.";
    default:
      console.error("Firebase auth error:", code || detail, error);
      if (code) return `${detail || "OTP failed"} (${code})`;
      if (detail) return detail;
      return "Could not send OTP. Use test number 9876543210 and code 123456 from Firebase test numbers.";
  }
}

export { RECAPTCHA_CONTAINER_ID };
