import mongodb from './mongodb';
import { randomUUID as randomUUIDv7 } from 'crypto';
import { Schema } from 'mongoose';

const s = <T extends object>(obj: T) => new Schema(obj, { timestamps: true });

export const Model = async <T extends object>(
	schema: T,
	{
		name,
		db,
		dbName = name.toLowerCase() + 's',
		collectionName = '_self',
	}: {
		name: string;
		collectionName?: string;
		dbName?: string;
		db?: Awaited<ReturnType<typeof mongodb>>;
	},

	pre_insert = (doc: any): any => {}
) =>
	(db ?? (await mongodb({ name: dbName }))).model(
		name,
		s({
			uuid: {
				type: String,
				default: () => randomUUIDv7(),
			},
			...schema,
		}).pre('validate', function (next) {
			if ('uuid' in this) pre_insert(this);
			next();
		}),
		collectionName
	);
