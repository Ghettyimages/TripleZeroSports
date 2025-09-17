/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    // Avoid build failures on Render due to missing peer ESLint plugins
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      // Add your CMS domain when deployed
    ],
  },
  async rewrites() {
    return [
      {
        source: '/rss.xml',
        destination: '/api/rss',
      },
    ];
  },
};

module.exports = nextConfig;
