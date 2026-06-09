import type { Locale } from "@/app/lib/i18n";

export const navItems = [
  { href: "/work", label: { es: "Trabajo", en: "Work" } },
  { href: "/services", label: { es: "Servicios", en: "Services" } },
  { href: "/remote-color-grading", label: { es: "Color remoto", en: "Remote color" } },
  { href: "/about", label: { es: "Bio", en: "About" } },
  { href: "/contact", label: { es: "Contacto", en: "Contact" } }
];

export const siteCopy = {
  es: {
    eyebrow: "Color grading / finishing / postproducción",
    heroTitle: "Pao Vergara",
    heroIntro: "Color y finishing para imágenes con identidad, ritmo y emoción.",
    heroCta: "Ver trabajo",
    secondaryCta: "Hablemos",
    selectedWork: "Trabajo seleccionado",
    servicesTitle: "Servicios",
    remoteTitle: "Color remoto",
    aboutTitle: "Bio",
    contactTitle: "Nuevo proyecto",
    loginTitle: "Portal de clientes",
    loginIntro: "Pronto: versiones, comentarios, aprobaciones y entregas en un solo lugar."
  },
  en: {
    eyebrow: "Color grading / finishing / post-production",
    heroTitle: "Pao Vergara",
    heroIntro: "Color and finishing for images with identity, rhythm and emotion.",
    heroCta: "View work",
    secondaryCta: "Start a project",
    selectedWork: "Selected work",
    servicesTitle: "Services",
    remoteTitle: "Remote color",
    aboutTitle: "About",
    contactTitle: "New project",
    loginTitle: "Client portal",
    loginIntro: "Soon: versions, notes, approvals and deliveries in one place."
  }
} satisfies Record<Locale, Record<string, string>>;

export const socialLinks = [
  { label: "Vimeo", href: "https://vimeo.com/paovergaracolorist" },
  { label: "Instagram", href: "https://www.instagram.com/paovergara_color?igsh=OGxrNWtlZzZ3Zmxt" }
];
