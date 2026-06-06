import type { Locale } from "@/app/lib/i18n";

export type Project = {
  slug: string;
  title: string;
  client: string;
  year?: string;
  category: "Commercial" | "Fashion" | "Beauty" | "Music Video" | "Film" | "Tourism";
  featured?: boolean;
  thumbnail: string;
  videoUrl: string;
  description: Record<Locale, string>;
};

export const projects: Project[] = [
  {
    slug: "chanel-rouge-coco-bloom",
    title: "Rouge Coco Bloom",
    client: "Chanel",
    category: "Beauty",
    featured: true,
    thumbnail:
      "https://i.vimeocdn.com/video/1206889231-3d91eb935cb0d6f3a3c2573f8f8243d9c89c13b6a42f8ac005f0a3ab9c16262b-d",
    videoUrl: "https://vimeo.com/paovergaracolorist",
    description: {
      es: "Color y finishing para una pieza beauty con piel, producto y contraste como protagonistas.",
      en: "Color and finishing for a beauty piece where skin, product and contrast carry the frame."
    }
  },
  {
    slug: "chito-vera-quaker",
    title: "Chito Vera",
    client: "Quaker",
    category: "Commercial",
    featured: true,
    thumbnail:
      "https://i.vimeocdn.com/video/1771054899-d59503e13c6933d5e4be7ca175cda32df70e56244cdbee75d5b3a8956c9d16c1-d",
    videoUrl: "https://vimeo.com/paovergaracolorist",
    description: {
      es: "Pieza comercial con energia deportiva, textura natural y presencia de marca.",
      en: "A commercial piece shaped around athletic energy, natural texture and brand presence."
    }
  },
  {
    slug: "visa-one-step-closer",
    title: "One Step Closer",
    client: "Visa",
    category: "Commercial",
    featured: true,
    thumbnail:
      "https://i.vimeocdn.com/video/1834264343-c78b19a104c9103c29ae2a289fb542ea3ba2cfa3d394a9a7c09cd0ad78f44d13-d",
    videoUrl: "https://vimeo.com/paovergaracolorist",
    description: {
      es: "Color grading publicitario orientado a claridad, confianza y dinamismo.",
      en: "Commercial color grading focused on clarity, trust and momentum."
    }
  },
  {
    slug: "massimo-dutti-leather-on-leather",
    title: "Leather on Leather B&W",
    client: "Massimo Dutti",
    category: "Fashion",
    featured: true,
    thumbnail:
      "https://i.vimeocdn.com/video/1291701742-f1e817357871c67d6384bfb6a490ed74ae9ea748efff1cdf7",
    videoUrl: "https://vimeo.com/paovergaracolorist",
    description: {
      es: "Tratamiento en blanco y negro para una pieza de moda con textura, gesto y elegancia.",
      en: "A black-and-white treatment for a fashion piece built on texture, gesture and elegance."
    }
  },
  {
    slug: "dayanara-ni-borracha",
    title: "Ni Borracha",
    client: "Dayanara",
    category: "Music Video",
    thumbnail: "https://img.youtube.com/vi/iUTA6lybmJA/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=iUTA6lybmJA",
    description: {
      es: "Color para videoclip con una direccion visual intensa y contemporanea.",
      en: "Music video color with an intense, contemporary visual direction."
    }
  },
  {
    slug: "ministerio-turismo-viaja-ecuador",
    title: "Viaja Ecuador",
    client: "Ministerio de Turismo",
    category: "Tourism",
    thumbnail:
      "https://i.vimeocdn.com/video/1660995886-a0fbe417b7ebc34c31fc41f9253ac240050f087595bd3b14fe335f6ebb4e418b-d",
    videoUrl: "https://vimeo.com/paovergaracolorist",
    description: {
      es: "Imagen turistica con paisaje, calidez y detalle natural como eje narrativo.",
      en: "Tourism imagery shaped around landscape, warmth and natural detail."
    }
  }
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
