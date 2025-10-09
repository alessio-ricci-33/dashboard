import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// add all url available in your app
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*', // Allow images from all domains
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	experimental: {
		staleTimes: {
			dynamic: 0,
		},
		serverActions: {
			bodySizeLimit: '20mb',
		},
	},
	async headers() {
		return [
			{
				source: '/:path*', // Match all routes
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value: 'https://server.msgi.it',
					},
					{
						key: 'Access-Control-Allow-Methods',
						value: 'POST',
					},
					{
						key: 'Access-Control-Allow-Headers',
						value: 'Content-Type, Authorization, X-Requested-With',
					},
					{
						key: 'Access-Control-Allow-Credentials',
						value: 'true',
					},
					{
						key: 'Cache-Control',
						value: 'no-cache, must-revalidate, proxy-revalidate',
					},
					{ key: 'Pragma', value: 'no-cache' },
					{ key: 'Expires', value: '0' },
				],
			},
		];
	},
};

export default nextConfig;
