import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseRest } from "@/app/lib/supabase-rest";

const accessCookie = "pao_admin_access_token";
const refreshCookie = "pao_admin_refresh_token";

export type AdminRole = "admin" | "editor" | "client";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: AdminRole;
  company: string | null;
  phone: string | null;
  country: string | null;
  notes: string | null;
  active: boolean;
  must_change_password: boolean;
  last_seen_at: string | null;
  created_at: string;
};

type SupabasePasswordResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email?: string;
  };
};

function getSupabaseUrl() {
  const url = process.env.SUPABASE_URL;

  if (!url) {
    throw new Error("Missing SUPABASE_URL");
  }

  return url.replace(/\/$/, "");
}

function getPublishableKey() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!key) {
    throw new Error("Missing SUPABASE_PUBLISHABLE_KEY");
  }

  return key;
}

function decodeJwtSubject(token: string) {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")) as { sub?: string };
    return decoded.sub ?? null;
  } catch {
    return null;
  }
}

export async function signInWithPassword(email: string, password: string) {
  const response = await fetch(`${getSupabaseUrl()}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: getPublishableKey(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SupabasePasswordResponse;
}

export async function setAuthCookies(session: SupabasePasswordResponse) {
  const cookieStore = await cookies();
  const maxAge = Math.max(session.expires_in - 60, 60);

  cookieStore.set(accessCookie, session.access_token, {
    httpOnly: true,
    maxAge,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  cookieStore.set(refreshCookie, session.refresh_token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(accessCookie);
  cookieStore.delete(refreshCookie);
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(accessCookie)?.value ?? null;
}

export async function updateCurrentUserPassword(password: string) {
  const token = await getAccessToken();

  if (!token) {
    return false;
  }

  const response = await fetch(`${getSupabaseUrl()}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: getPublishableKey(),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password }),
    cache: "no-store"
  });

  return response.ok;
}

export async function getSessionProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get(accessCookie)?.value;

  if (!token) {
    return null;
  }

  const userId = decodeJwtSubject(token);

  if (!userId) {
    return null;
  }

  const rows = await supabaseRest<Profile[]>({
    path: `profiles?select=id,email,full_name,role,company,phone,country,notes,active,must_change_password,last_seen_at,created_at&id=eq.${userId}&limit=1`,
    revalidate: 0
  });

  return rows[0] ?? null;
}

export async function requireAdminProfile() {
  const profile = await getSessionProfile();

  if (!profile || !profile.active || (profile.role !== "admin" && profile.role !== "editor")) {
    redirect("/admin/login");
  }

  if (profile.must_change_password) {
    redirect("/admin/change-password");
  }

  return profile;
}

export async function requireFullAdminProfile() {
  const profile = await requireAdminProfile();

  if (profile.role !== "admin") {
    redirect("/admin");
  }

  return profile;
}

export async function requireClientProfile() {
  const profile = await getSessionProfile();

  if (!profile || !profile.active || profile.role !== "client") {
    redirect("/client/login");
  }

  if (profile.must_change_password) {
    redirect("/client/change-password");
  }

  return profile;
}
