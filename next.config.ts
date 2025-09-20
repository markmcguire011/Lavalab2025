import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.sonofatailor.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
