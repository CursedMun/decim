/** @type {import('next').NextConfig} */

const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  },
  images: {
    unoptimized: true,
    domains: ['avatars.githubusercontent.com', 'images.unsplash.com'],
  },
  output: 'export',
  distDir: 'dist',
};

module.exports = nextConfig;
