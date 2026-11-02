import type { NextConfig } from "next";

// Static export so the site can be served from GitHub Pages (or any static host).
// For a project page (username.github.io/repo), set NEXT_PUBLIC_BASE_PATH=/repo at build time.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
