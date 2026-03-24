import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*/",
        destination:
          "https://capabilities-programmer-retrieval-lyric.trycloudflare.com/api/v1/:path*/",
      },
      {
        source: "/api/v1/:path*",
        destination:
          "https://capabilities-programmer-retrieval-lyric.trycloudflare.com/api/v1/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.imagekit.io",
      },
    ],
  },
};

export default nextConfig;
