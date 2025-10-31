import { Short } from '@/models/analytics';
import _try from '@/utils/_try';

export const GET = async (req: Request) =>
	await _try(async () => {
		const ids = await Short.find({}).lean();

		// Ordina per UUID v7 (lexicographically ordinabile)
		ids.sort(
			(a, b) =>
				new Date(b.metadata.snippet.publishedAt as any).getTime() -
				new Date(a.metadata.snippet.publishedAt as any).getTime()
		);

		return ids.map(short => {
			const deltas = [];
			let delta, fromMetrics;

			for (let curr = 1, prev = 0; curr <= short.metricsHistory.length - 1; curr++) {
				const metrics = short.metricsHistory[curr],
					prevMetrics = short.metricsHistory[prev];

				if (!fromMetrics) fromMetrics = prevMetrics;

				if (
					metrics.timestamp - fromMetrics.timestamp < 60000 * 30 &&
					prev !== short.metricsHistory.length - 1
				)
					continue;

				delta = {
					views: metrics.views - fromMetrics.views,
					likes: metrics.likes - fromMetrics.likes,
					favorites: metrics.favorites - fromMetrics.favorites,
					comments: metrics.comments - fromMetrics.comments,
				};

				if (Object.values(delta).some(x => x !== 0)) {
					deltas.push({
						from: fromMetrics.timestamp,
						to: metrics.timestamp,
						...delta,
					});
					prev = curr;

					delta = null;
					fromMetrics = null;
				}
			}

			return { ...short, deltas };
		});
	});
