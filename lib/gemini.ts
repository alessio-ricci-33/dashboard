import { env } from 'node:process';
import { GoogleGenAI } from '@google/genai';
import { shortsTitles } from '@/constants/system-instructions';

export type ModelName =
	| 'gemini-2.5-pro'
	| 'gemini-2.5-flash'
	| 'gemini-2.5-flash-lite-preview-06-17'
	| 'gemini-2.0-flash';

// --- Gestione API Keys con rotazione ---
const API_KEYS = [env.GEMINI_API_KEY_1, env.GEMINI_API_KEY_2, env.GEMINI_API_KEY_3].filter(
	Boolean
) as string[];

if (API_KEYS.length === 0) {
	throw new Error('Nessuna API key GEMINI trovata nelle variabili ambiente.');
}

let currentKeyIndex = 0;

// --- Factory per creare il client con la chiave corrente ---
const createClient = (apiKey: string) => new GoogleGenAI({ apiKey });

// --- Wrapper per rotazione automatica ---
const withKeyRotation = async <T>(fn: (client: GoogleGenAI) => Promise<T>): Promise<T> => {
	let lastError: any;

	for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
		const apiKey = API_KEYS[currentKeyIndex];
		const client = createClient(apiKey);

		try {
			return await fn(client);
		} catch (error: any) {
			const message = error?.message?.toLowerCase?.() || '';

			// Se è un errore di quota, ruota e riprova
			if (
				message.includes('quota') ||
				message.includes('rate limit') ||
				message.includes('limit') ||
				message.includes('exceeded')
			) {
				lastError = error;
				currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
				console.warn(
					`[genShortTitles] Quota limit raggiunto, rotazione su API key ${
						currentKeyIndex + 1
					}`
				);
				continue;
			}

			// Altro tipo di errore: interrompi
			throw error;
		}
	}

	// Se tutte le chiavi falliscono
	throw new Error(
		`Tutte le API key hanno raggiunto il limite. Ultimo errore: ${
			lastError?.message || 'sconosciuto'
		}`
	);
};

// --- Funzione principale ---
export const genShortTitles = async ({
	modelName = 'gemini-2.5-flash',
	prompt,
	systemInstruction = shortsTitles,
}: {
	modelName?: ModelName;
	prompt: string;
	systemInstruction: string;
}) => {
	return await withKeyRotation(async client => {
		const { models } = client;
		const model = models.generateContent;

		return await model({
			model: modelName,
			config: {
				candidateCount: 3,
				temperature: 0.65,
				maxOutputTokens: 500,
				responseMimeType: 'application/json',
				systemInstruction,
			},
			contents: [
				{
					role: 'user',
					parts: [{ text: prompt }],
				},
			],
		});
	});
};
