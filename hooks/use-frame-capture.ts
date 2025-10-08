import type { Stage } from 'konva/lib/Stage';
import { useEffect, useRef } from 'react';

type FrameFormat = 'uri' | 'blob' | 'buffer';

interface UseFrameCaptureOptions {
	format: FrameFormat;
	onComplete?: (frames: (string | Blob | ArrayBuffer)[], fps: number) => void;
}

export function useFrameCapture(
	stageRef: React.RefObject<Stage>,
	isRecording: boolean,
	{ onComplete, format }: UseFrameCaptureOptions = { format: 'uri' }
) {
	const framesRef = useRef<(string | Blob | ArrayBuffer)[]>([]);
	const frameTimestampsRef = useRef<number[]>([]);

	useEffect(() => {
		if (!stageRef.current) return;

		if (!isRecording && framesRef.current.length > 0) {
			// Calcolo FPS medio
			let totalDuration = 0;
			for (let i = 1; i < frameTimestampsRef.current.length; i++) {
				totalDuration +=
					frameTimestampsRef.current[i] - frameTimestampsRef.current[i - 1];
			}
			const averageFps = framesRef.current.length / (totalDuration / 1000);
			const roundedFps = Math.round(averageFps);

			if (onComplete) onComplete(framesRef.current, roundedFps);

			// Reset
			framesRef.current = [];
			frameTimestampsRef.current = [];
			return;
		}

		const captureFrame = async (currentTime: number) => {
			if (!stageRef.current || !isRecording) return;

			const canvas = stageRef.current.toCanvas();
			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = 'high';

			frameTimestampsRef.current.push(currentTime);

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

			requestAnimationFrame(captureFrame);
		};

		requestAnimationFrame(captureFrame);
	}, [isRecording, stageRef.current, format]);

	return null;
}
