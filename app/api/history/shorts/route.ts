import { NextResponse } from 'next/server';
import { Short } from '@/models/analytics';
import _try from '@/utils/_try';

export const GET = async (req: Request) =>
	await _try(async () => {
		const ids = await Short.find({}).lean();

		// Ordina per UUID v7 (lexicographically ordinabile)
		ids.sort(
			(a, b) =>
				new Date(b.metadata.publishedAt).getTime() -
				new Date(a.metadata.publishedAt).getTime()
		);

		return ids.map(short => {
			const deltas = [];
			for (let i = 0; i < short.metricsHistory.length - 1; i++) {
				const metrics = short.metricsHistory[i + 1],
					prevMetrics = short.metricsHistory[i];

				const delta = {
					views: metrics.views - prevMetrics.views,
					likes: metrics.likes - prevMetrics.likes,
					favorites: metrics.favorites - prevMetrics.favorites,
					comments: metrics.comments - prevMetrics.comments,
				};

				if (Object.values(delta).some(x => x !== 0))
					deltas.push({ timestamp: metrics.timestamp, ...delta });
			}

			return { ...short, deltas };
		});
	});
