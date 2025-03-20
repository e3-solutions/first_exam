/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'], // Add any image domains you're using
  },
  // Handle environment variables
  env: {
    QUICKBOOKS_CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID,
    QUICKBOOKS_CLIENT_SECRET: process.env.QUICKBOOKS_CLIENT_SECRET,
    QUICKBOOKS_REDIRECT_URI: process.env.QUICKBOOKS_REDIRECT_URI,
    QUICKBOOKS_ENVIRONMENT: process.env.QUICKBOOKS_ENVIRONMENT || 'sandbox',
  },
  // Configure headers for CORS and security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // When not on the server, polyfill or mock Node.js native modules
    if (!isServer) {
      // Explicitly ignore Node.js specific modules
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        assert: false,
        http: false,
        url: false,
        net: false,
        tls: false,
        zlib: false,
        child_process: false,
        dns: false,
        tty: false,
        console: false,
      };
      
      // Explicitly ignore specific problematic module
      config.resolve.alias['@nodelib/fs.scandir'] = false;
      
      // Add Buffer polyfill if needed
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );
      
      // Ignore specific fs-related requires
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^fs$/,
        })
      );
      
      // Force transpilation of problematic modules
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        // This ensures that the packages are transpiled
        if (entries['main.js'] && !entries['main.js'].includes('tailwindcss')) {
          entries['main.js'].unshift('./node_modules/@nodelib/fs.scandir/out/adapters/fs.js');
        }
        return entries;
      };
    }
    
    // Force Next.js to transpile problematic node_modules
    const transpileModules = ['tailwindcss', '@nodelib', 'fast-glob'];
    config.module.rules.push({
      test: new RegExp(`node_modules/(${transpileModules.join('|')})/.*`),
      use: 'next-babel-loader',
    });
    
    return config;
  },
  // Configure rewrites for API routes if needed
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;