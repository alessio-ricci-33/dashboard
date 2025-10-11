'use client';
import { useRef, useState } from 'react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';

export const ImageLoader = ({
	onFileChange,
	...props
}: React.ComponentProps<'div'> & {
	onFileChange?: (file: File | null) => void;
}) => {
	const fileInput = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const handleFileChange = () => {
		const file = fileInput.current?.files?.[0];
		if (!file) return;

		const validFormats = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg'];
		if (!validFormats.includes(file.type)) {
			alert('Formato file non supportato. Usa WebP, PNG, JPEG o JPG.');
			setPreview(null);
			if (onFileChange) onFileChange(null);
			return;
		}

		setPreview(URL.createObjectURL(file));
		if (onFileChange) onFileChange(file);
	};

	const handleRemove = () => {
		setPreview(null);
		if (onFileChange) onFileChange(null);
		if (fileInput.current) fileInput.current.value = '';
	};

	return (
		<div {...props}>
			<Input
				type="file"
				ref={fileInput}
				accept="image/webp, image/png, image/jpeg, image/jpg"
				className="hidden"
				onChange={handleFileChange}
			/>

			<div className="relative flex justify-center items-center aspect-video size-full rounded-lg overflow-hidden">
				{preview ? (
					<>
						<img
							src={preview}
							alt="Preview"
							className="absolute !size-full object-contain object-center rounded-lg inset-auto"
						/>
						<Button
							type="button"
							onClick={handleRemove}
							className="z-10 absolute top-0 right-0 rounded-tl-none rounded-br-none rounded-bl-lg shadow-[0_0_10px_2px_#00000024] bg-foreground/35 backdrop-blur-lg p-1 aspect-square border-0 border-none ring-0">
							X
						</Button>
					</>
				) : (
					<Button
						type="button"
						className="size-full border-foreground/25 border-dashed border-2 bg-transparent hover:bg-transparent text-foreground ring-0 outline-0 focus-visible:ring-0"
						onClick={() => fileInput.current?.click()}>
						Carica immagine
					</Button>
				)}
			</div>
		</div>
	);
};
