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
    eyebrow: "Color grading / finishing / postproduccion",
    heroTitle: "Pao Vergara",
    heroIntro:
      "Colorista y artista de finishing para publicidad, moda, musica y ficcion. Una mirada precisa para imagenes con identidad, ritmo y emocion.",
    heroCta: "Ver trabajo",
    secondaryCta: "Hablemos",
    selectedWork: "Trabajo seleccionado",
    servicesTitle: "Servicios para llevar la imagen al punto exacto",
    remoteTitle: "Color grading remoto para equipos en cualquier lugar",
    aboutTitle: "Colorista ecuatoriana con mirada internacional",
    contactTitle: "Cuéntame sobre tu proyecto",
    loginTitle: "Portal de clientes",
    loginIntro: "Pronto podras revisar versiones, comentar, aprobar entregas y descargar archivos finales desde aqui."
  },
  en: {
    eyebrow: "Color grading / finishing / post-production",
    heroTitle: "Pao Vergara",
    heroIntro:
      "Colorist and finishing artist for commercials, fashion, music and fiction. A precise eye for images with identity, rhythm and emotion.",
    heroCta: "View work",
    secondaryCta: "Start a project",
    selectedWork: "Selected work",
    servicesTitle: "Services built around the final image",
    remoteTitle: "Remote color grading for teams anywhere",
    aboutTitle: "An Ecuadorian colorist with an international eye",
    contactTitle: "Tell me about your project",
    loginTitle: "Client portal",
    loginIntro: "Soon you will be able to review versions, comment, approve deliveries and download final files from here."
  }
} satisfies Record<Locale, Record<string, string>>;

export const socialLinks = [
  { label: "Vimeo", href: "https://vimeo.com/paovergaracolorist" },
  { label: "Instagram", href: "https://www.instagram.com/paovergara_color?igsh=OGxrNWtlZzZ3Zmxt" }
];
