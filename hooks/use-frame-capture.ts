import type { Stage } from 'konva/lib/Stage';
import { useEffect, useRef } from 'react';

type FrameFormat = 'uri' | 'blob' | 'buffer';

interface UseFrameCaptureOptions {
	format: FrameFormat;
	onComplete?: (fps: number) => void;
	onAddFrame?: (frame: string | Blob | ArrayBuffer) => void;
	targetFps?: number;
}

export function useFrameCapture(
	stageRef: React.RefObject<Stage>,
	isRecording: boolean,
	{ onComplete, onAddFrame, format = 'uri', targetFps = 60 }: UseFrameCaptureOptions = {
		format: 'uri',
		targetFps: 60,
	}
) {
	const framesRef = useRef<(string | Blob | ArrayBuffer)[]>([]);
	const frameTimestampsRef = useRef<number[]>([]);
	const rafRef = useRef<number | null>(null);
	const recordingRef = useRef(isRecording);

	// sincronizza ref con stato
	useEffect(() => {
		recordingRef.current = isRecording;
	}, [isRecording]);

	// loop di cattura frame
	useEffect(() => {
		if (!stageRef.current || !isRecording) return;

		// cleanup precedente
		if (rafRef.current) cancelAnimationFrame(rafRef.current);

		const canvas = stageRef.current.toCanvas();
		const ctx = canvas.getContext('2d');

		if (ctx && !ctx.imageSmoothingEnabled) ctx.imageSmoothingEnabled = true;
		if (ctx && ctx.imageSmoothingQuality !== 'high') ctx.imageSmoothingQuality = 'high';

		const frameInterval = 1000 / targetFps;
		let lastCapture = performance.now();

		const loop = async (now: number) => {
			if (!recordingRef.current || !stageRef.current) return;

			const elapsed = now - lastCapture;
			if (elapsed >= frameInterval) {
				lastCapture = now - (elapsed % frameInterval);
				frameTimestampsRef.current.push(now);

				switch (format) {
					case 'uri': {
						const uri = stageRef.current.toDataURL({
							mimeType: 'image/png',
							pixelRatio: 3,
							quality: 1,
						});
						framesRef.current.push(uri);
						break;
					}
					case 'blob': {
						const blob = (await stageRef.current.toBlob({
							mimeType: 'image/webp',
							pixelRatio: 3,
							quality: 0.93,
						})) as Blob;
						framesRef.current.push(blob);
						break;
					}
					case 'buffer': {
						const blob = (await stageRef.current.toBlob({
							mimeType: 'image/webp',
							pixelRatio: 2,
							quality: 0.93,
						})) as Blob;

						const buffer = await blob.arrayBuffer();
						onAddFrame && onAddFrame(buffer);
						break;
					}
				}
			}

			rafRef.current = requestAnimationFrame(loop);
		};

		rafRef.current = requestAnimationFrame(loop);

		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [isRecording, stageRef, format, targetFps, onAddFrame]);

	// effetto separato per gestire onComplete quando la registrazione termina
	useEffect(() => {
		if (isRecording || frameTimestampsRef.current.length === 0) return; // esce finché è attivo

		let totalDuration = 0;
		for (let i = 1; i < frameTimestampsRef.current.length; i++) {
			totalDuration +=
				frameTimestampsRef.current[i] - frameTimestampsRef.current[i - 1];
		}

		const averageFps = frameTimestampsRef.current.length / (totalDuration / 1000);
		onComplete && onComplete(Math.round(averageFps));

		// reset dopo la callback
		framesRef.current = [];
		frameTimestampsRef.current = [];
	}, [isRecording, onComplete]);

	return null;
}
