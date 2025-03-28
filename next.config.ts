import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		authInterrupts: true,
		dynamicIO: true,
		nodeMiddleware: true,
		cacheLife: {
			organizations: {
				stale: 7200, // 2 hours
				revalidate: 900, // 15 minutes
				expire: 86400, // 1 day
			},
		},
	},
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "utfs.io",
			},
		],
	},
};

export default nextConfig;
