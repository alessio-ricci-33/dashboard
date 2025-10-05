import { TbMenu2 } from "react-icons/tb";
import { IoDocuments } from "react-icons/io5";
import { GoPencil } from "react-icons/go";
import { Layer, Rect, Text, Circle, Group } from "react-konva";
import { BiSearchAlt } from "react-icons/bi";

import { HiArrowLeft } from "react-icons/hi2";
import { ParamsToProps } from "@/types/utils";
import DownloadableCanvas from "@/components/downloadable-canvas";
import { LocalImage, SvgIconImage } from "@/utils/local-image";

import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { useState } from "react";
import { Separator } from "@/ui/separator";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";

export const params = {
	padding: {
		type: Number,
		label: "Padding",
		default: 20,
	},
	height: {
		type: Number,
		label: "Altezza",
		default: 520,
	},
	width: {
		type: Number,
		label: "Larghezza",
		default: 290,
	},
	placeholder: {
		type: String,
		label: "Search placeholder",
		default: "Scrivi i tuoi interessi ...",
	},
	answer: {
		type: String,
		label: "Answer",
		default: "Ho sempre pensato che saremmo stati destinati a stare insieme ❤",
	},
};

export const defaultProps: Props = Object.entries(params).reduce(
	(acc, [key, { default: defaultValue }]) => ({ ...acc, [key]: defaultValue }),
	{}
);

export const Canvas = (props = defaultProps as Props & { download?: boolean; onDownload?: () => void }) => {
	const { height, width, padding, placeholder, answer } = Object.entries(params).reduce(
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
							src="/templates/wingai/logo.webp"
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
								<LocalImage
									y={-4}
									x={40}
									src="/templates/wingai/points_up.png"
									width={12}
								/>
								<Text
									align="center"
									width={width - 20}
									fontFamily="secondary"
									fontSize={16}
									fill="#ffa46b"
									text="Fatti capire meglio!"
								/>
								<LocalImage
									y={-4}
									x={width - 72}
									src="/templates/wingai/points_up.png"
									width={12}
								/>
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

export const component = (oldProps: Props = defaultProps) => {
	const [props, setProps] = useState(oldProps);
	const [dialogOpen, setDialogOpen] = useState(false),
		[toDownload, setToDownload] = useState(false);

	return (
		<Dialog
			onOpenChange={(openState) => {
				setDialogOpen(openState);
				if (!openState) setToDownload(false);
			}}
		>
			<DialogTrigger key={"dialog-trigger"}>
				<Canvas download={false} {...oldProps} />
			</DialogTrigger>
			<DialogContent
				key={"dialog-content"}
				className="flex flex-row items-center gap-p p-p border border-zinc-600/50 !max-w-none w-fit shadow-[0_0_7px_-1px_#b0e9ff4a]"
			>
				<div className="contents">
					<Canvas download={toDownload} onDownload={() => setToDownload(false)} {...props} />
				</div>
				<Separator
					orientation="vertical"
					className="![background-color:transparent] bg-radial-[at_center] from-white to-80% to-transparent !h-[-webkit-fill-available]"
				/>
				<div className="flex flex-col gap-sidebar-p w-full">
					{Object.entries(params).map(([key, { label, default: defaultValue }], index) => (
						<span key={index + key}>
							{label}
							:
							<Input
								type={typeof defaultValue === "number" ? "number" : "text"}
								className="min-w-60"
								onChange={(e) => {
									if (!e.target.value?.trim().length) return;
									setProps({
										...props,
										[key]:
											typeof defaultValue === "number"
												? parseInt(e.target.value)
												: e.target.value,
									});
								}}
								defaultValue={props[key] ?? defaultValue}
							/>
						</span>
					))}
					<Button
						className="mt-p cursor-pointer"
						variant="outline"
						size="sm"
						onClick={() => setToDownload(true)}
					>
						Download
					</Button>
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
