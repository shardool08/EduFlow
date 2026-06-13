export function isCloudEnabled(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isDevOtpAllowed(): boolean {
  return process.env.ALLOW_DEV_OTP === "true";
}

export { toE164IndianPhone } from "@/lib/phone";
