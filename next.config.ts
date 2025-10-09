import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'backend.cerebria.co',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'backend.cerebria.co',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
  // ... otras configuraciones que ya tengas
};

export default nextConfig;
