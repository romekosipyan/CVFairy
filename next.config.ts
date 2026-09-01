import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer", "docx"],
};

export default nextConfig;

initOpenNextCloudflareForDev();
