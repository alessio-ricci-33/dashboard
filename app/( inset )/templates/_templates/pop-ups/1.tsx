import { Layer, Rect, Text } from 'react-konva';
import { LocalImage } from '@/utils/local-image';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Separator } from '@/ui/separator';
import DownloadableCanvas from '@/components/downloadable-canvas';
import { ParamsToProps } from '@/types/utils';

export const params = {
	height: {
		type: Number,
		label: 'Altezza',
		default: 100,
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

const PADDING = 20;

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
			download={props.download}
			onDownload={props.onDownload}
			width={width + PADDING * 2}
			height={height + PADDING * 2}
			options={{ preserveDrawingBuffer: true }}
			style={{ backgroundColor: 'transparent', overflow: 'visible' }}>
			<Layer>
				<Rect
					x={PADDING}
					y={PADDING}
					width={width}
					height={height}
					fillLinearGradientStartPoint={{ x: 0, y: 0 }}
					fillLinearGradientEndPoint={{ x: 0, y: height }}
					fillLinearGradientColorStops={[0, '#e7efff', 1, '#56515a']}
					shadowBlur={10}
					cornerRadius={10}
					shadowColor="#000000"
					stroke="#e7efff" // colore del bordo
					strokeWidth={0.5}
				/>

				{/* Immagine locale sopra il rettangolo */}
				<LocalImage
					src="/messaggi-italia.png" // immagine salvata in public/images/logo.png
					x={PADDING + 10}
					y={PADDING + 10}
					height={27}
					shadowColor="#000000"
					shadowBlur={7}
				/>

				<Text
					x={PADDING + 10 + 30}
					y={PADDING + 11}
					text={brandName}
					fontSize={20}
					fontFamily="logo" // deve corrispondere al nome definito in @font-face
					fill="black"
				/>

				<Text
					x={PADDING + 10}
					y={height - 10 - PADDING}
					text={message}
					fontSize={18}
					fontFamily="secondary" // deve corrispondere al nome definito in @font-face
					fill="#ffffff"
					shadowColor="#000000"
					shadowBlur={4}
					shadowOffsetY={3}
				/>

				<Text
					x={PADDING + 10}
					y={height - 10}
					text={cta}
					fontSize={16}
					fontFamily="secondary" // deve corrispondere al nome definito in @font-face
					fill="#ffffff"
					shadowColor="#000000"
					shadowBlur={4}
					shadowOffsetY={3}
				/>
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
