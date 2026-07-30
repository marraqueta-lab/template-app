import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ui-modules se distribuye como TypeScript sin compilar; Next.js no compila
  // node_modules por defecto, así que hay que optar explícitamente.
  transpilePackages: ["@marraqueta/ui-modules"],
};

export default nextConfig;
