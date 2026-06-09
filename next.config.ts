import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "paovergara.com" },
      { protocol: "https", hostname: "i.vimeocdn.com" },
      { protocol: "https", hostname: "img.youtube.com" }
    ]
  },
  async redirects() {
    return [
      { source: "/home", destination: "/es", permanent: true },
      { source: "/inicio", destination: "/es", permanent: true },
      { source: "/work", destination: "/es/work", permanent: true },
      { source: "/portfolio", destination: "/en/work", permanent: true },
      { source: "/portafolio", destination: "/es/work", permanent: true },
      { source: "/reel", destination: "/es/work", permanent: true },
      { source: "/servicios", destination: "/es/services", permanent: true },
      { source: "/remote-color-grading", destination: "/es/remote-color-grading", permanent: true },
      { source: "/color-grading-remoto", destination: "/es/remote-color-grading", permanent: true },
      { source: "/bio", destination: "/es/about", permanent: true },
      { source: "/about", destination: "/en/about", permanent: true },
      { source: "/contact", destination: "/es/contact", permanent: true },
      { source: "/contacto", destination: "/es/contact", permanent: true },
      { source: "/client-login", destination: "/en/login", permanent: true },
      { source: "/login-clientes", destination: "/es/login", permanent: true }
    ];
  }
};

export default nextConfig;
