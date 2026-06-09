import type { Locale } from "@/app/lib/i18n";

export const siteUrl = "https://paovergara.com";
export const siteName = "Pao Vergara";
export const defaultOgImage = "/opengraph-image";

export type SeoPage = "home" | "work" | "services" | "remote" | "about" | "contact" | "login";

export const pagePaths: Record<SeoPage, string> = {
  home: "",
  work: "/work",
  services: "/services",
  remote: "/remote-color-grading",
  about: "/about",
  contact: "/contact",
  login: "/login"
};

export const pageSeo: Record<SeoPage, Record<Locale, { title: string; description: string }>> = {
  home: {
    es: {
      title: "Pao Vergara | Color Grading & Finishing",
      description: "Color y finishing para publicidad, moda, música y ficción."
    },
    en: {
      title: "Pao Vergara | Color Grading & Finishing",
      description: "Color and finishing for commercials, fashion, music and fiction."
    }
  },
  work: {
    es: {
      title: "Trabajo | Pao Vergara",
      description: "Portafolio seleccionado de color grading, finishing y postproducción."
    },
    en: {
      title: "Work | Pao Vergara",
      description: "Selected color grading, finishing and post-production portfolio."
    }
  },
  services: {
    es: {
      title: "Servicios | Pao Vergara",
      description: "Color grading, finishing digital, edición y restauración."
    },
    en: {
      title: "Services | Pao Vergara",
      description: "Color grading, digital finishing, editing and restoration."
    }
  },
  remote: {
    es: {
      title: "Color remoto | Pao Vergara",
      description: "Flujo remoto para color profesional, revisión y entrega final."
    },
    en: {
      title: "Remote color | Pao Vergara",
      description: "Remote workflow for professional color, review and final delivery."
    }
  },
  about: {
    es: {
      title: "Bio | Pao Vergara",
      description: "Colorista y artista de finishing con más de quince años en postproducción."
    },
    en: {
      title: "About | Pao Vergara",
      description: "Colorist and finishing artist with more than fifteen years in post-production."
    }
  },
  contact: {
    es: {
      title: "Contacto | Pao Vergara",
      description: "Cuéntanos sobre tu proyecto de color, finishing o postproducción."
    },
    en: {
      title: "Contact | Pao Vergara",
      description: "Tell us about your color, finishing or post-production project."
    }
  },
  login: {
    es: {
      title: "Portal de clientes | Pao Vergara",
      description: "Acceso privado para revisión de versiones, aprobaciones y entregas."
    },
    en: {
      title: "Client portal | Pao Vergara",
      description: "Private access for version reviews, approvals and deliveries."
    }
  }
};
