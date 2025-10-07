import { Circle, Group, Layer, Rect, Text } from 'react-konva';
import { LocalImage, SvgIconImage } from '@/utils/local-image';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Separator } from '@/ui/separator';
import DownloadableCanvas from '@/components/downloadable-canvas';
import { ParamsToProps } from '@/types/utils';

import { BsBoxArrowInUpRight } from 'react-icons/bs';
import { ImArrowUpRight2 } from 'react-icons/im';

import { params as IslandParams } from './2';

export const params = {
	height: {
		type: Number,
		label: 'Altezza',
		default: 120,
	},
	width: {
		type: Number,
		label: 'Larghezza',
		default: 350,
	},
	brandName: {
		type: String,
		label: 'Nome del brand',
		default: 'messaggi.italia',
	},
	message: {
		type: String,
		label: 'Messaggio del popup',
		default: 'Testo desiderato...',
	},
	cta: {
		type: String,
		label: 'CTA',
		default: 'Vai su 📲msgi.it',
	},
} as const;

export const defaultProps: Props = Object.entries(params).reduce(
	(acc, [key, { default: defaultValue }]) => ({ ...acc, [key]: defaultValue }),
	{}
);

const PADDING = 14,
	MARGIN = 21;

export const Canvas = (
	props = defaultProps as Props & { download?: boolean; onDownload?: () => void }
) => {
	const localProps = Object.entries(params).reduce((acc, [key, { default: defaultValue }]) => {
		if (props[key]) acc[key] = props[key];
		else acc[key] = defaultValue;

		return acc;
	}, {} as Props);

	const { height, width, brandName, message, cta } = { ...localProps, ...props };

	return (
		<DownloadableCanvas
			fileType="png"
			filename="expanded-popup"
			download={props.download}
			onDownload={props.onDownload}
			width={width + MARGIN * 2}
			height={height + MARGIN * 2}
			options={{ preserveDrawingBuffer: true }}
			style={{ backgroundColor: 'transparent', overflow: 'visible' }}>
			<Layer>
				<Rect
					x={MARGIN}
					y={MARGIN}
					width={width}
					height={height}
					fillLinearGradientStartPoint={{ x: 0, y: 0 }}
					fillLinearGradientEndPoint={{ x: 0, y: height }}
					fillLinearGradientColorStops={[0, '#2f2f32', 0.85, '#000000']}
					shadowBlur={14}
					cornerRadius={35}
					shadowColor="#ffffff"
					shadowOpacity={0.3}
					stroke="#2f2f32" // colore del bordo
					strokeWidth={0.5}
				/>
				<Group
					x={MARGIN + PADDING}
					y={MARGIN + PADDING}
					width={width - MARGIN - PADDING}
					height={height - MARGIN - PADDING}>
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
						x={
							width -
							PADDING * 2 -
							(IslandParams.height.default - PADDING - 4) / 2
						}
						y={(IslandParams.height.default - PADDING - 4) / 2 - 1}>
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
							Icon={
								<ImArrowUpRight2
									size={21}
									color="white"
									opacity={0.55}
								/>
							}
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

export const component = (oldProps: Props = defaultProps) => {
	const [props, setProps] = useState(oldProps);
	const [dialogOpen, setDialogOpen] = useState(false),
		[toDownload, setToDownload] = useState(false);

	return (
		<Dialog
			onOpenChange={open => {
				setDialogOpen(open);
				if (!open) setToDownload(false);
			}}>
			<DialogTrigger key={'dialog-trigger'}>
				<Canvas download={false} {...oldProps} />
			</DialogTrigger>
			<DialogContent
				key={'dialog-content'}
				className="flex flex-row items-center gap-p p-p border border-zinc-600/50 !max-w-none w-fit shadow-[0_0_7px_-1px_#b0e9ff4a]">
				<div className="contents">
					<Canvas
						download={toDownload}
						onDownload={() => setToDownload(false)}
						{...props}
					/>
				</div>
				<Separator
					orientation="vertical"
					className="![background-color:transparent] bg-radial-[at_center] from-white to-transparent !h-[-webkit-fill-available]"
				/>
				<div className="flex flex-col gap-sidebar-p w-full">
					{Object.entries(params).map(
						([key, { label, default: defaultValue }], index) => (
							<span key={index + key}>
								{label}
								:
								<Input
									type={
										typeof defaultValue === 'number'
											? 'number'
											: 'text'
									}
									className="min-w-60"
									onChange={e => {
										if (!e.target.value?.trim().length)
											return;
										setProps({
											...props,
											[key]:
												typeof defaultValue ===
												'number'
													? parseInt(
															e.target
																.value
													  )
													: e.target.value,
										});
									}}
									defaultValue={props[label] ?? defaultValue}
								/>
							</span>
						)
					)}
					<Button
						className="mt-p cursor-pointer"
						variant="outline"
						size="sm"
						onClick={() => setToDownload(true)}>
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
