import type { Stage } from 'konva/lib/Stage';
import { useEffect, useRef } from 'react';

type FrameFormat = 'uri' | 'blob' | 'buffer';

interface UseFrameCaptureOptions {
	format: FrameFormat;
	onComplete?: (frames: (string | Blob | ArrayBuffer)[], fps: number) => void;
	targetFps?: number; // opzionale, default 60
}

export function useFrameCapture(
	stageRef: React.RefObject<Stage>,
	isRecording: boolean,
	{ onComplete, format = 'uri', targetFps = 60 }: UseFrameCaptureOptions = {
		format: 'uri',
		targetFps: 60,
	}
) {
	const framesRef = useRef<(string | Blob | ArrayBuffer)[]>([]);
	const frameTimestampsRef = useRef<number[]>([]);
	const rafRef = useRef<number | null>(null);

	useEffect(() => {
		if (!stageRef.current) return;

		const canvas = stageRef.current.toCanvas();
		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = 'high';
		}

		// cleanup precedente
		if (rafRef.current) cancelAnimationFrame(rafRef.current);

		// se la registrazione è terminata
		if (!isRecording && framesRef.current.length > 0) {
			let totalDuration = 0;
			for (let i = 1; i < frameTimestampsRef.current.length; i++) {
				totalDuration +=
					frameTimestampsRef.current[i] - frameTimestampsRef.current[i - 1];
			}

			const averageFps = framesRef.current.length / (totalDuration / 1000);
			const roundedFps = Math.round(averageFps);

			if (onComplete) onComplete(framesRef.current, roundedFps);

			// reset
			framesRef.current = [];
			frameTimestampsRef.current = [];
			return;
		}

		// parametri di throttling
		const frameInterval = 1000 / targetFps;
		let lastCapture = performance.now();

		const loop = async (now: number) => {
			if (!isRecording || !stageRef.current) return;

			const elapsed = now - lastCapture;
			if (elapsed >= frameInterval) {
				lastCapture = now - (elapsed % frameInterval);
				frameTimestampsRef.current.push(now);

				const canvas = stageRef.current.toCanvas();
				const ctx = canvas.getContext('2d');
				if (ctx) {
					ctx.imageSmoothingEnabled = true;
					ctx.imageSmoothingQuality = 'high';
				}

				switch (format) {
					case 'uri': {
						const uri = stageRef.current.toDataURL({
							mimeType: 'image/png',
							quality: 1,
							pixelRatio: 2,
						});
						framesRef.current.push(uri);
						break;
					}
					case 'blob': {
						const blob = await new Promise<Blob>(resolve =>
							canvas.toBlob(b => resolve(b!), 'image/png', 1)
						);
						framesRef.current.push(blob);
						break;
					}
					case 'buffer': {
						const blob = await new Promise<Blob>(resolve =>
							canvas.toBlob(b => resolve(b!), 'image/png', 1)
						);
						const buffer = await blob.arrayBuffer();
						framesRef.current.push(buffer);
						break;
					}
					default:
						throw new Error(`Formato frame non supportato: ${format}`);
				}
			}

			rafRef.current = requestAnimationFrame(loop);
		};

		rafRef.current = requestAnimationFrame(loop);

		// cleanup alla disattivazione o unmount
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [isRecording, stageRef, format, targetFps, onComplete]);

	return null;
}
