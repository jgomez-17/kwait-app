import type { NextConfig } from "next";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    // 🌐 Dominios externos permitidos
    domains: [
      "images.unsplash.com", // Unsplash
      "res.cloudinary.com",  // Cloudinary
      "firebasestorage.googleapis.com", // Firebase
      "cdn.pixabay.com", // Pixabay
      "picsum.photos", // Fotos de ejemplo
    ],

    // 🖼️ Patrones adicionales (locales + externos)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com", // tus íconos actuales
      },
      {
        protocol: "https",
        hostname: "tse*.mm.bing.net", // soporte para imágenes de Bing
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**", // imágenes locales en desarrollo
      },
      {
        protocol: "https",
        hostname: "**", // comodín general (permite cualquier host HTTPS)
      },
    ],
  },

  // 🎯 Alias para imports absolutos con "@/..."
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },

  // 🧩 Opcional: habilitar Server Actions o futuras funciones

};

export default nextConfig;
