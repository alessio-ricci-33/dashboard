'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { useAuth } from '@/hooks/use-auth';
import apiFetch from '@/utils/api-fetch';

export default function LoginPage() {
	const { login, isAuthenticated } = useAuth();
	const router = useRouter();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (isAuthenticated) {
		router.replace('/');
		return null;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const { success, ...rest } = await apiFetch('/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: { username, password },
			});
			console.log('rest => ', rest);

			if (!success) throw new Error(rest.message);

			await login(username, password);
			router.replace('/');
		} catch (err: any) {
			setError(err.message || 'Errore di autenticazione');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 w-full flex items-center justify-center">
			<Card className="shadow-lg border border-zinc-600/45 aspect-video w-120">
				<CardHeader>
					<CardTitle className="text-center text-lg font-semibold">
						Accesso Riservato
					</CardTitle>
				</CardHeader>

				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="grid gap-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								value={username}
								onChange={e => setUsername(e.target.value)}
								placeholder="Inserisci username"
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={e => setPassword(e.target.value)}
								placeholder="••••••••"
								required
							/>
						</div>
						{error && <p className="text-sm text-red-600">{error}</p>}
					</CardContent>

					<CardFooter className="flex flex-col gap-2">
						<Button type="submit" disabled={loading}>
							{loading ? 'Accesso in corso...' : 'Accedi'}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
