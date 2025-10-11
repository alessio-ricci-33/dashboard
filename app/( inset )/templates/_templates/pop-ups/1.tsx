import { Circle, Group, Layer, Rect, Stage, Text } from "react-konva";
import { LocalImage, SvgIconImage } from "@/utils/local-image";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Separator } from "@/ui/separator";
import DownloadableCanvas from "@/components/downloadable-canvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

import { ImArrowUpRight2 } from "react-icons/im";

import { params as IslandParams } from "./2";
import { useGlobalContext } from "@/hooks/global-context";
import { cn } from "@/utils/shadcn";

import { useSpring as $, animated } from "@react-spring/konva";
import { useFrameCapture } from "@/hooks/use-frame-capture";
import { ParamsToProps } from "@/types/utils";

export const params = {
	brandName: {
		type: String,
		label: "Brand name",
		default: "msgi.it",
		props: {
			className: "col-span-5",
		},
		inputProps: {
			className: "text-start",
		},
	},
	cta: {
		type: String,
		label: "CTA",
		default: "Vai su 📲msgi.it",
		props: {
			className: "col-span-7",
		},
		inputProps: {
			className: "text-start",
		},
	},
	height: {
		type: Number,
		label: "Height",
		default: 120,
		props: {
			className: "col-span-2",
		},
		inputProps: {
			step: 2.5,
		},
	},
	width: {
		type: Number,
		label: "Width",
		default: 350,
		props: {
			className: "col-span-2",
		},
		inputProps: {
			step: 5,
		},
	},

	message: {
		type: String,
		label: "Popup message",
		default: "Your message...",
		props: {
			className: "col-span-12",
		},
		inputProps: {
			className: "text-start",
		},
	},
} as const;

export const dynamicParams = {
	...params,
	opacityFrom: {
		type: Number,
		label: "Opacity",
		default: 0,
		props: {
			className: "col-span-2",
		},
		inputProps: {
			className: " px-1.5 py-0.5",
			step: 0.05,
		},
	},
	opacityTo: {
		type: Number,
		label: "",
		default: 1,
		props: {
			className: "col-span-2",
		},
		inputProps: {
			className: "px-1.5 py-0.5",
			step: 0.05,
		},
	},
	offsetY: {
		type: Number,
		label: "Y Offsets",
		default: 70,
		props: {
			className: "col-span-3",
		},
		inputProps: {
			step: 2.5,
		},
	},

	fadeIn: {
		type: Number,
		label: "Fade in",
		default: 0.3,
		props: {
			className: "col-span-3",
		},
		inputProps: {
			step: 0.1,
		},
	},
	freeze: {
		type: Number,
		label: "Freeze",
		default: 3,
		props: {
			className: "col-span-3",
		},
		inputProps: {
			step: 0.1,
		},
	},
	fadeOut: {
		type: Number,
		label: "Fade out",
		default: 0.1,
		props: {
			className: "col-span-3",
		},
		inputProps: {
			step: 0.1,
		},
	},
} as const;

export const defaultProps: Props = Object.entries(params).reduce(
	(acc, [key, { default: defaultValue }]) => ({ ...acc, [key]: defaultValue }),
	{}
);

export const defaultDynamicProps: DynamicProps = Object.entries(dynamicParams).reduce(
	(acc, [key, { default: defaultValue }]) => ({ ...acc, [key]: defaultValue }),
	{}
);

const PADDING = 14,
	MARGIN = 21;

export const Image = (props = defaultProps as Props & { download?: boolean; onDownload?: () => void }) => {
	const { height, width, brandName, message, cta } = { ...defaultProps, ...props };

	return (
		<DownloadableCanvas
			fileType="png"
			filename="expanded-popup"
			download={props.download}
			onDownload={props.onDownload}
			width={width + MARGIN * 2}
			height={height + MARGIN * 2}
			options={{ preserveDrawingBuffer: true }}
			style={{ backgroundColor: "transparent", overflow: "visible" }}
		>
			<Layer>
				<Rect
					x={MARGIN}
					y={MARGIN - 0.5}
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
					x={MARGIN}
					y={MARGIN}
					width={width}
					height={height}
					fillLinearGradientStartPoint={{ x: 0.8, y: -10 }}
					fillLinearGradientEndPoint={{ x: -0.8, y: height }}
					fillLinearGradientColorStops={[0, "#2f2f32", 0.85, "#000000"]}
					cornerRadius={35}
					stroke="#2f2f32" // colore del bordo
					strokeWidth={0.5}
					shadowBlur={6}
					shadowColor="#000000"
					shadowOpacity={1}
					shadowOffsetY={-0.5}
				/>
				<Group
					x={MARGIN + PADDING}
					y={MARGIN + PADDING}
					width={width - MARGIN - PADDING}
					height={height - MARGIN - PADDING}
				>
					<Group x={0} y={-3}>
						{/* Immagine locale sopra il rettangolo */}
						<LocalImage
							src="/messaggi-italia.png" // immagine salvata in public/images/logo.png
							height={IslandParams.height.default - PADDING}
							shadowColor="#15171c"
							shadowBlur={7}
						/>

						<Text
							x={IslandParams.height.default - PADDING + 8}
							y={PADDING / 2}
							text={brandName}
							lineHeight={1.1}
							fontSize={21}
							fontFamily="logo" // deve corrispondere al nome definito in @font-face
							fill="white"
							opacity={0.75}
						/>
					</Group>

					<Group y={height - IslandParams.height.default - PADDING} x={3}>
						<Text
							text={cta}
							fontSize={16}
							lineHeight={1}
							fontFamily="secondary" // deve corrispondere al nome definito in @font-face
							fill="#ffffff"
							shadowColor="#ffffff"
							shadowBlur={4}
							shadowOffsetY={3}
							shadowOpacity={0.25}
							opacity={0.85}
						/>

						<Text
							y={PADDING / 2 + 16}
							text={message}
							lineHeight={1}
							fontSize={18}
							fontFamily="secondary" // deve corrispondere al nome definito in @font-face
							fill="#ffffff"
							shadowColor="#ffffff"
							shadowBlur={4}
							shadowOffsetY={3}
							shadowOpacity={0.25}
						/>
					</Group>

					<Group
						x={width - PADDING * 2 - (IslandParams.height.default - PADDING - 4) / 2}
						y={(IslandParams.height.default - PADDING - 4) / 2 - 1}
					>
						<Circle
							radius={999}
							fill="#15171c"
							shadowBlur={7}
							shadowColor="#ffffff"
							shadowOpacity={0.4}
							height={IslandParams.height.default - PADDING - 4}
							width={IslandParams.height.default - PADDING - 4}
						/>
						<SvgIconImage
							Icon={<ImArrowUpRight2 size={21} color="white" opacity={0.55} />}
							height={21}
							x={-(IslandParams.height.default - PADDING - 4) / 2 + 9}
							y={-(IslandParams.height.default - PADDING - 4) / 2 + 9}
						/>
					</Group>
				</Group>
			</Layer>
		</DownloadableCanvas>
	);
};

export const Video = (props = defaultProps as Props & { download?: boolean; onDownload?: () => void }) => {
	const { height, width, brandName, message, cta } = { ...defaultProps, ...props };

	const stageRef = useRef<any>(null),
		[isRecording, setIsRecording] = useState(props.record ?? false);

	const [toFadeIn, setToFadeIn] = useState(false),
		[toFadeOut, setToFadeOut] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setToFadeIn(true);
		}, 350);
	}, [props]);

	useFrameCapture(stageRef, isRecording, {
		format: "uri",
		targetFps: 60,
		onComplete: async (frames, fps) => {
			try {
				const response = await fetch("https://server.msgi.it/render-video", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					// Invia l'array di frame e gli FPS calcolati
					body: JSON.stringify({
						frames,
						fps,
					}),
				});

				if (!response.ok) {
					throw new Error(`Errore HTTP: ${response.status}`);
				}

				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = "popup.mov";
				document.body.appendChild(a);
				a.click();
				a.remove();
				window.URL.revokeObjectURL(url);

				console.log("Video scaricato con successo!");
			} catch (error) {
				console.error("Errore durante l'invio dei frame o il download del video:", error);
				alert("Si è verificato un errore durante la creazione del video. Controlla la console.");
			} finally {
				console.log("Upload completato");
				if (props.onStopRecording) props.onStopRecording();
			}
		},
	});

	const animation = {
		fadeIn: props.fadeIn * 1000,
		fadeOut: props.fadeOut * 1000,
		freeze: props.freeze * 1000,
		offsetY: props.offsetY,
		opacityFrom: props.opacityFrom,
		opacityTo: props.opacityTo,
	};

	return (
		<Stage
			ref={stageRef}
			style={{ backgroundColor: "transparent" }}
			options={{ preserveDrawingBuffer: true }}
			height={height + MARGIN * 2 + props.offsetY}
			width={width + MARGIN * 2}
		>
			{/* @ts-ignore */}
			<animated.Layer
				key={JSON.stringify(props)}
				{...$({
					from: { opacity: props.opacityFrom, y: 0 },
					to: {
						opacity: toFadeIn ? props.opacityTo : props.opacityFrom,
						y: toFadeIn ? props.offsetY : 0,
					},
					config: {
						tension: isRecording ? 280 : 170,
						friction: isRecording ? 22 : 26,
						precision: 0.00001,
						duration: toFadeIn ? animation.fadeIn : animation.fadeOut,
					},

					onResolve: async () => {
						if (toFadeIn) {
							await new Promise((r) => setTimeout(r, animation.freeze));
							setToFadeOut(true);
							return setToFadeIn(false);
						}

						if (!toFadeIn && toFadeOut) {
							await new Promise((r) => setTimeout(r, animation.fadeOut + 500));

							setIsRecording(false);
							console.log("STOP RECORDING");
						}
					},
				})}
			>
				<Rect
					x={MARGIN}
					y={MARGIN - 0.5}
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
					x={MARGIN}
					y={MARGIN}
					width={width}
					height={height}
					fillLinearGradientStartPoint={{ x: 0.8, y: -10 }}
					fillLinearGradientEndPoint={{ x: -0.8, y: height }}
					fillLinearGradientColorStops={[0, "#2f2f32", 0.85, "#000000"]}
					cornerRadius={35}
					stroke="#2f2f32" // colore del bordo
					strokeWidth={0.5}
					shadowBlur={6}
					shadowColor="#000000"
					shadowOpacity={1}
					shadowOffsetY={-0.5}
				/>
				<Group
					x={MARGIN + PADDING}
					y={MARGIN + PADDING}
					width={width - MARGIN - PADDING}
					height={height - MARGIN - PADDING}
				>
					<Group x={0} y={-3}>
						{/* Immagine locale sopra il rettangolo */}
						<LocalImage
							src="/messaggi-italia.png" // immagine salvata in public/images/logo.png
							height={IslandParams.height.default - PADDING}
							shadowColor="#15171c"
							shadowBlur={7}
						/>

						<Text
							x={IslandParams.height.default - PADDING + 8}
							y={PADDING / 2}
							text={brandName}
							lineHeight={1.1}
							fontSize={21}
							fontFamily="logo" // deve corrispondere al nome definito in @font-face
							fill="white"
							opacity={0.75}
						/>
					</Group>

					<Group y={height - IslandParams.height.default - PADDING} x={3}>
						<Text
							text={cta}
							fontSize={16}
							lineHeight={1}
							fontFamily="secondary" // deve corrispondere al nome definito in @font-face
							fill="#ffffff"
							shadowColor="#ffffff"
							shadowBlur={4}
							shadowOffsetY={3}
							shadowOpacity={0.25}
							opacity={0.85}
						/>

						<Text
							y={PADDING / 2 + 16}
							text={message}
							lineHeight={1}
							fontSize={18}
							fontFamily="secondary" // deve corrispondere al nome definito in @font-face
							fill="#ffffff"
							shadowColor="#ffffff"
							shadowBlur={4}
							shadowOffsetY={3}
							shadowOpacity={0.25}
						/>
					</Group>

					<Group
						x={width - PADDING * 2 - (IslandParams.height.default - PADDING - 4) / 2}
						y={(IslandParams.height.default - PADDING - 4) / 2 - 1}
					>
						<Circle
							radius={999}
							fill="#15171c"
							shadowBlur={7}
							shadowColor="#ffffff"
							shadowOpacity={0.4}
							height={IslandParams.height.default - PADDING - 4}
							width={IslandParams.height.default - PADDING - 4}
						/>
						<SvgIconImage
							Icon={<ImArrowUpRight2 size={21} color="white" opacity={0.55} />}
							height={21}
							x={-(IslandParams.height.default - PADDING - 4) / 2 + 9}
							y={-(IslandParams.height.default - PADDING - 4) / 2 + 9}
						/>
					</Group>
				</Group>
			</animated.Layer>
		</Stage>
	);
};

export const component = () => {
	const [tab, setTab] = useState("image"),
		[dialogOpen, setDialogOpen] = useState(false),
		[toDownload, setToDownload] = useState(false),
		{ isRecording, setIsRecording } = useGlobalContext();

	const [props, setProps] = useState(tab === "image" ? defaultProps : defaultDynamicProps);

	useEffect(() => setProps(tab === "image" ? defaultProps : defaultDynamicProps), [tab]);

	return (
		<Dialog
			onOpenChange={(open) => {
				setDialogOpen(open);
				if (!open) setToDownload(false);
			}}
		>
			<DialogTrigger key={"dialog-trigger"}>
				<Image download={false} {...defaultProps} />
			</DialogTrigger>
			<DialogContent
				key={"dialog-content"}
				className="flex flex-row items-center gap-p p-p border border-zinc-600/50 !max-w-none w-max shadow-[0_0_7px_-1px_#b0e9ff4a]"
			>
				<Tabs
					onValueChange={(tabValue) => setTab(tabValue)}
					defaultValue={tab}
					className="shrink flex flex-col w-full items-center justify-start"
				>
					<TabsList className="mx-auto">
						<TabsTrigger value="image">Image</TabsTrigger>
						<TabsTrigger value="video">Video</TabsTrigger>
					</TabsList>
					<TabsContent value="image">
						<div className="grid grid-cols-[repeat(16,1.17rem)] auto-rows-fr gap-p w-full">
							{Object.entries(params).map(
								(
									[
										key,
										{
											label,
											default: defaultValue,
											props: { className, ...paramsProps } = {},
										},
									],
									index
								) => (
									<span
										key={index + key}
										className={cn(
											"flex flex-col gap-1 text-sm",
											className
										)}
										{...paramsProps}
									>
										{label}
										<Input
											type={
												typeof defaultValue === "number"
													? "number"
													: "text"
											}
											className="w-full"
											onChange={(e) => {
												if (
													!e.target.value?.trim()
														.length
												)
													return;
												setProps({
													...props,
													[key]:
														typeof defaultValue ===
														"number"
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
								className="relative cursor-pointer col-span-4 -col-end-1 h-9 mt-auto self-end"
								variant="outline"
								size="sm"
								onClick={() => setToDownload(true)}
							>
								Download
							</Button>
						</div>
					</TabsContent>

					<TabsContent value="video">
						<div className="grid grid-cols-[repeat(16,1.17rem)] auto-rows-fr gap-p w-full">
							{Object.entries(dynamicParams).map(
								(
									[
										key,
										{
											label,
											default: defaultValue,
											props: { className, ...paramsProps },
											inputProps: {
												className: inputClassName,
												...inputProps
											} = {},
										},
									],
									index
								) => (
									<span
										key={index + key}
										className={cn(
											"flex flex-col justify-between gap-1 text-sm",
											className
										)}
										{...paramsProps}
									>
										{label}
										<Input
											type={
												typeof defaultValue === "number"
													? "number"
													: "text"
											}
											className={cn(
												"w-full self-end justify-self-end mt-auto",
												inputClassName
											)}
											onChange={(e) => {
												if (
													!e.target.value?.trim()
														.length
												)
													return;
												setProps({
													...props,
													[key]:
														typeof defaultValue ===
														"number"
															? parseFloat(
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
											{...inputProps}
										/>
									</span>
								)
							)}

							<Button
								className="relative cursor-pointer col-span-4 h-9 mt-auto self-end"
								variant="outline"
								size="sm"
								onClick={() => setIsRecording((prev) => !prev)}
							>
								{isRecording && (
									<>
										<span className="z-20 absolute top-0 right-0 translate-x-1 -translate-y-1 bg-red-500/75 rounded-full size-3 scale-65" />
										<span className="z-30 absolute top-0 right-0 translate-x-1 -translate-y-1 bg-red-500/85 rounded-full size-3 animate-pulse duration-800 [animation-timing-function:cubic-bezier(0.4,0,.2,.4,1)]" />
									</>
								)}
								{`${isRecording ? "Stop" : "Record"}`}
							</Button>
						</div>
					</TabsContent>
				</Tabs>
				<Separator
					orientation="vertical"
					className="![background-color:transparent] bg-radial-[at_center] from-white to-87% to-transparent !h-[-webkit-fill-available]"
				/>
				<div className="contents">
					{tab === "image" ? (
						<Image download={toDownload} onDownload={() => setToDownload(false)} {...props} />
					) : (
						<Video
							// @ts-ignore
							key={`video-${isRecording}-${JSON.stringify(props, null, 2)}`}
							record={isRecording}
							onStopRecording={() => setIsRecording(false)}
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
export type DynamicProps = Props & Partial<ParamsToProps<typeof dynamicParams>>;
