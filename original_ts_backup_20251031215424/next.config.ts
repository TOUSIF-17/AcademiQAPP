import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: false,
  webpack: (config) => {
    config.devtool = false;
    return config;
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;


