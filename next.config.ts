import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "**.blob.vercel-storage.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/inmuebles.html",
        destination: "/inmuebles",
        permanent: true,
      },
      {
        source: "/inmueble.html",
        destination: "/inmuebles",
        permanent: true,
      },
      {
        source: "/admin.html",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/galeria.html",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
