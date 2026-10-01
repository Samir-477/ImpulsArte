import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_PREVIEW_DIST_DIR || ".next",
};

export default nextConfig;
