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
			className="sticky top-0 z-50 flex items-center justify-center w-full h-12 text-xl">
			📲 Installa l'app
		</button>
	);
};

export default InstallPWAButton;
