import mongoose from 'mongoose';
import { env } from 'process';

export const newConn = async (uri: string, dbName?: string) => {
	const conn = mongoose.createConnection(uri, { dbName });
	return await conn.asPromise();
};

export default async ({
	name = env.MONGODB_DEFAULT_DBNAME,
	uri = env.MONGODB_URI,
	forceNew = false,
}: {
	name?: string;
	uri?: string;
	forceNew?: boolean;
} = {}) => {
	if (!(globalThis as any)._mongoose) {
		(globalThis as any)._mongoose = await mongoose.connect(uri, {
			bufferCommands: false,
		});
	}

	if (forceNew) return await newConn(uri, name);

	const connections = mongoose.connections.filter(conn => conn.name === name);
	if (!connections.length) return await newConn(uri, name);

	for (const conn of connections) {
		if ([0, 3, 99].includes(conn.readyState)) {
			await conn.close();
		}
	}

	return (
		mongoose.connections.find(conn => conn.name === name && conn.readyState === 1) ??
		(await newConn(uri, name))
	);
};

process.on('SIGINT', async () => {
	await Promise.all(mongoose.connections.map(async conn => conn.close()));
	process.exit(0);
});
