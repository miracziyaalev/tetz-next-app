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
      {
        protocol: "https",
        hostname: "tetz-images.kaat.digital",
      },
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  devIndicators: {
    position: 'bottom-right',
  },
};

export default nextConfig;
