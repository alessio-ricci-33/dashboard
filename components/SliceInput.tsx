import { cn } from '@/utils/shadcn';
import { useState, useEffect } from 'react';

function SliceInput({
	defaultValue,
	validShorts,
	onHeavyProcess,
	className,
}: {
	defaultValue?: number;
	validShorts: string[];
	onHeavyProcess: (count: number) => void;
	className?: string;
}) {
	const [sliceCount, setSliceCount] = useState(defaultValue ?? 21);
	const [debouncedCount, setDebouncedCount] = useState(sliceCount);

	// Debounce di 3 secondi
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedCount(sliceCount);
		}, 1650);

		// Pulizia: se l’utente cambia prima che scadano i 3s, si resetta il timer
		return () => {
			clearTimeout(handler);
		};
	}, [sliceCount]);

	// Effetto che parte solo dopo i 3s di calma
	useEffect(() => {
		if (debouncedCount !== undefined) {
			// qui metti la logica pesante
			onHeavyProcess(debouncedCount);
		}
	}, [debouncedCount, onHeavyProcess]);

	return (
		<input
			id="sliceCount"
			type="number"
			min={1}
			max={validShorts.length}
			value={sliceCount}
			step={7}
			onChange={e => setSliceCount(Number(e.target.value))}
			className={cn(
				className,
				'inline mx-1 !size-fit !p-0 file:!w-fit border rounded-md text-center text-xs bg-transparent border-border'
			)}
		/>
	);
}

export default SliceInput;
