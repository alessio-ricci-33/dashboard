import { Short } from '@/models/analytics';
import _try from '@/utils/_try';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = async (req: Request) =>
	await _try(async () => {
		const ids = await Short.find({}).lean();

		// Ordina per UUID v7 (lexicographically ordinabile)
		ids.sort(
			(a, b) =>
				new Date(b.metadata.snippet.publishedAt).getTime() -
				new Date(a.metadata.snippet.publishedAt).getTime()
		);

		console.log(ids.slice(0, 3).map(x => x.videoId));
		return ids.map(short => {
			const deltas = [];
			for (let curr = 1, prev = 0; curr <= short.metricsHistory.length - 1; curr++) {
				const metrics = short.metricsHistory[curr],
					prevMetrics = short.metricsHistory[prev];

				const delta = {
					views: metrics.views - prevMetrics.views,
					likes: metrics.likes - prevMetrics.likes,
					favorites: metrics.favorites - prevMetrics.favorites,
					comments: metrics.comments - prevMetrics.comments,
				};

				if (Object.values(delta).some(x => x !== 0)) {
					deltas.push({ timestamp: metrics.timestamp, ...delta });
					prev++;
				}
			}

			return { ...short, deltas };
		});
	});
