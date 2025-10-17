import { SchemaTypes } from 'mongoose';
import type { WithId } from '@/types/model';
import type { ConstructToType } from '@/types/utils';

export const Metrics = {
	timestamp: { type: Number, default: Date.now }, // Date.now → come funzione
	views: { type: Number, required: true },
	likes: { type: Number, required: true },
	favorites: { type: Number, required: true },
	comments: { type: Number, required: true },
};

export type MetricsType = ConstructToType<typeof Metrics>;

export const Short = {
	videoId: { type: String, required: true, unique: true, index: true },

	// --- Sync / update tracking ---
	etag: { type: String, required: true },
	lastSyncedAt: { type: Date, default: () => new Date() }, // ultima chiamata riuscita
	lastChangedAt: { type: Date, default: null }, // quando l’etag è cambiato

	// --- Metrics history ---
	metricsHistory: { type: [Metrics], default: [] },

	// --- Core metadata (snippet + contentDetails + status) ---
	metadata: {
		snippet: {
			publishedAt: { type: Date, required: true },
			title: { type: String },
			description: { type: String },
			thumbnails: { type: SchemaTypes.Mixed },
			tags: [String],
			channelTitle: { type: String },
			defaultLanguage: { type: String },
			liveBroadcastContent: { type: String },
		},

		content: {
			duration: { type: String },
			dimension: { type: String },
			definition: { type: String },
			caption: { type: String },
			licensedContent: { type: Boolean },
			contentRating: { type: SchemaTypes.Mixed },
		},
	},
};

export type ShortType = ConstructToType<typeof Short>;
export type ShortWithId = WithId<typeof Short>;

export default Short;
