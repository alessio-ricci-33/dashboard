import type { WithId } from '@/types/model';

export const Metric = {
	timestamp: { type: Number, default: Date.now }, // Date.now → come funzione
	count: { type: Number, required: true },
};

const defaultMetric = () => [
	{
		timestamp: Date.now(),
		count: 0,
	},
];

export const Short = {
	video_id: { type: String, required: true },
	views: {
		type: [Metric],
		default: defaultMetric,
	},

	likes: {
		type: [Metric],
		default: defaultMetric,
	},

	comments: {
		type: [Metric],
		default: defaultMetric,
	},
};

export default Short;
export type Creator = WithId<typeof Short>;
