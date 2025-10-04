import type { NextConfig } from "next";

// Only use basePath/assetPrefix in production (when building for GitHub Pages)
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/victorhugoart' : '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
