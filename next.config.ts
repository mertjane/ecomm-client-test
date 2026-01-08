import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
