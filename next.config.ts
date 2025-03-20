import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_QUICKBOOKS_CLIENT_ID: 'ABf2MkzI3i7f62s3XI2A9l9XmfZXCmS1ZEpixaLFW1MQPyczi0',
    NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
  },
};

export default nextConfig;
