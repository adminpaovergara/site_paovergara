import { NextResponse } from "next/server";
import { requireApiRole, writeAuditLog } from "@/app/lib/admin/api";
import { supabaseRest } from "@/app/lib/supabase-rest";

function numberInRange(value: unknown, fallback: number, min: number, max: number) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(Math.max(Math.round(number), min), max);
}

export async function PATCH(request: Request) {
  const { profile, response } = await requireApiRole(["admin"]);

  if (!profile) {
    return response;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const value = {
    poolLimit: numberInRange(body?.poolLimit, 12, 4, 48),
    visibleCount: numberInRange(body?.visibleCount, 4, 1, 12),
    rotationEnabled: body?.rotationEnabled === true,
    rotationMode: "random_single",
    rotationIntervalMs: numberInRange(body?.rotationIntervalMs, 6500, 2500, 30000),
    transitionDurationMs: numberInRange(body?.transitionDurationMs, 420, 150, 1500)
  };

  await supabaseRest({
    path: "site_settings?key=eq.home_selected_work",
    method: "PATCH",
    body: {
      value,
      is_public: true,
      updated_at: new Date().toISOString()
    }
  });

  await writeAuditLog({ actor: profile, action: "update_home_settings", entityType: "site_settings", entityId: "home_selected_work", metadata: value });

  return NextResponse.json({ ok: true });
}
