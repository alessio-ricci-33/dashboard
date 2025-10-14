import { env } from 'node:process';
import { GoogleGenAI } from '@google/genai';
import { shortsTitles } from '@/constants/system-instructions';

export const genai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY_2 });

export const { models } = genai;
export const model = models.generateContent;

export const genShortTitles = async ({
	modelName = 'gemini-2.0-flash',
	prompt,
	systemInstruction = shortsTitles,
}: {
	modelName?: ModelName;
	prompt: string;
	systemInstruction: string;
}) => {
	return await model({
		model: modelName,
		config: {
			candidateCount: 1,
			temperature: 0.45,
			maxOutputTokens: 500, // Aumenta per permettere più discriminatori e descrizioni più ricche
			responseMimeType: 'application/json',
			systemInstruction: systemInstruction,
		},
		contents: [
			{
				role: 'user',
				parts: [
					{
						text: prompt,
					},
				],
			},
		],
	});
};

export type ModelName =
	| 'gemini-2.5-pro'
	| 'gemini-2.5-flash'
	| 'gemini-2.5-flash-lite-preview-06-17'
	| 'gemini-2.0-flash';
