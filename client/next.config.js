/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the dev server to serve assets for specified origins
  allowedDevOrigins: ['127.0.0.1:3001', 'localhost:3001'],

  // Keep Turbopack enabled
  turbopack: {},

  // (Optional) Add any other settings, e.g., React Strict Mode
  reactStrictMode: true,
};

module.exports = nextConfig;
