import { NextResponse } from "next/server";
import { cleanOptionalString, cleanString, requireApiRole, writeAuditLog } from "@/app/lib/admin/api";
import { supabaseRest } from "@/app/lib/supabase-rest";
import type { AdminRole } from "@/app/lib/admin/auth";

const roles: AdminRole[] = ["admin", "editor", "client"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { profile, response } = await requireApiRole(["admin"]);

  if (!profile) {
    return response;
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const role = cleanString(body?.role) as AdminRole;

  if (role && !roles.includes(role)) {
    return NextResponse.json({ ok: false, error: "invalid_role" }, { status: 400 });
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (typeof body?.active === "boolean") patch.active = body.active;
  if (role) patch.role = role;
  if (body?.fullName !== undefined) patch.full_name = cleanOptionalString(body.fullName);
  if (body?.company !== undefined) patch.company = cleanOptionalString(body.company);
  if (body?.phone !== undefined) patch.phone = cleanOptionalString(body.phone);
  if (body?.country !== undefined) patch.country = cleanOptionalString(body.country);
  if (body?.notes !== undefined) patch.notes = cleanOptionalString(body.notes);

  await supabaseRest({ path: `profiles?id=eq.${id}`, method: "PATCH", body: patch });
  await writeAuditLog({ actor: profile, action: "update_profile", entityType: "profile", entityId: id, metadata: patch });

  return NextResponse.json({ ok: true });
}
