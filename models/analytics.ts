import { Model } from './lib/model';
import mongodb from './lib/mongodb';

import short from './schema/analytics/short';

const db = await mongodb({ name: 'analytics' });
export default db;

export const Short = await Model(short, { name: 'Short', db, collectionName: 'shorts' });

export type { Short as ShortType } from './schema/analytics/short';
