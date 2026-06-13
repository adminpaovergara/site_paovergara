import { NextResponse } from "next/server";
import { cleanOptionalString, cleanString, requireApiRole, writeAuditLog } from "@/app/lib/admin/api";
import { supabaseRest } from "@/app/lib/supabase-rest";

const statuses = ["draft", "active", "review", "approved", "delivered", "archived"];

export async function POST(request: Request) {
  const { profile, response } = await requireApiRole(["admin"]);

  if (!profile) {
    return response;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const clientId = cleanString(body?.clientId);
  const title = cleanString(body?.title);
  const status = cleanString(body?.status) || "draft";

  if (!clientId || !title || !statuses.includes(status)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  await supabaseRest({
    path: "client_projects",
    body: {
      client_id: clientId,
      title,
      description: cleanOptionalString(body?.description),
      status
    }
  });

  await writeAuditLog({ actor: profile, action: "create_client_project", entityType: "client_project", metadata: { clientId, title, status } });

  return NextResponse.json({ ok: true });
}
