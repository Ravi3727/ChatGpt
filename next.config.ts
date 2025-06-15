import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // You can add these as well
        // port: '',
        // pathname: 'arifscloud/image/upload/**',
      },
    ],
    eslint: {
      dirs: ['pages', 'utils',], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
    },
  },
}

export default nextConfig;
