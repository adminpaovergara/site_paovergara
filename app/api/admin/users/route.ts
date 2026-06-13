import { NextResponse } from "next/server";
import { cleanOptionalString, cleanString, createOrResetAuthUser, requireApiRole, temporaryPassword, writeAuditLog } from "@/app/lib/admin/api";
import { supabaseRest } from "@/app/lib/supabase-rest";
import type { AdminRole } from "@/app/lib/admin/auth";

const roles: AdminRole[] = ["admin", "editor", "client"];

export async function POST(request: Request) {
  const { profile, response } = await requireApiRole(["admin"]);

  if (!profile) {
    return response;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = cleanString(body?.email).toLowerCase();
  const fullName = cleanString(body?.fullName);
  const role = cleanString(body?.role) as AdminRole;
  const password = temporaryPassword();

  if (!email || !email.includes("@") || !fullName || !roles.includes(role)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const user = await createOrResetAuthUser({ email, fullName, password });

  await supabaseRest({
    path: "profiles?on_conflict=id",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      id: user.id,
      email,
      full_name: fullName,
      role,
      company: cleanOptionalString(body?.company),
      phone: cleanOptionalString(body?.phone),
      country: cleanOptionalString(body?.country),
      notes: cleanOptionalString(body?.notes),
      active: true,
      must_change_password: true,
      updated_at: new Date().toISOString()
    }
  });

  await writeAuditLog({
    actor: profile,
    action: "create_or_reset_user",
    entityType: "profile",
    entityId: user.id,
    metadata: { email, role }
  });

  return NextResponse.json({ ok: true, email, temporaryPassword: password });
}
