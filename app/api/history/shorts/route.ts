import { NextResponse } from 'next/server';
import { Short } from '@/models/analytics';
import _try from '@/utils/_try';

export const GET = async (req: Request) =>
	await _try(async () => {
		const ids = await Short.find({}, { video_id: 1, uuid: 1 }).lean();

		// Ordina per UUID v7 (lexicographically ordinabile)
		return ids.sort((a, b) => b.uuid.localeCompare(a.uuid)).map(s => s.video_id);
	});
