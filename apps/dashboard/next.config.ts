import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@optima/ui", "@optima/logger"],
	typedRoutes: true,
};

export default nextConfig;
