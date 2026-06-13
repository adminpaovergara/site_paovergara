import { NextResponse } from "next/server";
import { cleanOptionalString, cleanString, requireApiRole, writeAuditLog } from "@/app/lib/admin/api";
import { supabaseRest } from "@/app/lib/supabase-rest";

const statuses = ["new", "contacted", "qualified", "proposal_sent", "won", "lost", "archived"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { profile, response } = await requireApiRole(["admin", "editor"]);

  if (!profile) {
    return response;
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const status = cleanString(body?.status);

  if (status && !statuses.includes(status)) {
    return NextResponse.json({ ok: false, error: "invalid_status" }, { status: 400 });
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status) patch.status = status;
  if (body?.internalNotes !== undefined) patch.internal_notes = cleanOptionalString(body.internalNotes);

  await supabaseRest({ path: `leads?id=eq.${id}`, method: "PATCH", body: patch });
  await writeAuditLog({ actor: profile, action: "update_lead", entityType: "lead", entityId: id, metadata: patch });

  return NextResponse.json({ ok: true });
}
