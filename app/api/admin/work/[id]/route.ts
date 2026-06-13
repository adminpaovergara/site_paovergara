import { NextResponse } from "next/server";
import { cleanString, requireApiRole, writeAuditLog } from "@/app/lib/admin/api";
import { supabaseRest } from "@/app/lib/supabase-rest";

const videoStatuses = ["draft", "processing", "ready", "archived"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { profile, response } = await requireApiRole(["admin", "editor"]);

  if (!profile) {
    return response;
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const videoStatus = cleanString(body?.videoStatus);

  if (typeof body?.published === "boolean") patch.published = body.published;
  if (typeof body?.featured === "boolean") patch.featured = body.featured;
  if (videoStatus) {
    if (!videoStatuses.includes(videoStatus)) {
      return NextResponse.json({ ok: false, error: "invalid_video_status" }, { status: 400 });
    }
    patch.video_status = videoStatus;
  }

  await supabaseRest({ path: `portfolio_projects?id=eq.${id}`, method: "PATCH", body: patch });
  await writeAuditLog({ actor: profile, action: "update_portfolio_project", entityType: "portfolio_project", entityId: id, metadata: patch });

  return NextResponse.json({ ok: true });
}
