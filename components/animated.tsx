import { useSpring, animated } from '@react-spring/konva';
import { LocalImage, type LocalImageProps } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

export const AnimatedLocalImage = ({
	src,
	x,
	y,

	trigger,
	onRest,
	children,
	...props
}: {
	src: string;
	x: number;
	y: number;
	trigger: boolean;
	onRest?: () => void;
} & LocalImageProps) => {
	const styles = useSpring({
		from: { opacity: 0, scale: 1.3 },
		to: trigger ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.3 },
		config: { tension: 200, friction: 20, duration: 500 },
		onRest,
	});

	return (
		// @ts-ignore
		<animated.Group x={x} y={y} {...styles}>
			<LocalImage src={src} {...props} />
		</animated.Group>
	);
};

type AnimatedAnswerGroupProps = {
	width: number;
	height: number;
	y: number;
	trigger: boolean;
};

export const AnimatedAnswerGroup = ({
	width,
	height,
	y,
	trigger,
	children,
	...rest
}: AnimatedAnswerGroupProps &
	PropsWithChildren &
	Partial<Parameters<typeof animated.Group>[0]>) => {
	const props = useSpring({
		from: { opacity: 0, clipWidth: 0, y: y + 50, x: 10 },
		to: {
			opacity: trigger ? 1 : 0,
			clipWidth: trigger ? width : 0,
			y: trigger ? y : y + 50,
			x: 10,
		},
		config: { tension: 200, friction: 20, duration: 350 },
	});

	return (
		<animated.Group y={props.y as any} opacity={props.opacity as any} {...rest}>
			{children}
		</animated.Group>
	);
};
