import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getSessionProfile, type AdminRole, type Profile } from "@/app/lib/admin/auth";
import { supabaseRest } from "@/app/lib/supabase-rest";

export type ApiActor = Profile;

export async function requireApiRole(roles: AdminRole[]) {
  const profile = await getSessionProfile();

  if (!profile || !profile.active || !roles.includes(profile.role)) {
    return { profile: null, response: NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 }) };
  }

  if (profile.must_change_password) {
    return { profile: null, response: NextResponse.json({ ok: false, error: "must_change_password" }, { status: 403 }) };
  }

  return { profile, response: null };
}

export function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function cleanOptionalString(value: unknown) {
  const clean = cleanString(value);
  return clean || null;
}

export function temporaryPassword() {
  return `Pao-${randomBytes(9).toString("base64url")}-2026!`;
}

function getSupabaseUrl() {
  const url = process.env.SUPABASE_URL;

  if (!url) {
    throw new Error("Missing SUPABASE_URL");
  }

  return url.replace(/\/$/, "");
}

function getServiceKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return key;
}

async function supabaseAuthAdmin<T>(path: string, init?: RequestInit) {
  const key = getServiceKey();
  const response = await fetch(`${getSupabaseUrl()}${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init?.headers
    },
    cache: "no-store"
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Supabase Auth Admin ${path} failed: ${response.status} ${text}`);
  }

  return text ? (JSON.parse(text) as T) : (undefined as T);
}

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

export async function findAuthUserByEmail(email: string) {
  const payload = await supabaseAuthAdmin<{ users?: SupabaseUser[] } | SupabaseUser[]>("/auth/v1/admin/users?page=1&per_page=100");
  const users = Array.isArray(payload) ? payload : payload.users ?? [];
  return users.find((user) => user.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createOrResetAuthUser({
  email,
  fullName,
  password
}: {
  email: string;
  fullName: string;
  password: string;
}) {
  const existing = await findAuthUserByEmail(email);

  if (existing) {
    return supabaseAuthAdmin<SupabaseUser>(`/auth/v1/admin/users/${existing.id}`, {
      method: "PUT",
      body: JSON.stringify({
        password,
        email_confirm: true,
        user_metadata: { ...(existing.user_metadata ?? {}), full_name: fullName }
      })
    });
  }

  return supabaseAuthAdmin<SupabaseUser>("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })
  });
}

export async function writeAuditLog({
  actor,
  action,
  entityType,
  entityId,
  metadata = {}
}: {
  actor: ApiActor;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  await supabaseRest({
    path: "admin_audit_logs",
    body: {
      actor_id: actor.id,
      action,
      entity_type: entityType,
      entity_id: entityId ?? null,
      metadata
    }
  });
}
