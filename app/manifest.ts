import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pao Vergara Admin",
    short_name: "Pao Admin",
    description: "Administración one-click para Pao Vergara.",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    background_color: "#f7f4ef",
    theme_color: "#111111",
    orientation: "portrait",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png"
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any"
      }
    ],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        url: "/admin",
        icons: [{ src: "/icon", sizes: "64x64" }]
      },
      {
        name: "Leads",
        short_name: "Leads",
        url: "/admin/leads",
        icons: [{ src: "/icon", sizes: "64x64" }]
      },
      {
        name: "Trabajos",
        short_name: "Trabajos",
        url: "/admin/work",
        icons: [{ src: "/icon", sizes: "64x64" }]
      }
    ]
  };
}
