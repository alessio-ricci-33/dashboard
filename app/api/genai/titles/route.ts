import { genShortTitles } from '@/lib/gemini';
import _try from '@/utils/_try';

export const POST = async (req: Request) =>
	await _try(async () => {
		const props = await req.json(),
			res = await genShortTitles(props);

		return JSON.parse(res.candidates[0].content.parts[0].text);
	});
