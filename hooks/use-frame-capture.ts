// hooks/use-frame-capture.ts
import type { Stage } from 'konva/lib/Stage';
import { useEffect, useRef } from 'react';

type FrameFormat = 'uri' | 'blob' | 'buffer';

interface UseFrameCaptureOptions {
	format?: FrameFormat;
	onComplete?: (frames: (string | Blob | ArrayBuffer)[], fps: number) => void;
	targetFps?: number;
	pixelRatio?: number;
	// fingerprint dimension (smaller => più veloce, meno sensibile)
	fingerprintSize?: number;
}

function dataURLToBlob(dataurl: string): Blob {
	const parts = dataurl.split(',');
	const m = parts[0].match(/:(.*?);/);
	const mime = m ? m[1] : 'image/png';
	const bstr = atob(parts[1]);
	let n = bstr.length;
	const u8 = new Uint8Array(n);
	while (n--) u8[n] = bstr.charCodeAt(n);
	return new Blob([u8], { type: mime });
}

export function useFrameCapture(
	stageRef: React.RefObject<Stage>,
	isRecording: boolean,
	{
		onComplete,
		format = 'uri',
		targetFps = 60,
		pixelRatio = 2,
		fingerprintSize = 64,
	}: UseFrameCaptureOptions = {}
) {
	const framesRef = useRef<(string | Blob | ArrayBuffer)[]>([]);
	const frameTimestampsRef = useRef<number[]>([]);
	const rafRef = useRef<number | null>(null);
	const lastFingerprintRef = useRef<number | null>(null);
	const capturingRef = useRef(false);

	useEffect(() => {
		if (!stageRef.current) return;

		// cleanup prev
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}

		// finalize se abbiamo frames e la registrazione è finita
		if (!isRecording && framesRef.current.length > 0) {
			let totalDuration = 0;
			for (let i = 1; i < frameTimestampsRef.current.length; i++) {
				totalDuration +=
					frameTimestampsRef.current[i] - frameTimestampsRef.current[i - 1];
			}
			// evita divide by zero
			const averageFps =
				totalDuration > 0
					? framesRef.current.length / (totalDuration / 1000)
					: targetFps;
			const roundedFps = Math.round(averageFps);
			if (onComplete) onComplete(framesRef.current, roundedFps);

			framesRef.current = [];
			frameTimestampsRef.current = [];
			lastFingerprintRef.current = null;
			return;
		}

		// prepara canvas piccolo per fingerprint
		const compareCanvas = document.createElement('canvas');
		const fw = Math.max(8, Math.min(128, Math.floor(fingerprintSize)));
		const fh = fw;
		compareCanvas.width = fw;
		compareCanvas.height = fh;
		const compareCtx = compareCanvas.getContext('2d');

		// set imageSmoothing per confronto
		const stageCanvas = stageRef.current.toCanvas();
		const stageCtx = stageCanvas.getContext('2d');
		if (stageCtx) {
			stageCtx.imageSmoothingEnabled = true;
			stageCtx.imageSmoothingQuality = 'high';
		}
		if (compareCtx) {
			compareCtx.imageSmoothingEnabled = true;
			compareCtx.imageSmoothingQuality = 'high';
		}

		const frameInterval = 1000 / targetFps;
		let lastCapture = performance.now();

		function computeFingerprint(canvas: HTMLCanvasElement): number | null {
			try {
				if (!compareCtx) return null;
				// draw downscaled
				compareCtx.clearRect(0, 0, fw, fh);
				compareCtx.drawImage(canvas, 0, 0, fw, fh);
				const img = compareCtx.getImageData(0, 0, fw, fh).data;
				// FNV-1a like quick hash on RGB
				let hash = 2166136261 >>> 0;
				for (let i = 0; i < img.length; i += 4) {
					// combine R G B
					hash ^= img[i];
					hash = Math.imul(hash, 16777619) >>> 0;
					hash ^= img[i + 1];
					hash = Math.imul(hash, 16777619) >>> 0;
					hash ^= img[i + 2];
					hash = Math.imul(hash, 16777619) >>> 0;
				}
				return hash >>> 0;
			} catch {
				return null;
			}
		}

		const doCapture = async (timestamp: number) => {
			if (!stageRef.current || !isRecording) return;
			if (capturingRef.current) return;
			capturingRef.current = true;

			try {
				const canvas = stageRef.current.toCanvas();
				// fingerprint -> se uguale al precedente skip (evita frame duplicati)
				const fp = computeFingerprint(canvas);
				if (fp !== null && fp === lastFingerprintRef.current) {
					// frame visivamente identico -> skip
					return;
				}
				lastFingerprintRef.current = fp;

				frameTimestampsRef.current.push(timestamp);

				// creiamo dataURL (supporta pixelRatio direttamente)
				const dataUrl = stageRef.current.toDataURL({
					mimeType: 'image/png',
					quality: 1,
					pixelRatio,
				});

				if (format === 'uri') {
					framesRef.current.push(dataUrl);
				} else {
					const blob = dataURLToBlob(dataUrl);
					if (format === 'blob') framesRef.current.push(blob);
					else framesRef.current.push(await blob.arrayBuffer());
				}
			} finally {
				capturingRef.current = false;
			}
		};

		// fallback: rAF loop throttled (indipendente dal refresh del monitor)
		const loop = (now: number) => {
			if (!isRecording || !stageRef.current) return;
			const elapsed = now - lastCapture;
			if (elapsed >= frameInterval) {
				lastCapture = now - (elapsed % frameInterval);
				void doCapture(now);
			}
			rafRef.current = requestAnimationFrame(loop);
		};

		rafRef.current = requestAnimationFrame(loop);

		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRecording, stageRef, format, targetFps, onComplete, pixelRatio, fingerprintSize]);

	return null;
}
