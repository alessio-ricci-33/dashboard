import _try from '@/utils/_try';

export const POST = async (req: Request) =>
	await _try(async () => {
		console.log('login');
		const { username, password } = await req.json();

		if (username !== 'FuffaGuru') throw new Error('Credenziali non valide');
		if (password !== 'sk8wHAFR4Rcq9uBHhR3NBvV7I9R7vWWhEPpCxh45HfiHUVe3z7')
			throw new Error('Credenziali non valide');

		return true;
	});
