import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/app/lib/admin/auth";

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
