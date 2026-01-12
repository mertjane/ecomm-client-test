import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Safari 15.3 Fix: Force compatibility with older browsers
  compiler: {
    // This helps remove comments and minify in a way Safari 15 likes
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.karakedi.xyz',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'karakedi.xyz',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.authenticstone.co.uk',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'authenticstone.co.uk',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
