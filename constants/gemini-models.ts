export const GEMINI_MODEL_OPTIONS = [
	{ value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
	{
		value: 'gemini-2.5-flash-lite-preview-06-17',
		label: 'gemini-2.5-flash-lite-preview-06-17',
	},
	{ value: 'gemini-2.5-pro', label: 'gemini-2.5-pro' },
	{ value: 'gemini-2.0-flash', label: 'gemini-2.0-flash' },
	{ value: 'gemini-3.5-flash', label: 'gemini-3.5-flash' },
	{ value: 'gemini-3-flash-preview', label: 'gemini-3-flash-preview' },
	{ value: 'gemini-3.1-flash-lite', label: 'gemini-3.1-flash-lite' },
	{
		value: 'gemini-3.1-flash-lite-preview',
		label: 'gemini-3.1-flash-lite-preview',
	},
] as const;

export type GeminiModelName = (typeof GEMINI_MODEL_OPTIONS)[number]['value'];

export const DEFAULT_GEMINI_MODEL: GeminiModelName = 'gemini-2.5-flash';

export const isGeminiModelName = (
	value: unknown
): value is GeminiModelName =>
	typeof value === 'string' &&
	GEMINI_MODEL_OPTIONS.some(option => option.value === value);