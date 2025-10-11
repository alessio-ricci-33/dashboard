import { TbMenu2 } from "react-icons/tb";
import { IoDocuments } from "react-icons/io5";
import { GoPencil } from "react-icons/go";
import { Layer, Rect, Text, Circle, Group, Stage } from "react-konva";
import { BiSearchAlt } from "react-icons/bi";

import { HiArrowLeft } from "react-icons/hi2";
import { ParamsToProps } from "@/types/utils";
import DownloadableCanvas from "@/components/downloadable-canvas";
import { LocalImage, SvgIconImage } from "@/utils/local-image";

import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { useEffect, useRef, useState } from "react";
import { Separator } from "@/ui/separator";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { cn } from "@/utils/shadcn";
import { useGlobalContext } from "@/hooks/global-context";
import { ImageLoader } from "@/components/imageLoader";
import { useSpring as $, animated } from "@react-spring/konva";
import { AnimatedAnswerGroup, AnimatedLocalImage } from "@/components/animated";
import { useFrameCapture } from "@/hooks/use-frame-capture";

export const params = {
	margin: {
		type: Number,
		label: "Margin",
		default: 20,
		props: {
			className: "col-span-3",
		},
	},
	padding: {
		type: Number,
		label: "Padding",
		default: 20,
		props: {
			className: "col-span-3",
		},
	},
	height: {
		type: Number,
		label: "Height",
		default: 500,
		props: {
			className: "col-span-3",
		},
	},
	width: {
		type: Number,
		label: "Width",
		default: 300,
		props: {
			className: "col-span-3",
		},
	},
	answer: {
		type: String,
		label: "Answer",
		default: "Ho sempre pensato che saremmo stati destinati a stare insieme ❤",
		props: {
			className: "col-span-full w-full",
		},
		inputProps: {
			className: "text-start",
		},
	},

	placeholder: {
		type: String,
		label: "Search bar",
		default: "Scrivi i tuoi interessi ...",
		props: {
			className: "col-span-6 w-full",
		},
		inputProps: {
			className: "text-start",
		},
	},

	slogan: {
		type: String,
		label: "Slogan",
		default: "Fatti capire meglio!",
		props: {
			className: "col-span-6 w-full",
		},
		inputProps: {
			className: "text-start",
		},
	},
	chatSnapshot: {
		type: "image",
		label: "Chat snapshot",
		default: null,
		props: {
			className: "col-span-8 row-span-3 w-full",
		},
		inputProps: {
			className: "size-full text-start self-start m-none",
		},
	},
};

export const dynamicParams = {
	...params,
	fadeIn: {
		type: Number,
		label: "Fad in",
		default: 0.4,
		props: {
			className: "col-span-4 -col-end-1",
		},
		inputProps: {
			step: 0.1,
		},
	},
	freeze: {
		type: Number,
		label: "Freeze",
		default: 3.5,
		props: {
			className: "col-span-4 -col-end-1",
		},
		inputProps: {
			step: 0.1,
		},
	},
	fadeOut: {
		type: Number,
		label: "Fad out",
		default: 0.175,
		props: {
			className: "col-span-4 -col-end-1",
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

export const Image = (props = defaultProps as Props & { download?: boolean; onDownload?: () => void }) => {
	const { height, width, padding, placeholder, answer, slogan } = Object.entries(params).reduce(
		(acc, [key, { default: defaultValue }]) => {
			if (!props[key]) acc[key] = defaultValue;

			return acc;
		},
		{ ...props } as Props
	);

	return (
		<DownloadableCanvas
			filename="wingai-mockup"
			download={props.download}
			onDownload={props.onDownload}
			height={height + padding * 2}
			width={width + padding * 2}
		>
			<Layer>
				<Group x={padding} y={padding}>
					<Rect
						width={width}
						height={height}
						fill="white"
						cornerRadius={12}
						shadowBlur={12}
						shadowColor="#000000"
					/>
					<Group width={width} height={height * 0.18} y={0} x={0}>
						<SvgIconImage
							Icon={<HiArrowLeft size={18} color="#000" />}
							width={18}
							x={8}
							y={38}
						/>
						<LocalImage
							src="/templates/wingai/logo.webp"
							width={105}
							x={width / 2 - 52.5}
							y={30}
							shadowBlur={5}
							shadowColor="#000000"
							shadowOpacity={0.3}
							shadowOffset={{ x: -2, y: 2 }}
						/>
						<SvgIconImage
							Icon={<TbMenu2 size={24} color="#f27365" />}
							width={24}
							x={width - 33}
							y={37.5}
						/>
					</Group>

					<Group
						y={height * 0.18}
						clipFunc={(ctx) => {
							ctx.beginPath();
							ctx.roundRect(0, 0, width, height * 0.82, 12);
							ctx.closePath();
						}}
					>
						<Group
							y={0}
							height={height * 0.6}
							clipFunc={(ctx) => {
								ctx.beginPath();
								ctx.roundRect(0, 0, width, height * 0.6, 0);
								ctx.closePath();
							}}
						>
							<Circle
								width={height * 4}
								height={height * 4}
								x={width / 2}
								y={height * 3}
								radius={height * 3}
								fillRadialGradientStartRadius={height * 3}
								fillRadialGradientEndRadius={height}
								fillRadialGradientStartPoint={{ x: 0, y: 0 }}
								fillRadialGradientEndPoint={{ x: 0, y: 0 }}
								fillRadialGradientColorStops={[0, "#ffba9f", 0.23, "#f6acc1"]}
							/>
							<Circle
								width={height * 4}
								height={height * 4}
								x={width / 2}
								y={height * 3}
								radius={height * 3}
								fillRadialGradientStartRadius={height * 3}
								fillRadialGradientEndRadius={0}
								fillRadialGradientStartPoint={{ x: 0, y: 0 }}
								fillRadialGradientEndPoint={{ x: 0, y: 0 }}
								fillRadialGradientColorStops={[
									0,
									"rgba(0,0,0,0.07)",
									0.007,
									"transparent",
								]}
							/>
							{/* Search bar */}

							<Group x={10} y={height * 0.6 - 90}>
								<Rect
									width={width - 20}
									height={38}
									fill="#ffffff"
									cornerRadius={20}
									shadowBlur={10}
									shadowColor="#000000"
									shadowOpacity={0.2}
								/>

								<SvgIconImage
									Icon={<BiSearchAlt size={20} color="#ff6a6a" />}
									src="/templates/wingai/search_bar.png"
									height={20}
									x={13}
									y={9}
								/>
								<Text
									text={placeholder}
									fill={"#71717b"}
									fontFamily="secondary"
									fontSize={14}
									x={40}
									y={14}
								/>
							</Group>
						</Group>

						<Group y={height * 0.6} height={height * 0.22}>
							<Circle
								width={height * 4}
								height={height * 4}
								x={width / 2}
								y={height * 2.94}
								radius={height * 3}
								fillRadialGradientEndRadius={height}
								fillRadialGradientStartRadius={height * 3}
								fillRadialGradientStartPoint={{ x: 0, y: 0 }}
								fillRadialGradientEndPoint={{ x: 0, y: 0 }}
								fillRadialGradientColorStops={[0, "#ffffff", 0.5, "#ffffff"]}
								shadowBlur={21}
								shadowOffsetY={8}
								shadowColor="#000000"
							/>
							<Group width={width - 20} x={10} y={-10}>
								<Group width={width - 20} x={0}>
									<LocalImage
										y={-4}
										x={Math.max(
											(width - 20 - slogan.length * 10) / 2 -
												10,
											0
										)}
										src="/templates/wingai/points_up.png"
										width={12}
									/>
									<Group width={width - 20 - 14 * 2} x={14}>
										<Text
											align="center"
											verticalAlign="center"
											fontFamily="secondary"
											fontSize={16}
											fill="#ffa46b"
											text={slogan}
											lineHeight={1.1}
											width={width - 20 - 14 * 2}
										/>
									</Group>
									<LocalImage
										y={-4}
										x={Math.min(
											(width - 20) / 2 +
												(slogan.length * 10) / 2 +
												10 -
												12,
											width - 20 - 12
										)}
										src="/templates/wingai/points_up.png"
										width={12}
									/>
								</Group>
								<Group y={height * 0.22 - 70}>
									<Rect
										width={width - 20}
										height={70}
										shadowBlur={6}
										shadowOffset={{ x: -1, y: 3 }}
										shadowColor="#000000"
										shadowOpacity={0.33}
										cornerRadius={12}
										fillLinearGradientStartPoint={{
											x: 0,
											y: 0,
										}}
										fillLinearGradientEndPoint={{
											x: 0,
											y: 70,
										}}
										fillLinearGradientColorStops={[
											0,
											"#fcebe6",
											1,
											"#f9e6ea",
										]}
									/>
									<Text
										x={10}
										y={10}
										align="left"
										verticalAlign="center"
										width={width - 20}
										fontFamily="secondary"
										fontSize={16}
										fill="#000000"
										text={answer}
										lineHeight={1.1}
									/>
									<Group width={46 + 5} x={width - 46 - 20} y={-10}>
										<Rect
											x={-20}
											y={-3}
											width={23}
											height={23}
											fill="#ffffff"
											shadowBlur={10}
											cornerRadius={7}
											shadowColor="#000000"
											shadowOpacity={0.2}
										/>
										<Rect
											x={10}
											y={-3}
											width={23}
											height={23}
											fill="#ffffff"
											shadowBlur={10}
											cornerRadius={7}
											shadowColor="#000000"
											shadowOpacity={0.2}
										/>
										<SvgIconImage
											Icon={
												<IoDocuments
													size={14}
													color="#ffffff"
												/>
											}
											shadowColor="#f30000"
											shadowBlur={2}
											x={-15}
											y={2}
										/>
										<SvgIconImage
											Icon={
												<GoPencil
													size={14}
													color="#ff6a6a"
												/>
											}
											x={15}
											y={2}
										/>
									</Group>
								</Group>
							</Group>
						</Group>
					</Group>
					<LocalImage
						src="/templates/wingai/flirt.png"
						width={105}
						x={width / 2 - 52.5}
						y={height * 0.18 - 15}
						shadowBlur={8}
						shadowColor="#000000"
						shadowOpacity={0.15}
					/>
				</Group>
			</Layer>
		</DownloadableCanvas>
	);
};

export const Video = (props = defaultDynamicProps as DynamicProps) => {
	const { height, width, padding, placeholder, answer, slogan } = Object.entries(dynamicParams).reduce(
		(acc, [key, { default: defaultValue }]) => {
			if (!props[key]) acc[key] = defaultValue;

			return acc;
		},
		{ ...props } as Props
	);

	const stageRef = useRef<any>(null),
		[isRecording, setIsRecording] = useState(props.record ?? false);

	const [toFadeIn, setToFadeIn] = useState(false),
		[toShowAnswer, setToShowAnswer] = useState(false),
		[toFadeOut, setToFadeOut] = useState(false);

	useEffect(() => {
		setTimeout(async () => {
			setToFadeIn(true);

			await new Promise((r) => setTimeout(r, 650));
			setToShowAnswer(true);
		}, 1000);
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
				a.download = "wingai-template.mov";
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
	};

	return (
		<Stage
			ref={stageRef}
			style={{ backgroundColor: "transparent" }}
			options={{ preserveDrawingBuffer: true }}
			height={height + padding * 2}
			width={width + padding * 2}
		>
			{/* @ts-ignore */}
			<animated.Layer
				key={JSON.stringify(props)}
				{...$({
					from: { opacity: 0, y: 0, scaleY: 0.9 },
					to: {
						opacity: toFadeIn ? 1 : 0,
						scaleY: toFadeIn ? 1 : 0.9,
					},
					config: {
						tension: isRecording ? 280 : 170,
						friction: isRecording ? 22 : 26,
						precision: 0.00001,
						duration: toFadeIn ? animation.fadeIn : animation.fadeOut,
					},

					onRest: async () => {
						if (toFadeIn) {
							await new Promise((r) => setTimeout(r, 3000));
							setToFadeIn(false);
						}

						if (!toFadeIn) {
							await new Promise((r) => setTimeout(r, 500));

							setIsRecording(false);
							console.log("STOP RECORDING");
						}
					},
				})}
			>
				<Group x={padding} y={padding}>
					<Rect
						width={width}
						height={height}
						fill="white"
						cornerRadius={12}
						shadowBlur={35}
						shadowColor="#000000"
					/>
					<Group width={width} height={height * 0.18} y={height * 0.09 - 18} x={0}>
						<SvgIconImage
							Icon={<HiArrowLeft size={18} color="#000" />}
							width={18}
							x={8}
							y={8}
						/>
						<LocalImage
							src="/templates/wingai/logo.webp"
							width={105}
							x={width / 2 - 52.5}
							shadowBlur={5}
							shadowColor="#000000"
							shadowOpacity={0.3}
							shadowOffset={{ x: -2, y: 2 }}
						/>
						<SvgIconImage
							Icon={<TbMenu2 size={24} color="#f27365" />}
							width={24}
							x={width - 33}
							y={7.5}
						/>
					</Group>

					<Group
						y={height * 0.18}
						clipFunc={(ctx) => {
							ctx.beginPath();
							ctx.roundRect(0, 0, width, height * 0.82, 12);
							ctx.closePath();
						}}
					>
						<Group
							y={0}
							height={height * 0.6}
							clipFunc={(ctx) => {
								ctx.beginPath();
								ctx.roundRect(0, 0, width, height * 0.6, 0);
								ctx.closePath();
							}}
						>
							<Circle
								width={height * 4}
								height={height * 4}
								x={width / 2}
								y={height * 3}
								radius={height * 3}
								fillRadialGradientStartRadius={height * 3}
								fillRadialGradientEndRadius={height}
								fillRadialGradientStartPoint={{ x: 0, y: 0 }}
								fillRadialGradientEndPoint={{ x: 0, y: 0 }}
								fillRadialGradientColorStops={[0, "#ffba9f", 0.23, "#f6acc1"]}
							/>
							<Circle
								width={height * 4}
								height={height * 4}
								x={width / 2}
								y={height * 3}
								radius={height * 3}
								fillRadialGradientStartRadius={height * 3}
								fillRadialGradientEndRadius={0}
								fillRadialGradientStartPoint={{ x: 0, y: 0 }}
								fillRadialGradientEndPoint={{ x: 0, y: 0 }}
								fillRadialGradientColorStops={[
									0,
									"rgba(0,0,0,0.07)",
									0.007,
									"transparent",
								]}
							/>
							{/* Search bar */}

							<Group x={10} y={height * 0.6 - 90}>
								<Rect
									width={width - 20}
									height={38}
									fill="#ffffff"
									cornerRadius={20}
									shadowBlur={10}
									shadowColor="#000000"
									shadowOpacity={0.2}
								/>

								<SvgIconImage
									Icon={<BiSearchAlt size={20} color="#ff6a6a" />}
									src="/templates/wingai/search_bar.png"
									height={20}
									x={13}
									y={9}
								/>
								<Text
									text={placeholder}
									fill={"#71717b"}
									fontFamily="secondary"
									fontSize={14}
									x={40}
									y={14}
								/>
							</Group>

							<Group x={20} y={height * 0.07}>
								<Rect
									x={0}
									y={0}
									width={width - 40}
									height={height * 0.31}
									fill={"#000000"}
									cornerRadius={12}
									shadowBlur={12}
									shadowColor="#000000"
									shadowOpacity={0.66}
								/>
								{/* Current chat */}
								{props.chatSnapshot && (
									<AnimatedLocalImage
										y={height * 0.025}
										src={URL.createObjectURL(props.chatSnapshot)}
										width={width - 50}
										x={5}
										cornerRadius={12}
										trigger={toFadeIn}
									/>
								)}
							</Group>
						</Group>

						<Group y={height * 0.6} height={height * 0.22}>
							<Circle
								width={height * 4}
								height={height * 4}
								x={width / 2}
								y={height * 2.94}
								radius={height * 3}
								fillRadialGradientEndRadius={height}
								fillRadialGradientStartRadius={height * 3}
								fillRadialGradientStartPoint={{ x: 0, y: 0 }}
								fillRadialGradientEndPoint={{ x: 0, y: 0 }}
								fillRadialGradientColorStops={[0, "#ffffff", 0.5, "#ffffff"]}
								shadowBlur={21}
								shadowOffsetY={8}
								shadowColor="#000000"
							/>

							<Group width={width - 20} x={10} y={-10}>
								<Group width={width - 20} x={0}>
									<LocalImage
										y={-4}
										x={Math.max(
											(width - 20 - slogan.length * 10) / 2 -
												10,
											0
										)}
										src="/templates/wingai/points_up.png"
										width={12}
									/>
									<Group width={width - 20 - 14 * 2} x={14}>
										<Text
											align="center"
											verticalAlign="center"
											fontFamily="secondary"
											fontSize={16}
											fill="#ffa46b"
											text={slogan}
											lineHeight={1.1}
											width={width - 20 - 14 * 2}
										/>
									</Group>
									<LocalImage
										y={-4}
										x={Math.min(
											(width - 20) / 2 +
												(slogan.length * 10) / 2 +
												10 -
												12,
											width - 20 - 12
										)}
										src="/templates/wingai/points_up.png"
										width={12}
									/>
								</Group>

								{/* Answer */}
								<AnimatedAnswerGroup
									x={0}
									y={height * 0.22 - 70}
									width={width - padding * 2}
									height={120}
									trigger={toShowAnswer}
								>
									<Rect
										width={width - 20}
										height={70}
										shadowBlur={6}
										shadowOffset={{ x: -1, y: 3 }}
										shadowColor="#000000"
										shadowOpacity={0.33}
										cornerRadius={12}
										fillLinearGradientStartPoint={{
											x: 0,
											y: 0,
										}}
										fillLinearGradientEndPoint={{
											x: 0,
											y: 70,
										}}
										fillLinearGradientColorStops={[
											0,
											"#fcebe6",
											1,
											"#f9e6ea",
										]}
									/>
									<Text
										x={10}
										y={11}
										align="left"
										verticalAlign="center"
										width={width - padding * 2}
										fontFamily="secondary"
										fontSize={16}
										fill="#000000"
										text={answer}
										lineHeight={1.1}
									/>
									<Group width={46 + 5} x={width - 46 - 20} y={-10}>
										<Rect
											x={-20}
											y={-3}
											width={23}
											height={23}
											fill="#ffffff"
											shadowBlur={10}
											cornerRadius={7}
											shadowColor="#000000"
											shadowOpacity={0.2}
										/>
										<Rect
											x={10}
											y={-3}
											width={23}
											height={23}
											fill="#ffffff"
											shadowBlur={10}
											cornerRadius={7}
											shadowColor="#000000"
											shadowOpacity={0.2}
										/>
										<SvgIconImage
											Icon={
												<IoDocuments
													size={14}
													color="#ffffff"
												/>
											}
											shadowColor="#f30000"
											shadowBlur={2}
											x={-15}
											y={2}
										/>
										<SvgIconImage
											Icon={
												<GoPencil
													size={14}
													color="#ff6a6a"
												/>
											}
											x={15}
											y={2}
										/>
									</Group>
								</AnimatedAnswerGroup>
							</Group>
						</Group>
					</Group>
					<LocalImage
						src="/templates/wingai/flirt.png"
						width={105}
						x={width / 2 - 52.5}
						y={height * 0.18 - 15}
						shadowBlur={8}
						shadowColor="#000000"
						shadowOpacity={0.15}
					/>
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
			onOpenChange={(openState) => {
				setDialogOpen(openState);
				if (!openState) setToDownload(false);
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
					className="shrink flex flex-col w-full items-center justify-start h-fit self-start mb-auto"
				>
					<TabsList className="mx-auto">
						<TabsTrigger value="image">Image</TabsTrigger>
						<TabsTrigger value="video">Video</TabsTrigger>
					</TabsList>
					<TabsContent value="image">
						<div className="grid grid-cols-[repeat(12,1.5rem)] auto-rows-fr grid-flow-row justify-items-start gap-p w-full h-fit self-start mb-auto">
							{Object.entries(params).map(
								(
									[
										key,
										{
											type,
											label,
											default: defaultValue,
											props: { className, ...paramsProps },
											inputProps = {
												className: "w-full self-end justify-self-end mt-auto",
											},
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

										{type === "image" ? (
											<ImageLoader
												onFileChange={(file) =>
													setProps({
														...props,
														[key]: file,
													})
												}
												{...inputProps}
											/>
										) : (
											<Input
												type={
													typeof defaultValue ===
													"number"
														? "number"
														: "text"
												}
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
																: e
																		.target
																		.value,
													});
												}}
												defaultValue={
													props[key] ?? defaultValue
												}
												{...inputProps}
											/>
										)}
									</span>
								)
							)}

							<Button
								className="cursor-pointer col-span-4 -col-end-1 w-full h-9 mt-auto self-end"
								variant="outline"
								size="sm"
								onClick={() => setToDownload(true)}
							>
								Download
							</Button>
						</div>
					</TabsContent>
					<TabsContent value="video">
						<div className="grid grid-cols-[repeat(12,1.5rem)] auto-rows-fr grid-flow-row gap-p w-full">
							{Object.entries(dynamicParams).map(
								(
									[
										key,
										{
											type,
											label,
											default: defaultValue,
											props: { className, ...paramsProps },
											inputProps = {
												className: "w-full self-end justify-self-end mt-auto",
											},
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

										{type === "image" ? (
											<ImageLoader
												onFileChange={(file) =>
													setProps({
														...props,
														[key]: file,
													})
												}
												{...inputProps}
											/>
										) : (
											<Input
												type={
													typeof defaultValue ===
													"number"
														? "number"
														: "text"
												}
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
																: e
																		.target
																		.value,
													});
												}}
												defaultValue={
													props[label] ??
													defaultValue
												}
												{...inputProps}
											/>
										)}
									</span>
								)
							)}

							<Button
								className="relative cursor-pointer col-span-4 -col-end-1 h-9 mt-auto self-end"
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
					className="![background-color:transparent] bg-radial-[at_center] from-white to-90% to-transparent !h-[-webkit-fill-available]"
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

export type Props = Partial<ParamsToProps<typeof params>> & {
	download?: boolean;
	onDownload?: () => void;
};
export type DynamicProps = Props &
	Partial<ParamsToProps<typeof dynamicParams>> & {
		record?: boolean;
		onStopRecording?: () => void;
	};
