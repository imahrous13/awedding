import type { NextConfig } from "next";

const isProductionBuild = process.env.NODE_ENV === "production";
const basePath = isProductionBuild ? "/awedding" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
};

export default nextConfig;
