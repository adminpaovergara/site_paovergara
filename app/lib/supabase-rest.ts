type SupabaseMode = "publishable" | "service";

function getSupabaseUrl() {
  const url = process.env.SUPABASE_URL;

  if (!url) {
    throw new Error("Missing SUPABASE_URL");
  }

  return url.replace(/\/$/, "");
}

function getSupabaseKey(mode: SupabaseMode) {
  if (mode === "service") {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!key) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
    }

    return key;
  }

  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!key) {
    throw new Error("Missing SUPABASE_PUBLISHABLE_KEY");
  }

  return key;
}

export async function supabaseRest<T>({
  body,
  mode = "publishable",
  path,
  revalidate
}: {
  body?: unknown;
  mode?: SupabaseMode;
  path: string;
  revalidate?: number;
}) {
  const key = getSupabaseKey(mode);
  const method = body ? "POST" : "GET";
  const response = await fetch(`${getSupabaseUrl()}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(body ? { Prefer: "return=minimal" } : {})
    },
    body: body ? JSON.stringify(body) : undefined,
    next: revalidate ? { revalidate } : undefined
  });

  if (!response.ok) {
    throw new Error(`Supabase ${method} ${path} failed: ${response.status} ${await response.text()}`);
  }

  if (method === "POST") {
    return undefined as T;
  }

  return (await response.json()) as T;
}
