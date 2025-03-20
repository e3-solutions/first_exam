import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}), // Ensure existing fallbacks are preserved
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
