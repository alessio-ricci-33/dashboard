import { Circle, Group, Layer, Rect, Text } from "react-konva";
import { LocalImage, SvgIconImage } from "@/utils/local-image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Separator } from "@/ui/separator";
import DownloadableCanvas from "@/components/downloadable-canvas";
import { ParamsToProps } from "@/types/utils";

import { ImArrowUpRight2 } from "react-icons/im";

export const params = {
	height: {
		type: Number,
		label: "Altezza",
		default: 57,
	},
	width: {
		type: Number,
		label: "Larghezza",
		default: 360,
	},
	brandName: {
		type: String,
		label: "Nome del brand",
		default: "msgi.it",
	},
	message: {
		type: String,
		label: "Messaggio del popup",
		default: "Testo desiderato...",
	},
} as const;

export const defaultProps: Props = Object.entries(params).reduce(
	(acc, [key, { default: defaultValue }]) => ({ ...acc, [key]: defaultValue }),
	{}
);

const PADDING = 20;

export const Canvas = (props = defaultProps as Props & { download?: boolean; onDownload?: () => void }) => {
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
			style={{ backgroundColor: "transparent", overflow: "visible" }}
		>
			<Layer>
				<Rect
					x={PADDING}
					y={PADDING}
					width={width}
					height={height}
					fillLinearGradientStartPoint={{ x: 0, y: 0 }}
					fillLinearGradientEndPoint={{ x: 0, y: height }}
					fillLinearGradientColorStops={[0, "#2f2f32", 0.85, "#000000"]}
					shadowBlur={10}
					cornerRadius={35}
					shadowColor="#ffffff"
					shadowOpacity={0.5}
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

					<Group x={width - PADDING * 2 - 4} y={(height - PADDING) / 2 - 0.5}>
						<Circle
							radius={999}
							fill="#15171c"
							shadowBlur={7}
							shadowColor="#ffffff"
							shadowOpacity={0.5}
							height={height - PADDING + 2}
							width={height - PADDING + 2}
						/>
						<SvgIconImage
							Icon={<ImArrowUpRight2 size={21} color="white" opacity={0.75} />}
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

export const component = (oldProps: Props = defaultProps) => {
	const [props, setProps] = useState(oldProps);
	const [dialogOpen, setDialogOpen] = useState(false),
		[toDownload, setToDownload] = useState(false);

	return (
		<Dialog
			onOpenChange={(open) => {
				setDialogOpen(open);
				if (!open) setToDownload(false);
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
					className="![background-color:transparent] bg-radial-[at_center] from-white to-transparent !h-[-webkit-fill-available]"
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
								defaultValue={props[label] ?? defaultValue}
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
