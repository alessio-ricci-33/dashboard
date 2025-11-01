'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { FiCopy } from 'react-icons/fi';
import { toast } from 'sonner';
import { usePersistentState } from '@/hooks/usePersistentState';
import { FaArrowUp, FaPlus } from 'react-icons/fa6';
import { Popover, PopoverTrigger, PopoverContent } from '@/ui/popover';
import { CgAttachment } from 'react-icons/cg';
import { Separator } from '@/ui/separator';

export default function Page() {
	const [prompt, setPrompt] = useState(''),
		[CSV, setCSV] = useState('');

	const [model, setModel] = usePersistentState<
		'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-2.5-flash-lite-preview-06-17'
	>('tools-model', 'gemini-2.5-flash', 'local');
	const [loading, setLoading] = useState(false);

	const [open, setOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [results, setResults] = usePersistentState<{ [key: string]: string[] }>(
			'AI-tools-sgorts-titles',
			{
				tiktok: [],
				youtube: [],
				instagram: [],
			},
			'local'
		),
		[reveal, setReveal] = useState(-1);

	useEffect(() => {
		const target = Math.max(...Object.values(results).map(x => x.length - 1));
		if (target < 1) return;

		(async () => {
			for (let i = 0; i <= target; i++) {
				await new Promise(r => setTimeout(r, 285));
				setReveal(i);
			}
		})();
	}, [results]);

	const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = event => {
			const text = event.target?.result as string;
			try {
				const cleaned = text
					.split('\n')
					.map(line => line.trim())
					.filter(Boolean)
					.map(line =>
						line
							// Rimuove timestamp tipo 00:00, 0:00:00, [00:00], ecc.
							.replace(/\[?\b\d{1,2}:\d{2}(?::\d{2})?\b\]?/g, '')
							// Rimuove pattern tipo p1;text; o p2;text;
							.replace(
								/^p\d+;text;/i,
								d => d.replace('text;', '').split(';')[0] + ': '
							)
							// // Rimuove eventuali separatori extra tipo "p1;", "p2;", ecc.
							// .replace(/^p\d+;/i, '')
							// Rimuove doppio punto e virgola iniziale o spazi strani
							.replace(/^;+/, '')
							.trim()
					)
					.filter(Boolean)
					.join('\n');

				console.log(cleaned);

				setCSV(cleaned);
				toast.success('File CSV caricato!');
				setOpen(false);
			} catch (err) {
				console.error(err);
				toast.error('❌ Errore nella lettura o pulizia del file CSV');
			}
		};
		reader.readAsText(file);
	};

	const handleGenerate = async () => {
		if (!prompt.trim() && !CSV) return;
		setLoading(true);
		try {
			const res = await fetch('/api/genai/titles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt: `${prompt}\n\n${CSV}`, model }),
			});
			const { success, ...props } = await res.json();
			if (!success) return toast.error(props.message);
			setResults(props.data);
		} catch (err) {
			console.error('Errore durante la generazione', err);
		} finally {
			setLoading(false);
		}
	};

	const handleCopy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast('✔️ Titolo copiato!');
		} catch (err) {
			console.error('Errore nella copia:', err);
		}
	};

	return (
		<>
			{/* HEADER */}
			<div className="mx-auto self-center justify-self-center flex flex-col gap-2">
				<div className="flex flex-row items-end justify-between gap-2 ">
					<Select
						value={model}
						onValueChange={v => setModel(v as typeof model)}>
						<SelectTrigger className="!w-fit !h-full rounded-full !font-secondary capitalize *:data-[slot=select-value]:!-mb-1 [&>svg]:!size-4.5">
							<SelectValue placeholder="Seleziona modello" />
						</SelectTrigger>
						<SelectContent className="!outline-none !border-zinc-600 !ring-0 [&>*]:!font-secondary [&>*]:capitalize">
							<SelectItem value="gemini-2.5-flash">
								gemini-2.5-flash
							</SelectItem>
							<SelectItem value="gemini-2.5-flash-lite-preview-06-17">
								gemini-2.5-flash-lite-preview-06-17
							</SelectItem>
							<SelectItem value="gemini-2.5-pro">
								gemini-2.5-pro
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* CONTENUTO */}
			<section className="grid grid-cols-3 auto-rows-fr w-full h-fit gap-p px-p pt-10">
				{Object.entries(results).map(([key, candidates]) => (
					<div
						key={key}
						className="relative flex flex-col col-span-1 h-full items-center justify-start gap-p">
						<h2 className="capitalize text-lg font-semibold leading-none row-span-1">
							{key}
						</h2>
						<div className="grid grid-cols-1 auto-rows-fr size-fit gap-p min-w-2/3 px-3">
							{candidates.map((value, index) => (
								<div
									key={index}
									className="group relative flex flex-row justify-between items-center row-span-1 size-full gap-p py-0 ">
									{index > 0 && (
										<Separator
											data-reveal={reveal >= index}
											orientation="horizontal"
											className="absolute -top-[var(--p)/2] left-0 w-full opacity-90 blur-[0px] data-[reveal=false]:opacity-0 data-[reveal=false]:blur-sm [transition-timing-function:cubic-bezier(0.4,0,.2,.4,1)] delay-250 duration-800 transition-[opacity,filter]"
										/>
									)}
									<Input
										data-reveal={reveal >= index}
										value={value}
										onChange={e =>
											setResults(prev => {
												prev[key][index] =
													e.target.value;
												return { ...prev };
											})
										}
										className="font-medium text-start text-foreground/85 size-full py-3 px-0 !bg-transparent !border-none !border-0 !ring-transparent !ring-0 !outline-none !focus-visible:outline-none !focus-visible:ring-0 !focus-visible:ring-transparent opacity-100 blur-[0px] data-[reveal=false]:opacity-0 data-[reveal=false]:blur-sm [transition-timing-function:cubic-bezier(0.4,0,.2,.4,1)] duration-850 transition-[opacity,filter]"
									/>
									<Button
										variant="secondary"
										size="icon"
										onClick={() => handleCopy(value)}
										title="Copia titolo"
										data-reveal={reveal >= index}
										className="group-hover:opacity-100 cursor-pointer h-full !bg-transparent !border-none !ring-none opacity-60 blur-[0px] data-[reveal=false]:opacity-0 data-[reveal=false]:blur-sm [transition-timing-function:cubic-bezier(0.4,0,.2,.4,1)] delay-165 duration-450 transition-[opacity,filter]">
										<FiCopy size={18} />
									</Button>
								</div>
							))}
						</div>
					</div>
				))}

				{/* AREA PROMPT */}
				<div className="absolute bottom-p inset-x-0 flex flex-col justify-center items-center gap-p w-2/5 mx-auto dark:bg-input/30 rounded-4xl">
					<div className="relative flex flex-row items-center justify-between w-full h-fit !py-2 px-2.5">
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									disabled={loading}
									className="z-30 shrink-0 cursor-pointer bg-transparent rounded-full hover:bg-foreground/8 !px-1 !py-3 aspect-square h-8">
									<FaPlus
										size={24}
										className="text-foreground "
									/>
								</Button>
							</PopoverTrigger>
							<PopoverContent
								align="start"
								sideOffset={16}
								className="flex flex-col items-start w-fit gap-3 !border-none !outline-none !ring-transparent !shadow-[0_0_9px_0px] shadow-sidebar rounded-xl overflow-visible">
								<div className="flex flex-row items-center gap-2">
									<input
										ref={fileInputRef}
										type="file"
										accept=".csv"
										onChange={handleCSVUpload}
										className="hidden"
									/>

									{/* Custom trigger button */}
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											fileInputRef.current?.click()
										}>
										<CgAttachment size={24} />
										Carica CSV
									</Button>
								</div>
							</PopoverContent>
						</Popover>

						<div className="relative shrink flex flex-row items-center justify-start size-full h-8">
							<Textarea
								value={prompt}
								spellCheck={false}
								onChange={e => setPrompt(e.target.value)}
								placeholder="Incolla qui la trascrizione..."
								className="absolute inset-y-auto my-auto mr-auto left-0 w-full !px-2.5 !pt-3 h-[calc(100%+var(--spacing)*3)] min-h-0 resize-none !border-none !outline-none bg-transparent !ring-transparent !shadow-none flex flex-col items-start justify-end text-start align-bottom overflow-y-auto placeholder:-translate-x-0.25"
							/>
						</div>
						<Button
							onClick={handleGenerate}
							disabled={loading}
							className="shrink-0 contrast-110 z-30 cursor-pointer rounded-full !px-1 !py-3 aspect-square h-8 shadow-[0_0_7px_-1px] shadow-foreground/85 !bg-transparent !bg-radial from-foreground/80 to-foreground">
							<FaArrowUp size={24} />
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}
