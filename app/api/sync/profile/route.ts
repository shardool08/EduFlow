import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("teacher_profiles")
    .select("profile, phone, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("profile GET:", error.message);
    return NextResponse.json({ error: "Could not load profile" }, { status: 500 });
  }

  const profile = (data?.profile as Record<string, string>) || {};
  if (data?.phone && !profile.phoneNumber) profile.phoneNumber = data.phone;

  return NextResponse.json({ profile, updatedAt: data?.updated_at });
}

export async function PUT(req: NextRequest) {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const profile = body.profile as Record<string, string>;
  if (!profile || typeof profile !== "object") {
    return NextResponse.json({ error: "Invalid profile" }, { status: 400 });
  }

  const phone = profile.phoneNumber || user.phone?.replace(/^\+91/, "") || "";

  const { error } = await supabase.from("teacher_profiles").upsert(
    {
      user_id: user.id,
      phone,
      profile,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("profile PUT:", error.message);
    return NextResponse.json({ error: "Could not save profile" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
