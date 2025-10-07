import { useEffect, useRef } from 'react';

import type { Stage } from 'konva/lib/Stage';

export function useFrameCapture(
	stageRef: React.RefObject<Stage>,
	isRecording: boolean,
	onComplete: (frames: string[], fps: number) => void
) {
	const framesRef = useRef<string[]>([]);
	const frameTimestampsRef = useRef<number[]>([]);

	useEffect(() => {
		if (!stageRef.current) return;

		const canvas = stageRef.current?.toCanvas();
		const ctx = canvas.getContext('2d');
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';

		if (!isRecording && framesRef.current.length > 0) {
			let totalDuration = 0;
			for (let i = 1; i < frameTimestampsRef.current.length; i++) {
				totalDuration +=
					frameTimestampsRef.current[i] - frameTimestampsRef.current[i - 1];
			}
			const averageFps = framesRef.current.length / (totalDuration / 1000);
			const roundedFps = Math.round(averageFps);
			onComplete(framesRef.current, roundedFps);
		}

		const handleFrameCapture = (currentTime: number) => {
			if (!stageRef.current || !isRecording) return;
			console.count('frame captured');

			frameTimestampsRef.current.push(currentTime);

			// access canvas context to improve smoothing
			const canvas = stageRef.current.toCanvas();
			const ctx = canvas.getContext('2d');
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = 'high';

			const uri = stageRef.current.toDataURL({
				mimeType: 'image/png',
				quality: 1,
				pixelRatio: 2,
			});
			framesRef.current.push(uri);

			requestAnimationFrame(handleFrameCapture);
		};

		requestAnimationFrame(handleFrameCapture);
	}, [isRecording, stageRef.current]);

	return null;
}
