import { NextResponse } from 'next/server';
import { Short } from '@/models/analytics';
import _try from '@/utils/_try';

export const GET = async (req: Request, { params }: { params: { id: string } }) =>
	await _try(async () => {
		const { id: videoId } = await params;

		const short = await Short.findOne({ videoId }).lean();
		if (!short) throw new Error('Short not found.');

		short.metricsHistory.sort((a, b) => a.timestamp - b.timestamp);

		console.log(short.metricsHistory);
		if (short.metricsHistory.length < 2) return [];

		const diffs = [];
		for (let i = 0; i < short.metricsHistory.length - 1; i++) {
			const metrics = short.metricsHistory[i + 1],
				prevMetrics = short.metricsHistory[i];

			diffs.push({
				timestamp: metrics.timestamp,
				views: metrics.views - prevMetrics.views,
				likes: metrics.likes - prevMetrics.likes,
				favorites: metrics.favorites - prevMetrics.favorites,
				comments: metrics.comments - prevMetrics.comments,
			});
		}

		console.log(diffs);
		return diffs;
	});
