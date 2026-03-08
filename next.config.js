/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  pageExtensions: ['tsx', 'ts'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i1.ytimg.com',
      },
    ],
  },
};

module.exports = nextConfig;
