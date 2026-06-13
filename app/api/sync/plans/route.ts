import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import type { SavedPlan } from "@/lib/plan-storage";

function rowToPlan(row: Record<string, unknown>): SavedPlan {
  return {
    lessonId: row.lesson_id as string,
    day: row.day as number,
    status: row.status as SavedPlan["status"],
    planData: row.plan_data as Record<string, string> | undefined,
    phases: row.phases as SavedPlan["phases"],
    richPlan: row.rich_plan,
    materials: row.materials as SavedPlan["materials"],
    feedback: row.feedback as SavedPlan["feedback"],
    savedAt: row.saved_at as string | undefined,
    completedAt: row.completed_at as string | undefined,
  };
}

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
    .from("lesson_plans")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("plans GET:", error.message);
    return NextResponse.json({ error: "Could not load plans" }, { status: 500 });
  }

  const plans: Record<string, SavedPlan> = {};
  for (const row of data || []) {
    const plan = rowToPlan(row as Record<string, unknown>);
    plans[plan.lessonId + "-day" + plan.day] = plan;
  }

  return NextResponse.json({ plans });
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
  const plans = body.plans as Record<string, SavedPlan>;
  if (!plans || typeof plans !== "object") {
    return NextResponse.json({ error: "Invalid plans" }, { status: 400 });
  }

  const rows = Object.values(plans).map((p) => ({
    user_id: user.id,
    lesson_id: p.lessonId,
    day: p.day,
    status: p.status,
    plan_data: p.planData ?? null,
    phases: p.phases ?? null,
    rich_plan: p.richPlan ?? null,
    materials: p.materials ?? null,
    feedback: p.feedback ?? null,
    saved_at: p.savedAt ?? null,
    completed_at: p.completedAt ?? null,
  }));

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, count: 0 });
  }

  const { error } = await supabase.from("lesson_plans").upsert(rows, {
    onConflict: "user_id,lesson_id,day",
  });

  if (error) {
    console.error("plans PUT:", error.message);
    return NextResponse.json({ error: "Could not save plans" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: rows.length });
}
