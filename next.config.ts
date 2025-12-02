import withPWA from 'next-pwa';
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
	async rewrites() {
		return [
			{
				source: '/server/:path*',
				destination: 'https://server.msgi.it/:path*',
			},
		];
	},
};

// Avvolgi la configurazione con withPWA solo in produzione
const isProd = process.env.NODE_ENV === 'production';

export default isProd
	? withPWA({
			dest: 'public',
			register: true,
			skipWaiting: true,
	  })(nextConfig)
	: nextConfig;
