/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@optima/ui"],
	experimental: {
		nodeMiddleware: true,
	},
};

export default nextConfig;
