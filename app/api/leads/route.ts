import { NextResponse } from "next/server";
import { insertLead } from "@/app/lib/leads";
import { sendLeadAutoReply, sendLeadNotification } from "@/app/lib/smtp";
import { getContactCatalogs } from "@/app/lib/contact-catalogs";
import { isLocale, type Locale } from "@/app/lib/i18n";

export const runtime = "nodejs";

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  phoneCountryCode?: unknown;
  phoneNumber?: unknown;
  contactPreference?: unknown;
  company?: unknown;
  country?: unknown;
  projectType?: unknown;
  urgency?: unknown;
  message?: unknown;
  locale?: unknown;
  sourcePath?: unknown;
  referrer?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  website?: unknown;
  formStartedAt?: unknown;
};

const MAX_BODY_BYTES = 12000;
const MIN_FORM_TIME_MS = 2500;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function limitedText(value: unknown, maxLength: number) {
  const clean = text(value);
  return clean.length <= maxLength ? clean : "";
}

function optionalText(value: unknown) {
  const clean = text(value);
  return clean || null;
}

function optionalLimitedText(value: unknown, maxLength: number) {
  const clean = limitedText(value, maxLength);
  return clean || null;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePhone(value: string) {
  return value.replace(/[^\d\s().-]/g, "").trim();
}

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  const currentOrigin = host ? `${proto}://${host}` : new URL(request.url).origin;

  return origin === currentOrigin;
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = rateLimit.get(ip);

  if (!current || current.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function looksTooFast(value: unknown) {
  const startedAt = Number(text(value));
  return !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FORM_TIME_MS;
}

function hasTooManyLinks(value: string) {
  return (value.match(/https?:\/\//gi) ?? []).length > 2;
}

function jsonOk() {
  return NextResponse.json({ ok: true, emailSent: false });
}

export async function POST(request: Request) {
  let payload: LeadPayload;
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "forbidden_origin" }, { status: 403 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ ok: false, error: "unsupported_media_type" }, { status: 415 });
  }

  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (text(payload.website) || looksTooFast(payload.formStartedAt)) {
    return jsonOk();
  }

  const name = limitedText(payload.name, 120);
  const email = limitedText(payload.email, 180).toLowerCase();
  const phoneCountryCode = text(payload.phoneCountryCode) || "+593";
  const phoneNumber = normalizePhone(text(payload.phoneNumber));
  const message = limitedText(payload.message, 1800);
  const locale = isLocale(text(payload.locale)) ? (text(payload.locale) as Locale) : "es";
  const projectType = limitedText(payload.projectType, 80);
  const urgency = text(payload.urgency);
  const country = limitedText(payload.country, 120);
  const catalogs = await getContactCatalogs();
  const selectedCountry = catalogs.countries.find((option) => option.value === country);
  const selectedPhoneCountry = catalogs.countries.find((option) => option.dial === phoneCountryCode);
  const selectedProjectType = catalogs.projectTypes.find((option) => option.value === projectType);
  const selectedUrgency = catalogs.urgencyOptions.find((option) => option.value === urgency);
  const selectedContactPreference =
    catalogs.contactOptions.find((option) => option.value === text(payload.contactPreference)) ??
    catalogs.contactOptions[0];

  if (
    !name ||
    !isEmail(email) ||
    !selectedCountry ||
    !selectedPhoneCountry ||
    phoneNumber.replace(/\D/g, "").length < 6 ||
    !message ||
    message.length < 8 ||
    hasTooManyLinks(message) ||
    !selectedProjectType ||
    !selectedUrgency
  ) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  }

  const lead = {
    name,
    email,
    phone_country_code: phoneCountryCode,
    phone_number: phoneNumber,
    contact_preference: selectedContactPreference?.value ?? "whatsapp",
    company: optionalLimitedText(payload.company, 160),
    country,
    project_type: projectType || null,
    urgency: urgency || null,
    message,
    locale,
    source_path: optionalLimitedText(payload.sourcePath, 300),
    referrer: optionalLimitedText(payload.referrer, 500),
    utm_source: optionalLimitedText(payload.utmSource, 120),
    utm_medium: optionalLimitedText(payload.utmMedium, 120),
    utm_campaign: optionalLimitedText(payload.utmCampaign, 160),
    user_agent: request.headers.get("user-agent")
  };

  try {
    await insertLead(lead);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "lead_not_saved" }, { status: 503 });
  }

  try {
    const emailStatus = await sendLeadNotification({
      name,
      email,
      phoneCountryCode,
      phoneNumber,
      contactPreference: lead.contact_preference,
      company: lead.company ?? undefined,
      country: selectedCountry.label[locale],
      projectType: selectedProjectType.label[locale],
      urgency: selectedUrgency.label[locale],
      message,
      locale
    });

    const autoReplyStatus = await sendLeadAutoReply({
      name,
      email,
      projectType: selectedProjectType.label[locale],
      locale,
      message
    });

    return NextResponse.json({
      ok: true,
      emailSent: emailStatus.sent,
      emailSkipped: emailStatus.skipped,
      autoReplySent: autoReplyStatus.sent,
      autoReplySkipped: autoReplyStatus.skipped
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: true, emailSent: false, emailError: true });
  }
}
