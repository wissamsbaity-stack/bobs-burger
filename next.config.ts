import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow ngrok (and similar) origins to load Next.js dev assets on mobile
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.ngrok.dev",
  ],
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [96, 128, 180, 256, 280, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
