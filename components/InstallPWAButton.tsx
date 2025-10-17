'use client';
// components/InstallPWAButton.tsx
import { useEffect, useState } from 'react';

const InstallPWAButton = () => {
	const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
	const [isInstallable, setIsInstallable] = useState(false);

	useEffect(() => {
		const handler = (e: Event) => {
			e.preventDefault(); // Previeni il prompt automatico
			setDeferredPrompt(e);
			setIsInstallable(true);
		};

		window.addEventListener('beforeinstallprompt', handler);

		return () => {
			window.removeEventListener('beforeinstallprompt', handler);
		};
	}, []);

	const handleInstallClick = async () => {
		if (!deferredPrompt) return;

		// Mostra il prompt
		// @ts-ignore
		deferredPrompt.prompt();

		// Aspetta la risposta dell'utente
		// @ts-ignore
		const { outcome } = await deferredPrompt.userChoice;
		console.log(`Installazione scelta: ${outcome}`);

		// Pulisci l'evento
		setDeferredPrompt(null);
		setIsInstallable(false);
	};

	if (!isInstallable) return null;

	return (
		<button
			onClick={handleInstallClick}
			style={{ padding: '10px', background: '#000', color: '#fff' }}>
			📲 Installa l'app
		</button>
	);
};

export default InstallPWAButton;
