import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dunb17ur4ymx4.cloudfront.net",
        pathname: "/packages/images/**",
      },
    ],
  },
};

export default nextConfig;
