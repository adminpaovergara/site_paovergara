import { NextResponse } from "next/server";
import { setAuthCookies, signInWithPassword, type Profile } from "@/app/lib/admin/auth";
import { supabaseRest } from "@/app/lib/supabase-rest";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "missing_credentials" }, { status: 400 });
  }

  const session = await signInWithPassword(email, password);

  if (!session) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  await setAuthCookies(session);
  const profiles = await supabaseRest<Profile[]>({
    path: `profiles?select=id,email,full_name,role,company,phone,country,notes,active,must_change_password,last_seen_at,created_at&id=eq.${session.user.id}&limit=1`,
    revalidate: 0
  });
  const profile = profiles[0] ?? null;

  if (!profile || !profile.active) {
    return NextResponse.json({ ok: false, error: "profile_not_allowed" }, { status: 403 });
  }

  const redirectTo = profile.must_change_password
    ? profile.role === "client"
      ? "/client/change-password"
      : "/admin/change-password"
    : profile.role === "client"
      ? "/client"
      : "/admin";
  return NextResponse.json({ ok: true, redirectTo });
}
