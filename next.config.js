/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    urlImports: ["https://unpkg.com/browser-fs-access"],
  },
};

module.exports = nextConfig;
