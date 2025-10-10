import useImage from 'use-image';
import { twMerge } from 'tailwind-merge';
import ReactDOMServer from 'react-dom/server';

import { Image } from 'react-konva';
import { useMemo, type JSX } from 'react';

import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function LocalImage({ src, width, height, ...props }: LocalImageProps) {
	const [image] = useImage(src);

	const dimensions = useMemo(() => {
		if (src.includes('chat')) console.log(image);
		if (!image) return { width: 0, height: 0 };

		const ratio = image.height / image.width;

		if (width && !height) {
			return { width, height: width * ratio };
		}
		if (height && !width) {
			return { width: height / ratio, height };
		}
		if (width && height) {
			return { width, height };
		}

		// fallback: dimensioni naturali
		return { width: image.width, height: image.height };
	}, [image, width, height]);

	return <Image image={image} {...props} {...dimensions} />;
}

export function SvgIconImage({
	Icon,
	...props
}: Partial<Parameters<typeof Image>[0]> & { Icon: JSX.Element }) {
	// Genero l'SVG come stringa
	const svgString = encodeURIComponent(ReactDOMServer.renderToStaticMarkup(Icon));

	// Lo passo come data URI
	const [image] = useImage(`data:image/svg+xml;utf8,${svgString}`);

	return <Image image={image} {...props} />;
}

export type LocalImageProps = {
	src: string;
	width?: number;
	height?: number;
} & Partial<Parameters<typeof Image>[0]>;
