/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Ensure Three.js works correctly
    config.externals = config.externals || [];
    return config;
  },
};

module.exports = nextConfig;
