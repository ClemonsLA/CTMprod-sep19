/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "",
  reactStrictMode: false,
  swcMinify: false, // 'minify' in Next versions < 12.0
  env: {
    CONTRACT: process.env.CONTRACT,
    API_URL: process.env.API_URL
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/collection/itemOverview/:path*',
        destination: '/itemOverview/:path*',
      },
    ]
  },
};

module.exports = nextConfig;
