import { NextResponse } from "next/server";
import { getSessionProfile, updateCurrentUserPassword } from "@/app/lib/admin/auth";
import { supabaseRest } from "@/app/lib/supabase-rest";

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password ?? "";

  if (!profile || !profile.active) {
    return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
  }

  if (password.length < 10) {
    return NextResponse.json({ ok: false, error: "weak_password" }, { status: 400 });
  }

  const updated = await updateCurrentUserPassword(password);

  if (!updated) {
    return NextResponse.json({ ok: false, error: "password_update_failed" }, { status: 502 });
  }

  await supabaseRest({
    path: `profiles?id=eq.${profile.id}`,
    method: "PATCH",
    body: {
      must_change_password: false,
      updated_at: new Date().toISOString()
    }
  });

  return NextResponse.json({
    ok: true,
    redirectTo: profile.role === "client" ? "/client" : "/admin"
  });
}
