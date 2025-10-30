import { genShortTitles } from '@/lib/gemini';
import _try from '@/utils/_try';

export const POST = async (req: Request) =>
	await _try(async () => {
		const props = await req.json();

		const [tiktok, youtube, instagram] = await Promise.all(
			['tiktok', 'youtube', 'instagram'].map(platform =>
				genShortTitles({ ...props, platform })
			)
		);

		return {
			tiktok: tiktok.candidates
				.map(c => c.content.parts)
				.flat()
				.map(p => p.text),
			youtube: youtube.candidates
				.map(c => c.content.parts)
				.flat()
				.map(p => p.text),
			instagram: instagram.candidates
				.map(c => c.content.parts)
				.flat()
				.map(p => p.text),
		};
	});
