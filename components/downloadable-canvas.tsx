import { Stage } from 'react-konva';
import { PropsWithChildren, useEffect, useRef } from 'react';

export default ({
	children,
	...props
}: PropsWithChildren &
	Partial<Parameters<typeof Stage>[0]> & { download?: boolean; onDownload?: () => void }) => {
	const stageRef = useRef<any>(null);

	useEffect(() => {
		console.log(props.download);
		if (props.download) {
			handleDownload();
		}
	}, [props.download]);

	const handleDownload = () => {
		try {
			if (!stageRef.current) return;

			const uri = stageRef.current.toDataURL({
				mimeType: 'image/webp',
				pixelRatio: 10, // aumenta per qualità superiore
				quality: 1, // 1 = massima qualità per WebP
			});

			const link = document.createElement('a');
			link.download = 'canvas.webp';
			link.href = uri;
			link.click();
			link.remove();
			window.URL.revokeObjectURL(uri);
		} finally {
			props.onDownload && props.onDownload();
		}
	};

	return (
		<Stage
			ref={stageRef}
			options={{ preserveDrawingBuffer: true }}
			style={{ backgroundColor: 'transparent', overflow: 'visible' }}
			{...props}>
			{children}
		</Stage>
	);
};
