import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "battlecats-db.imgs-server.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
