import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isCloudEnabled, toE164IndianPhone } from "@/lib/supabase/config";

export async function POST(req: NextRequest) {
  try {
    const { phone, token } = await req.json();
    const digits = String(phone || "").replace(/\D/g, "");
    const otp = String(token || "").replace(/\D/g, "");

    if (digits.length !== 10) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }
    if (otp.length < 6) {
      return NextResponse.json({ error: "Enter 6-digit OTP" }, { status: 400 });
    }

    if (!isCloudEnabled()) {
      return NextResponse.json({ mode: "local", phone: digits });
    }

    const supabase = await createServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
    }

    const e164 = toE164IndianPhone(digits);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: e164,
      token: otp,
      type: "sms",
    });

    if (error || !data.session) {
      console.error("verify-otp:", error?.message);
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
    }

    await supabase.from("teacher_profiles").upsert(
      {
        user_id: data.session.user.id,
        phone: digits,
        profile: {},
      },
      { onConflict: "user_id" }
    );

    return NextResponse.json({ mode: "cloud", phone: digits });
  } catch (e) {
    console.error("verify-otp:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
