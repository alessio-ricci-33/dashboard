import { NextResponse } from 'next/server';
import { genShortTitles } from '@/lib/gemini';
import {
	DEFAULT_GEMINI_MODEL,
	isGeminiModelName,
} from '@/constants/gemini-models';
import _try from '@/utils/_try';

export const POST = async (req: Request) => {
	let props: Record<string, any>;

	try {
		props = await req.json();
	} catch {
		return NextResponse.json(
			{
				success: 0,
				message: 'Invalid JSON body',
			},
			{ status: 400 }
		);
	}

	const requestedModel = props.modelName ?? props.model ?? DEFAULT_GEMINI_MODEL;

	if (!isGeminiModelName(requestedModel)) {
		return NextResponse.json(
			{
				success: 0,
				message: `Unsupported model: ${requestedModel}`,
			},
			{ status: 400 }
		);
	}

	return await _try(async () => {
		const [tiktok, youtube, instagram] = await Promise.all(
			['tiktok', 'youtube', 'instagram'].map(platform =>
				genShortTitles({
					...props,
					modelName: requestedModel,
					platform,
				})
			)
		);

		return {
			tiktok: [
				...new Set(
					tiktok.candidates
						.map(c => c.content.parts)
						.flat()
						.map(p => p.text)
				),
			],
			youtube: [
				...new Set(
					youtube.candidates
						.map(c => c.content.parts)
						.flat()
						.map(p => p.text)
				),
			],
			instagram: [
				...new Set(
					instagram.candidates
						.map(c => c.content.parts)
						.flat()
						.map(p => p.text)
				),
			],
		};
	});
};
