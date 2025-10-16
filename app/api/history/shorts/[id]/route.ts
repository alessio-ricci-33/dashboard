import { NextResponse } from 'next/server';
import { Short } from '@/models/analytics';
import _try from '@/utils/_try';

export const GET = async (req: Request, { params }: { params: { id: string } }) =>
	await _try(async () => {
		const { id: video_id } = await params;

		const short = await Short.findOne({ video_id }).lean();
		if (!short) throw new Error('Short not found.');

		short.views.filter(v => v.count > 0);
		short.views.sort((a, b) => a.timestamp - b.timestamp);

		const diffs = short.views.splice(0, 1);
		for (const views of short.views) {
			diffs.push({
				...views,
				delta: views.count - diffs[diffs.length - 1].count,
			});
		}

		return diffs;
	});
