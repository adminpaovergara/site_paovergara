import type { Locale } from "@/app/lib/i18n";

export type Service = {
  title: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const services: Service[] = [
  {
    title: { es: "Color grading", en: "Color grading" },
    description: {
      es: "Construccion de look, balance, continuidad y acabado cromatico para publicidad, moda, musica y ficcion.",
      en: "Look development, balance, continuity and color finishing for commercials, fashion, music and fiction."
    }
  },
  {
    title: { es: "Finishing digital", en: "Digital finishing" },
    description: {
      es: "Preparacion final de piezas para entrega, cuidando textura, piel, producto, contraste y consistencia.",
      en: "Final delivery preparation with careful attention to texture, skin, product, contrast and consistency."
    }
  },
  {
    title: { es: "Edicion", en: "Editing" },
    description: {
      es: "Edicion audiovisual con foco en ritmo, claridad narrativa y necesidades de marca.",
      en: "Editorial work focused on rhythm, narrative clarity and brand needs."
    }
  },
  {
    title: { es: "Restauracion digital", en: "Digital restoration" },
    description: {
      es: "Recuperacion y tratamiento de material para preservar detalle, estabilidad y caracter visual.",
      en: "Recovery and treatment of material to preserve detail, stability and visual character."
    }
  }
];
