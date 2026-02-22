/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // googleapis has large proto files - exclude from edge bundling
    serverComponentsExternalPackages: ['googleapis'],
  },
};

module.exports = nextConfig;
