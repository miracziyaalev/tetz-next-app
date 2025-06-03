import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "yrdzcrunsaahbyalnryr.supabase.co",
      },
    ],
  },
};

export default nextConfig;
