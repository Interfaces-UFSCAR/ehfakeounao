/** @type {import('next').NextConfig} */

import { config } from 'dotenv';
config();

const nextConfig = {
  reactStrictMode: true,
  ...(process.env.STATIC_EXPORT && {
    output: 'export',
    images: { unoptimized: true },
  }),
};

export default nextConfig;
