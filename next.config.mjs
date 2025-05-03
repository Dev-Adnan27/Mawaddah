import { withNextVideo } from 'next-video/process';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all domains (HTTPS)
      },
      {
        protocol: 'http',
        hostname: '**', // Allow all domains (HTTP)
      },
    ],
  },
};

export default withNextVideo(nextConfig);
