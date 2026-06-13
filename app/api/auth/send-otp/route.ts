import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isCloudEnabled, toE164IndianPhone } from "@/lib/supabase/config";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone || String(phone).replace(/\D/g, "").length !== 10) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const e164 = toE164IndianPhone(String(phone));

    if (!isCloudEnabled()) {
      return NextResponse.json({ mode: "local", message: "Local mode — use any 6 digits" });
    }

    const supabase = await createServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
    }

    const { error } = await supabase.auth.signInWithOtp({ phone: e164 });

    if (error) {
      console.error("OTP send error:", error.message);
      return NextResponse.json({ error: "Could not send OTP. Check Supabase Phone settings." }, { status: 502 });
    }

    return NextResponse.json({ mode: "sms", message: "OTP sent" });
  } catch (e) {
    console.error("send-otp:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
