import { Circle, Group, Layer, Rect, Stage, Text } from 'react-konva';
import { LocalImage, SvgIconImage } from '@/utils/local-image';
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Separator } from '@/ui/separator';
import DownloadableCanvas from '@/components/downloadable-canvas';
import { ParamsToProps } from '@/types/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { ImArrowUpRight2 } from 'react-icons/im';
import { cn } from '@/utils/shadcn';
import { useFrameCapture } from '@/hooks/use-frame-capture';

import { useSpring as $, animated } from '@react-spring/konva';

export const params = {
	brandName: {
		type: String,
		label: 'Brand name',
		default: 'msgi.it',
		props: {
			className: 'col-span-4',
		},
	},
	height: {
		type: Number,
		label: 'Height',
		default: 57,
		props: {
			className: 'col-span-4',
		},
	},
	width: {
		type: Number,
		label: 'Width',
		default: 360,
		props: {
			className: 'col-span-4',
		},
	},

	message: {
		type: String,
		label: 'Messaggio del popup',
		default: 'Testo desiderato...',
		props: {
			className: 'col-span-8',
		},
	},
} as const;

export const defaultProps: Props = Object.entries(params).reduce(
	(acc, [key, { default: defaultValue }]) => ({ ...acc, [key]: defaultValue }),
	{}
);

const PADDING = 20;

export const Image = (
	props = defaultProps as Props & { download?: boolean; onDownload?: () => void }
) => {
	const localProps = Object.entries(params).reduce((acc, [key, { default: defaultValue }]) => {
		if (props[key]) acc[key] = props[key];
		else acc[key] = defaultValue;

		return acc;
	}, {} as Props);

	const { height, width, brandName, message } = { ...localProps, ...props };

	return (
		<DownloadableCanvas
			filename="popup-island"
			download={props.download}
			onDownload={props.onDownload}
			width={width + PADDING * 2}
			height={height + PADDING * 2}
			options={{ preserveDrawingBuffer: true }}
			style={{ backgroundColor: 'transparent', overflow: 'visible' }}>
			<Layer>
				<Rect
					x={PADDING}
					y={PADDING - 0.5}
					width={width}
					height={height}
					fill="#000000"
					cornerRadius={35}
					stroke="#000000" // colore del bordo
					strokeWidth={0.5}
					shadowBlur={16}
					shadowColor="#ffffff"
					shadowOpacity={0.4}
					shadowOffsetY={0.5}
				/>

				<Rect
					x={PADDING}
					y={PADDING}
					width={width}
					height={height}
					fillLinearGradientStartPoint={{ x: 0.8, y: -10 }}
					fillLinearGradientEndPoint={{ x: -0.8, y: height }}
					fillLinearGradientColorStops={[0, '#2f2f32', 0.85, '#000000']}
					stroke="#2f2f32" // colore del bordo
					strokeWidth={1}
					cornerRadius={35}
					shadowBlur={6}
					shadowColor="#000000"
					shadowOpacity={1}
					shadowOffsetY={-0.5}
				/>

				<Group x={PADDING + 12} y={PADDING + 10}>
					{/* Immagine locale sopra il rettangolo */}
					<LocalImage
						x={-1}
						y={-1}
						src="/messaggi-italia.png" // immagine salvata in public/images/logo.png
						height={height - PADDING + 2}
						shadowColor="#15171c"
						shadowBlur={7}
					/>

					<Group x={height - PADDING + 8}>
						<Text
							y={-2}
							fontSize={19}
							lineHeight={1}
							text={brandName}
							fontFamily="logo" // deve corrispondere al nome definito in @font-face
							fill="white"
							opacity={0.75}
						/>
						<Text
							y={PADDING}
							fontSize={17}
							lineHeight={1}
							text={message}
							fontFamily="secondary" // deve corrispondere al nome definito in @font-face
							fill="white"
						/>
					</Group>

					<Group x={width - PADDING * 2 - 2} y={(height - PADDING) / 2 - 0.5}>
						<Circle
							radius={999}
							fill="#15171c"
							shadowBlur={7}
							shadowColor="#ffffff"
							shadowOpacity={0.4}
							height={height - PADDING + 2}
							width={height - PADDING + 2}
						/>
						<SvgIconImage
							Icon={
								<ImArrowUpRight2
									size={21}
									color="white"
									opacity={0.55}
								/>
							}
							height={21}
							x={-height / 2 + PADDING - 2}
							y={-PADDING / 2}
						/>
					</Group>
				</Group>
			</Layer>
		</DownloadableCanvas>
	);
};

export const Video = (
	props = defaultProps as Props & { recording?: boolean; onStopRecording?: () => void }
) => {
	const stageRef = useRef<any>(null),
		[isRecording, setIsRecording] = useState(props.recording ?? false);

	const [toFadeIn, setToFadeIn] = useState(true);
	const [showAnswer, setShowAnswer] = useState(false);

	useEffect(() => {
		setIsRecording(props.recording ?? false);
	}, [props.recording]);

	useEffect(() => {
		let timer: NodeJS.Timeout; // image dopo typing
		setTimeout(() => {
			setTimeout(async () => {
				setShowAnswer(true);
				await new Promise(r => setTimeout(r, 7000));
				setIsRecording(false);
			}, 1000);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	useFrameCapture(stageRef, isRecording, {
		format: 'blob',
		onComplete: async (frames, fps) => {
			// const formData = new FormData();
			// formData.append('fps', fps.toString());
			// formData.append('assetName', 'popup-island');
			// frames.forEach((frame, i) => {
			// 	formData.append(`frames`, frame as Blob);
			// });
			// const response = await fetch('/api/upload-frames', {
			// 	method: 'POST',
			// 	body: formData,
			// });
			// if (!response.ok) {
			// 	console.error('Errore upload frame');
			// 	return;
			// }
			// console.log('Upload completato');
		},
	});

	const localProps = Object.entries(params).reduce((acc, [key, { default: defaultValue }]) => {
		if (props[key]) acc[key] = props[key];
		else acc[key] = defaultValue;

		return acc;
	}, {} as Props);

	const { height, width, brandName, message } = { ...localProps, ...props };

	return (
		<Stage
			ref={stageRef}
			style={{ backgroundColor: 'transparent' }}
			options={{ preserveDrawingBuffer: true }}
			height={height + PADDING * 2 + 120}
			width={width + PADDING * 2}>
			{/* @ts-ignore */}
			<animated.Layer
				{...$({
					from: { opacity: 0, y: 0 },
					to: { opacity: toFadeIn ? 1 : 0, y: toFadeIn ? 120 : 0 },
					config: { tension: 200, friction: 20, duration: 1250 },
				})}>
				<Rect
					x={PADDING + 0.5}
					y={PADDING + 0.5}
					width={width - 1}
					height={height - 1}
					fill="transparent"
					shadowBlur={2}
					cornerRadius={35}
					shadowColor="#000000"
					shadowOpacity={1}
					shadowOffsetY={2}
				/>
				<Rect
					x={PADDING}
					y={PADDING}
					width={width}
					height={height}
					fillLinearGradientStartPoint={{ x: 0, y: 0 }}
					fillLinearGradientEndPoint={{ x: 0, y: height }}
					fillLinearGradientColorStops={[0, '#2f2f32', 0.85, '#000000']}
					shadowBlur={16}
					cornerRadius={35}
					shadowColor="#ffffff"
					shadowOpacity={0.4}
					stroke="#2f2f32" // colore del bordo
					strokeWidth={0.5}
				/>

				<Group x={PADDING + 12} y={PADDING + 10}>
					{/* Immagine locale sopra il rettangolo */}
					<LocalImage
						x={-1}
						y={-1}
						src="/messaggi-italia.png" // immagine salvata in public/images/logo.png
						height={height - PADDING + 2}
						shadowColor="#15171c"
						shadowBlur={7}
					/>

					<Group x={height - PADDING + 8} y={height / 2 - 30}>
						<Text
							y={-2}
							fontSize={19}
							lineHeight={1}
							text={brandName}
							fontFamily="logo" // deve corrispondere al nome definito in @font-face
							fill="white"
							opacity={0.75}
						/>
						<Text
							y={PADDING}
							fontSize={17}
							lineHeight={1}
							text={message}
							fontFamily="secondary" // deve corrispondere al nome definito in @font-face
							fill="white"
						/>
					</Group>

					<Group
						x={width - PADDING * 2 - 2}
						y={(height - PADDING) / 2 - 0.5}
						width={height - PADDING + 2}
						height={height - PADDING + 2}>
						<Circle
							radius={999}
							fill="#15171c"
							shadowBlur={7}
							shadowColor="#ffffff"
							shadowOpacity={0.4}
							height={height - PADDING + 2}
							width={height - PADDING + 2}
						/>
						<SvgIconImage
							Icon={
								<ImArrowUpRight2
									size={21}
									color="white"
									opacity={0.55}
								/>
							}
							height={21}
							x={-10.5}
							y={-PADDING / 2}
						/>
					</Group>
				</Group>
			</animated.Layer>
		</Stage>
	);
};

export const component = (oldProps: Props = defaultProps) => {
	const [props, setProps] = useState(oldProps);
	const [tab, setTab] = useState('image'),
		[dialogOpen, setDialogOpen] = useState(false),
		[toDownload, setToDownload] = useState(false),
		[toRecord, setToRecord] = useState(false);

	return (
		<Dialog
			onOpenChange={open => {
				setDialogOpen(open);
				if (!open) setToDownload(false);
			}}>
			<DialogTrigger key={'dialog-trigger'}>
				<Image download={false} {...oldProps} />
			</DialogTrigger>
			<DialogContent
				key={'dialog-content'}
				className="flex flex-row items-center gap-p p-p border border-zinc-600/50 !max-w-none w-fit shadow-[0_0_7px_-1px_#b0e9ff4a]">
				<Tabs
					onValueChange={tabValue => setTab(tabValue)}
					defaultValue={tab}
					className="flex flex-col w-full items-center justify-start">
					<TabsList className="mx-auto">
						<TabsTrigger value="image">Image</TabsTrigger>
						<TabsTrigger value="video">Video</TabsTrigger>
					</TabsList>
					<TabsContent value="image">
						<div className="grid grid-cols-12 auto-rows-fr gap-p w-full">
							{Object.entries(params).map(
								(
									[
										key,
										{
											label,
											default: defaultValue,
											props: {
												className,
												...paramsProps
											},
										},
									],
									index
								) => (
									<span
										key={index + key}
										className={cn(
											'flex flex-col gap-1 text-sm',
											className
										)}
										{...paramsProps}>
										{label}
										<Input
											type={
												typeof defaultValue ===
												'number'
													? 'number'
													: 'text'
											}
											className="w-full"
											onChange={e => {
												if (
													!e.target.value?.trim()
														.length
												)
													return;
												setProps({
													...props,
													[key]:
														typeof defaultValue ===
														'number'
															? parseInt(
																	e
																		.target
																		.value
															  )
															: e.target
																	.value,
												});
											}}
											defaultValue={
												props[label] ?? defaultValue
											}
										/>
									</span>
								)
							)}

							<Button
								className="cursor-pointer col-span-4 h-9 mt-auto self-end"
								variant="outline"
								size="sm"
								onClick={() => setToDownload(true)}>
								Download
							</Button>
						</div>
					</TabsContent>
					<TabsContent value="video">
						<div className="grid grid-cols-12 auto-rows-fr gap-p w-full">
							{Object.entries(params).map(
								(
									[
										key,
										{
											label,
											default: defaultValue,
											props: {
												className,
												...paramsProps
											},
										},
									],
									index
								) => (
									<span
										key={index + key}
										className={cn(
											'flex flex-col gap-1 text-sm',
											className
										)}
										{...paramsProps}>
										{label}
										<Input
											type={
												typeof defaultValue ===
												'number'
													? 'number'
													: 'text'
											}
											className="w-full"
											onChange={e => {
												if (
													!e.target.value?.trim()
														.length
												)
													return;
												setProps({
													...props,
													[key]:
														typeof defaultValue ===
														'number'
															? parseInt(
																	e
																		.target
																		.value
															  )
															: e.target
																	.value,
												});
											}}
											defaultValue={
												props[label] ?? defaultValue
											}
										/>
									</span>
								)
							)}

							<Button
								className="relative cursor-pointer col-span-4 h-9 mt-auto self-end"
								variant="outline"
								size="sm"
								onClick={() => setToRecord(prev => !prev)}>
								{toRecord && (
									<>
										<span className="z-20 absolute top-0 right-0 translate-x-1 -translate-y-1 bg-red-500/75 rounded-full size-3 scale-65" />
										<span className="z-30 absolute top-0 right-0 translate-x-1 -translate-y-1 bg-red-500/85 rounded-full size-3 animate-pulse duration-800 [animation-timing-function:cubic-bezier(0.4,0,.2,.4,1)]" />
									</>
								)}
								{`${toRecord ? 'Stop' : 'Record'}`}
							</Button>
						</div>
					</TabsContent>
				</Tabs>

				<Separator
					orientation="vertical"
					className="![background-color:transparent] bg-radial-[at_center] from-white to-transparent !h-[-webkit-fill-available]"
				/>
				<div className="contents">
					{tab === 'image' ? (
						<Image
							download={toDownload}
							onDownload={() => setToDownload(false)}
							{...props}
						/>
					) : (
						<Video
							key={toRecord ? 'video-recording' : 'video-stopped'}
							recording={toRecord}
							{...props}
						/>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default {
	component,
	params,
};

export type Props = Partial<ParamsToProps<typeof params>>;
