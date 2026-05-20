import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
	try {
		const { username, password } = await req.json();

		if (username !== 'FuffaGuru') throw new Error('Credenziali non valide');
		if (password !== 'sk8wHAFR4Rcq9uBHhR3NBvV7I9R7vWWhEPpCxh45HfiHUVe3z7') {
			throw new Error('Credenziali non valide');
		}

		const token = randomUUID();
		const response = NextResponse.json({
			success: 1,
			data: {
				user: { username },
				token,
			},
		});

		response.cookies.set('auth_token', token, {
			path: '/',
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			httpOnly: false,
			maxAge: 60 * 60 * 24 * 7,
		});

		return response;
	} catch (error) {
		const { message, cause, stack } = error as Error;

		console.error(
			`| Cause => ${cause}\n| Error message in MIDDLE handlers => ${message}\n`,
			`\n| Stack => ${stack}`
		);

		return NextResponse.json({ success: 0, message });
	}
};
