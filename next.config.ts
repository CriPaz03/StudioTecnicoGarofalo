import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  allowedDevOrigins: ["192.168.1.36"],
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: [384, 640, 960, 1280, 1600, 1920],
    imageSizes: [96, 192, 256],
  },
  poweredByHeader: false,
};
export default nextConfig;
