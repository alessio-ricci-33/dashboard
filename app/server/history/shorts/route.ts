import { NextResponse } from 'next/server';

const REMOTE_BASE_URL = 'https://server.msgi.it';
const CANDIDATE_PATHS = ['/history/shorts', '/api/history/shorts'];

export const dynamic = 'force-dynamic';

export const GET = async () => {
	const failures: string[] = [];

	for (const remotePath of CANDIDATE_PATHS) {
		const url = `${REMOTE_BASE_URL}${remotePath}`;

		try {
			const response = await fetch(url, {
				method: 'GET',
				cache: 'no-store',
				headers: {
					Accept: 'application/json',
				},
			});

			if (!response.ok) {
				failures.push(`${remotePath}: ${response.status}`);
				continue;
			}

			const json = await response.json();
			return NextResponse.json(json, { status: 200 });
		} catch (error) {
			failures.push(`${remotePath}: ${(error as Error).message}`);
		}
	}

	return NextResponse.json(
		{
			success: 0,
			message: `Upstream shorts history unavailable (${failures.join(' | ')})`,
			data: [],
		},
		{ status: 502 }
	);
};
