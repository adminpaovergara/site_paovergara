import type { Locale } from "@/app/lib/i18n";

export type Service = {
  title: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const services: Service[] = [
  {
    title: { es: "Color grading", en: "Color grading" },
    description: {
      es: "Look, balance y continuidad cromática.",
      en: "Look, balance and color continuity."
    }
  },
  {
    title: { es: "Finishing digital", en: "Digital finishing" },
    description: {
      es: "Textura, piel, producto y entrega final.",
      en: "Texture, skin, product and final delivery."
    }
  },
  {
    title: { es: "Edición", en: "Editing" },
    description: {
      es: "Ritmo, claridad y estructura.",
      en: "Rhythm, clarity and structure."
    }
  },
  {
    title: { es: "Restauración digital", en: "Digital restoration" },
    description: {
      es: "Detalle, estabilidad y carácter visual.",
      en: "Detail, stability and visual character."
    }
  }
];
