import { env } from 'process';
import { connect } from 'mongoose';

export const newConn = async (uri: string, dbName?: string) => {
	const newConn = mongoose.createConnection(uri, { dbName });
	return await newConn.asPromise(); // Aspetta connessione
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
	if (!('mongoose' in globalThis)) {
		globalThis.mongoose = await connect(uri, {
			bufferCommands: false,
		});
	}

	if (forceNew) return await newConn(uri, name);

	const connections = mongoose.connections.filter(conn => conn.name === name);
	if (!connections.length) return await newConn(uri, name);

	await Promise.all(
		connections.map(async ({ readyState, close }) => {
			if ([0, 3, 99].some(state => state === readyState)) return await close();
		})
	);

	return (
		mongoose.connections.find(conn => conn.name === name && conn.readyState === 1) ??
		(await newConn(uri, name))
	);
};

// On signal exit, close all connections
process.on('SIGINT', async () => {
	await Promise.all(mongoose.connections.map(async conn => await conn.close()));
	process.exit(0);
});
