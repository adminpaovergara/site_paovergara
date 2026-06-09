import net from "node:net";
import tls from "node:tls";
import { getEmailTemplate, renderTemplate } from "@/app/lib/email-templates";

type LeadEmail = {
  name: string;
  email: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  contactPreference?: string;
  company?: string;
  country?: string;
  projectType?: string;
  urgency?: string;
  message: string;
  locale: "es" | "en";
};

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string[];
};

type EmailMessage = {
  html?: string;
  replyTo?: string;
  subject: string;
  text: string;
  to: string[];
};

function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = (process.env.SMTP_SECURE ?? "true") === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;
  const to = process.env.LEAD_NOTIFY_TO?.split(",").map((value) => value.trim()).filter(Boolean);

  if (!user || !pass || !from || !to?.length) {
    return null;
  }

  return { host, port, secure, user, pass, from, to };
}

function addressOnly(value: string) {
  return value.match(/<([^>]+)>/)?.[1] ?? value;
}

function encodeBase64(value: string) {
  return Buffer.from(value, "utf8").toString("base64");
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getBookingUrl(lead: LeadEmail) {
  const fallbackSubject =
    lead.locale === "es"
      ? "Agendar llamada sobre mi proyecto"
      : "Schedule a call about my project";

  return (
    process.env.LEAD_BOOKING_URL ||
    `mailto:info@paovergara.com?subject=${encodeURIComponent(fallbackSubject)}`
  );
}

function buildTemplateVariables(lead: LeadEmail) {
  const bookingUrl = getBookingUrl(lead);
  const fallbackSubject =
    lead.locale === "es"
      ? "Agendar llamada sobre mi proyecto"
      : "Schedule a call about my project";

  return {
    booking_url: bookingUrl,
    booking_mailto_url: `mailto:info@paovergara.com?subject=${encodeURIComponent(fallbackSubject)}`,
    company: lead.company ?? "",
    country: lead.country ?? "",
    email: lead.email,
    message: lead.message,
    name: lead.name,
    phone: [lead.phoneCountryCode, lead.phoneNumber].filter(Boolean).join(" "),
    project_type: lead.projectType ?? "",
    urgency: lead.urgency ?? ""
  };
}

function dotStuff(value: string) {
  return value.replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
}

function buildMimeMessage(message: EmailMessage, config: SmtpConfig) {
  const headers = [
    `From: ${cleanHeader(config.from)}`,
    `To: ${cleanHeader(message.to.join(", "))}`,
    message.replyTo ? `Reply-To: ${cleanHeader(message.replyTo)}` : "",
    `Subject: ${cleanHeader(message.subject)}`,
    "MIME-Version: 1.0"
  ].filter(Boolean);

  if (!message.html) {
    return [
      ...headers,
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      message.text
    ].join("\r\n");
  }

  const boundary = `paovergara-${Date.now().toString(36)}`;

  return [
    ...headers,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    message.text,
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    message.html,
    `--${boundary}--`
  ].join("\r\n");
}

function buildLeadNotification(lead: LeadEmail, config: SmtpConfig): EmailMessage {
  const subject =
    lead.locale === "es"
      ? `Nuevo lead de paovergara.com: ${lead.name}`
      : `New paovergara.com lead: ${lead.name}`;

  const body = [
    "Nuevo contacto desde paovergara.com",
    "",
    `Nombre: ${lead.name}`,
    `Email: ${lead.email}`,
    `WhatsApp: ${[lead.phoneCountryCode, lead.phoneNumber].filter(Boolean).join(" ") || "-"}`,
    `Preferencia de contacto: ${lead.contactPreference || "-"}`,
    `Empresa: ${lead.company || "-"}`,
    `Pais: ${lead.country || "-"}`,
    `Proyecto: ${lead.projectType || "-"}`,
    `Fecha: ${lead.urgency || "-"}`,
    "",
    "Mensaje:",
    lead.message
  ].join("\n");

  return {
    replyTo: lead.email,
    subject,
    text: body,
    to: config.to
  };
}

function buildLeadAutoReply(lead: LeadEmail): EmailMessage {
  const bookingUrl = getBookingUrl(lead);
  const safeName = escapeHtml(lead.name);
  const safeBookingUrl = escapeHtml(bookingUrl);
  const subject =
    lead.locale === "es"
      ? "Gracias por contactarnos | Pao Vergara"
      : "Thank you for reaching out | Pao Vergara";

  const text =
    lead.locale === "es"
      ? [
          `Hola ${lead.name},`,
          "",
          "Gracias por contactarnos. Recibimos tu proyecto y el equipo de Pao Vergara lo revisara con cuidado.",
          "",
          "Trabajamos el color, el finishing y la postproduccion con una mirada precisa para que cada imagen tenga identidad, ritmo y emocion.",
          "",
          "El siguiente paso ideal es agendar una llamada breve para entender objetivos, tiempos, referencias y entregables.",
          "",
          `Agenda aqui: ${bookingUrl}`,
          "",
          "Nos vemos pronto,",
          "Pao Vergara"
        ].join("\n")
      : [
          `Hi ${lead.name},`,
          "",
          "Thank you for reaching out. We received your project and the Pao Vergara team will review it carefully.",
          "",
          "We shape color, finishing and post-production with a precise eye so every image carries identity, rhythm and emotion.",
          "",
          "The best next step is a short call to understand goals, timing, references and deliverables.",
          "",
          `Book here: ${bookingUrl}`,
          "",
          "Speak soon,",
          "Pao Vergara"
        ].join("\n");

  const eyebrow = lead.locale === "es" ? "Solicitud recibida" : "Request received";
  const title = lead.locale === "es" ? `Hola ${safeName}, gracias por escribirnos.` : `Hi ${safeName}, thank you for reaching out.`;
  const intro =
    lead.locale === "es"
      ? "Recibimos tu proyecto y lo vamos a revisar con cuidado. Nuestro trabajo es ayudar a que cada imagen encuentre una identidad clara, elegante y memorable."
      : "We received your project and will review it carefully. Our work is to help every image find a clear, elegant and memorable identity.";
  const value =
    lead.locale === "es"
      ? "Color grading, finishing y postproduccion pensados para publicidad, moda, belleza, videoclips y ficcion."
      : "Color grading, finishing and post-production for commercial, fashion, beauty, music video and fiction work.";
  const cta =
    lead.locale === "es"
      ? "Agenda una llamada"
      : "Book a call";
  const closing =
    lead.locale === "es"
      ? "En la llamada revisaremos objetivos, tiempos, referencias y entregables para proponerte el mejor camino."
      : "On the call we will review goals, timing, references and deliverables to suggest the best path forward.";

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f5f3ed;color:#111111;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f3ed;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #dedbd2;">
            <tr>
              <td style="padding:38px 34px 28px;">
                <p style="margin:0 0 28px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6f6b62;">${eyebrow}</p>
                <h1 style="margin:0 0 20px;font-size:32px;line-height:1.08;color:#111111;">${title}</h1>
                <p style="margin:0 0 18px;font-size:17px;line-height:1.65;color:#33312d;">${intro}</p>
                <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#55514a;">${value}</p>
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="background:#111111;">
                      <a href="${safeBookingUrl}" style="display:inline-block;padding:15px 22px;color:#ffffff;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:0.14em;text-transform:uppercase;">${cta}</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#6f6b62;">${closing}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 34px;border-top:1px solid #dedbd2;">
                <p style="margin:0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#111111;">Pao Vergara</p>
                <p style="margin:8px 0 0;font-size:13px;color:#6f6b62;">Color grading / finishing / postproduccion</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    replyTo: "info@paovergara.com",
    subject,
    text,
    html,
    to: [lead.email]
  };
}

async function buildEditableLeadAutoReply(lead: LeadEmail) {
  const template = await getEmailTemplate("lead_auto_reply", lead.locale);

  if (!template) {
    return buildLeadAutoReply(lead);
  }

  const variables = buildTemplateVariables(lead);

  return {
    replyTo: "info@paovergara.com",
    subject: renderTemplate(template.subject, variables),
    text: renderTemplate(template.textBody, variables),
    html: renderTemplate(template.htmlBody, variables),
    to: [lead.email]
  };
}

class SmtpSession {
  private socket: net.Socket | tls.TLSSocket;
  private buffer = "";

  constructor(socket: net.Socket | tls.TLSSocket) {
    this.socket = socket;
    this.socket.setEncoding("utf8");
    this.socket.on("data", (chunk) => {
      this.buffer += chunk;
    });
  }

  static connect(config: SmtpConfig) {
    return new Promise<SmtpSession>((resolve, reject) => {
      const socket = config.secure
        ? tls.connect(config.port, config.host, { servername: config.host })
        : net.connect(config.port, config.host);

      socket.once("error", reject);
      socket.once("connect", () => resolve(new SmtpSession(socket)));
    });
  }

  async expect(expectedCode: number) {
    const response = await this.readResponse();

    if (!response.startsWith(String(expectedCode))) {
      throw new Error(`SMTP expected ${expectedCode}, got ${response}`);
    }

    return response;
  }

  async command(command: string, expectedCode: number) {
    this.socket.write(`${command}\r\n`);
    return this.expect(expectedCode);
  }

  async data(message: string) {
    this.socket.write(`${dotStuff(message)}\r\n.\r\n`);
    return this.expect(250);
  }

  close() {
    this.socket.end();
  }

  private readResponse() {
    return new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("SMTP response timed out"));
      }, 15000);

      const onData = () => {
        const lines = this.buffer.split(/\r?\n/).filter(Boolean);
        const lastLine = lines.at(-1);

        if (lastLine && /^\d{3} /.test(lastLine)) {
          const response = lines.join("\n");
          this.buffer = "";
          cleanup();
          resolve(response);
        }
      };

      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };

      const cleanup = () => {
        clearTimeout(timeout);
        this.socket.off("data", onData);
        this.socket.off("error", onError);
      };

      this.socket.on("data", onData);
      this.socket.once("error", onError);
      onData();
    });
  }
}

export async function sendLeadNotification(lead: LeadEmail) {
  const config = getSmtpConfig();

  if (!config) {
    return { sent: false, skipped: true };
  }

  return sendEmail(config, buildLeadNotification(lead, config));
}

export async function sendLeadAutoReply(lead: LeadEmail) {
  const config = getSmtpConfig();

  if (!config) {
    return { sent: false, skipped: true };
  }

  return sendEmail(config, await buildEditableLeadAutoReply(lead));
}

async function sendEmail(config: SmtpConfig, email: EmailMessage) {
  const session = await SmtpSession.connect(config);
  const sender = addressOnly(config.from);
  const message = buildMimeMessage(email, config);

  try {
    await session.expect(220);
    await session.command("EHLO paovergara.com", 250);
    await session.command("AUTH LOGIN", 334);
    await session.command(encodeBase64(config.user), 334);
    await session.command(encodeBase64(config.pass), 235);
    await session.command(`MAIL FROM:<${sender}>`, 250);

    for (const recipient of email.to) {
      await session.command(`RCPT TO:<${addressOnly(recipient)}>`, 250);
    }

    await session.command("DATA", 354);
    await session.data(message);
    await session.command("QUIT", 221);

    return { sent: true, skipped: false };
  } finally {
    session.close();
  }
}
