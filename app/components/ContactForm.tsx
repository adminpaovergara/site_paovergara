"use client";

import { useState } from "react";
import type { ContactCatalogs, ContactCountry } from "@/app/lib/contact-catalogs";
import type { Locale } from "@/app/lib/i18n";

const labels = {
  es: {
    contactBlock: "Contacto",
    projectBlock: "Proyecto",
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    code: "Código",
    company: "Empresa / marca",
    optional: "opcional",
    country: "País",
    countryPlaceholder: "Selecciona país",
    type: "Tipo de proyecto",
    typePlaceholder: "Selecciona tipo",
    urgency: "Fecha estimada de entrega",
    urgencyPlaceholder: "Selecciona timing",
    contactPreference: "Prefiero que me contacten por",
    message: "Brief o mensaje",
    messagePlaceholder: "Cuéntanos qué necesitas, referencias, duración o formato.",
    submit: "Enviar",
    sending: "Enviando",
    successTitle: "Gracias por contactarnos.",
    success: "En minutos enviaremos un correo para coordinar una llamada.",
    error: "No se pudo enviar. Inténtalo de nuevo.",
    required: "Nombre, email, país, teléfono, tipo de proyecto, fecha y mensaje son obligatorios.",
    close: "Cerrar"
  },
  en: {
    contactBlock: "Contact",
    projectBlock: "Project",
    name: "Name",
    email: "Email",
    phone: "Phone",
    code: "Code",
    company: "Company / brand",
    optional: "optional",
    country: "Country",
    countryPlaceholder: "Select country",
    type: "Project type",
    typePlaceholder: "Select type",
    urgency: "Estimated delivery",
    urgencyPlaceholder: "Select timing",
    contactPreference: "Preferred contact",
    message: "Brief or message",
    messagePlaceholder: "Tell us what you need, references, length or format.",
    submit: "Send",
    sending: "Sending",
    successTitle: "Thank you for contacting us.",
    success: "We will send an email shortly to coordinate a call.",
    error: "Could not send. Please try again.",
    required: "Name, email, country, phone, project type, timing and message are required.",
    close: "Close"
  }
};

const fieldClass = "h-14 w-full border border-ink/15 bg-transparent px-4 text-base outline-none transition focus:border-ink";
const invalidFieldClass = "border-red-700 focus:border-red-700";
const labelClass = "text-xs font-semibold uppercase tracking-[0.16em] text-graphite";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className={labelClass}>{children}</label>;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactForm({ catalogs, locale }: { catalogs: ContactCatalogs; locale: Locale }) {
  const copy = labels[locale];
  const { countries, projectTypes, urgencyOptions, contactOptions } = catalogs;
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [formStartedAt, setFormStartedAt] = useState(() => String(Date.now()));
  const [phoneCountryCode, setPhoneCountryCode] = useState(() => countries[0]?.dial ?? "");
  const [countryQuery, setCountryQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryListOpen, setCountryListOpen] = useState(false);

  const query = countryQuery.trim().toLowerCase();
  const filteredCountries = countries
    .filter((country) => {
      if (!query) {
        return true;
      }

      return `${country.label[locale]} ${country.value} ${country.dial}`.toLowerCase().includes(query);
    })
    .sort((first, second) => {
      if (!query) {
        return 0;
      }

      const firstStarts = first.label[locale].toLowerCase().startsWith(query);
      const secondStarts = second.label[locale].toLowerCase().startsWith(query);
      return Number(secondStarts) - Number(firstStarts);
    });

  function chooseCountry(country: ContactCountry) {
    setSelectedCountry(country.value);
    setCountryQuery(`${country.flag} ${country.label[locale]}`);
    setPhoneCountryCode(country.dial);
    setCountryListOpen(false);
    clearInvalidField("country");
  }

  function clearInvalidField(field: string) {
    setInvalidFields((current) => {
      if (!current.has(field)) {
        return current;
      }

      const next = new Set(current);
      next.delete(field);
      return next;
    });
  }

  function inputClass(field: string) {
    return `${fieldClass} ${invalidFields.has(field) ? invalidFieldClass : ""}`;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
    const projectType = String(formData.get("projectType") ?? "").trim();
    const urgency = String(formData.get("urgency") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const nextInvalidFields = new Set<string>();

    if (!name) nextInvalidFields.add("name");
    if (!email || !isEmail(email)) nextInvalidFields.add("email");
    if (!country) nextInvalidFields.add("country");
    if (!phoneNumber) nextInvalidFields.add("phoneNumber");
    if (!projectType) nextInvalidFields.add("projectType");
    if (!urgency) nextInvalidFields.add("urgency");
    if (!message) nextInvalidFields.add("message");

    if (nextInvalidFields.size) {
      setInvalidFields(nextInvalidFields);
      setStatus("error");
      setFeedback("");
      return;
    }

    setInvalidFields(new Set());
    setStatus("sending");
    setFeedback("");

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phoneCountryCode: String(formData.get("phoneCountryCode") ?? "").trim(),
        phoneNumber,
        contactPreference: String(formData.get("contactPreference") ?? "").trim(),
        company: String(formData.get("company") ?? "").trim(),
        country,
        projectType,
        urgency,
        message,
        website: String(formData.get("website") ?? "").trim(),
        formStartedAt: String(formData.get("formStartedAt") ?? "").trim(),
        locale,
        sourcePath: window.location.pathname,
        referrer: document.referrer,
        utmSource: new URLSearchParams(window.location.search).get("utm_source") ?? "",
        utmMedium: new URLSearchParams(window.location.search).get("utm_medium") ?? "",
        utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") ?? ""
      })
    });

    if (!response.ok) {
      setStatus("error");
      setFeedback(copy.error);
      return;
    }

    form.reset();
    setPhoneCountryCode(countries[0]?.dial ?? "");
    setCountryQuery("");
    setSelectedCountry("");
    setCountryListOpen(false);
    setInvalidFields(new Set());
    setFormStartedAt(String(Date.now()));
    setStatus("success");
    setFeedback(copy.success);
  }

  return (
    <>
      <form className="grid gap-7" noValidate onSubmit={onSubmit}>
        <input className="hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <input name="formStartedAt" type="hidden" value={formStartedAt} readOnly />

        <div className="grid gap-4 border-t border-ink/15 pt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">{copy.contactBlock}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <FieldLabel>{copy.name}</FieldLabel>
              <input
                aria-invalid={invalidFields.has("name")}
                className={inputClass("name")}
                maxLength={120}
                name="name"
                onChange={() => clearInvalidField("name")}
                required
              />
            </div>
            <div className="grid gap-2">
              <FieldLabel>
                {copy.company} <span className="font-normal lowercase tracking-normal text-graphite/70">({copy.optional})</span>
              </FieldLabel>
              <input className={fieldClass} maxLength={160} name="company" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-2">
              <FieldLabel>{copy.country}</FieldLabel>
              <div className="relative">
                <input name="country" type="hidden" value={selectedCountry} />
                <input
                  aria-autocomplete="list"
                  aria-controls="country-options"
                  aria-expanded={countryListOpen}
                  aria-invalid={invalidFields.has("country")}
                  className={inputClass("country")}
                  onBlur={() => window.setTimeout(() => setCountryListOpen(false), 140)}
                  onChange={(event) => {
                    setCountryQuery(event.target.value);
                    setSelectedCountry("");
                    clearInvalidField("country");
                    setCountryListOpen(true);
                  }}
                  onFocus={() => setCountryListOpen(true)}
                  placeholder={copy.countryPlaceholder}
                  required
                  role="combobox"
                  value={countryQuery}
                />
                {countryListOpen ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-30 max-h-64 overflow-y-auto border border-ink/15 bg-paper shadow-xl" id="country-options">
                    {filteredCountries.length ? (
                      filteredCountries.map((country) => (
                        <button
                          className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-base transition hover:bg-mist"
                          key={country.value}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            chooseCountry(country);
                          }}
                          type="button"
                        >
                          <span>
                            {country.flag} {country.label[locale]}
                          </span>
                          <span className="text-sm text-graphite">{country.dial}</span>
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm text-graphite">{locale === "es" ? "Sin resultados" : "No results"}</p>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-2">
              <FieldLabel>{copy.phone}</FieldLabel>
              <div className="grid grid-cols-[8.5rem_1fr]">
                <select
                  aria-label={copy.code}
                  className={`${fieldClass} border-r-0 ${invalidFields.has("phoneNumber") ? invalidFieldClass : ""}`}
                  name="phoneCountryCode"
                  value={phoneCountryCode}
                  onChange={(event) => setPhoneCountryCode(event.target.value)}
                >
                  {countries.map((country) => (
                    <option key={`${country.value}-${country.dial}`} value={country.dial}>
                      {country.flag} {country.dial}
                    </option>
                  ))}
                </select>
                <input
                  aria-invalid={invalidFields.has("phoneNumber")}
                  className={inputClass("phoneNumber")}
                  inputMode="tel"
                  maxLength={32}
                  minLength={6}
                  name="phoneNumber"
                  onChange={() => clearInvalidField("phoneNumber")}
                  required
                  type="tel"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.8fr]">
            <div className="grid gap-2">
              <FieldLabel>{copy.email}</FieldLabel>
              <input
                aria-invalid={invalidFields.has("email")}
                className={inputClass("email")}
                maxLength={180}
                name="email"
                onChange={() => clearInvalidField("email")}
                required
                type="email"
              />
            </div>
            <div className="grid gap-2">
              <FieldLabel>{copy.contactPreference}</FieldLabel>
              <select className={fieldClass} name="contactPreference" defaultValue="whatsapp">
                {contactOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label[locale]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-ink/15 pt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">{copy.projectBlock}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <FieldLabel>{copy.type}</FieldLabel>
              <select
                aria-invalid={invalidFields.has("projectType")}
                className={inputClass("projectType")}
                name="projectType"
                defaultValue=""
                onChange={() => clearInvalidField("projectType")}
                required
              >
                <option value="" disabled>
                  {copy.typePlaceholder}
                </option>
                {projectTypes.map((projectType) => (
                  <option key={projectType.value} value={projectType.value}>
                    {projectType.label[locale]}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <FieldLabel>{copy.urgency}</FieldLabel>
              <select
                aria-invalid={invalidFields.has("urgency")}
                className={inputClass("urgency")}
                name="urgency"
                defaultValue=""
                onChange={() => clearInvalidField("urgency")}
                required
              >
                <option value="" disabled>
                  {copy.urgencyPlaceholder}
                </option>
                {urgencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label[locale]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-2">
            <FieldLabel>{copy.message}</FieldLabel>
            <textarea
              aria-invalid={invalidFields.has("message")}
              className={`min-h-44 w-full border border-ink/15 bg-transparent px-4 py-4 text-base outline-none transition focus:border-ink ${invalidFields.has("message") ? invalidFieldClass : ""}`}
              maxLength={1800}
              minLength={8}
              name="message"
              onChange={() => clearInvalidField("message")}
              placeholder={copy.messagePlaceholder}
              required
            />
          </div>
        </div>

        <button
          className="w-fit bg-ink px-7 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-graphite disabled:cursor-not-allowed disabled:opacity-60"
          disabled={status === "sending"}
          type="submit"
        >
          {status === "sending" ? copy.sending : copy.submit}
        </button>
        {feedback && status !== "success" ? (
          <p className="text-sm text-red-700" role="status">
            {feedback}
          </p>
        ) : null}
      </form>

      {status === "success" ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="contact-success-title">
          <div className="w-full max-w-md border border-ink/15 bg-paper p-8 shadow-2xl">
            <p id="contact-success-title" className="text-3xl font-semibold leading-tight">
              {copy.successTitle}
            </p>
            <p className="mt-5 text-lg leading-8 text-graphite">{copy.success}</p>
            <button
              className="mt-8 bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-graphite"
              onClick={() => {
                setStatus("idle");
                setFeedback("");
              }}
              type="button"
            >
              {copy.close}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
