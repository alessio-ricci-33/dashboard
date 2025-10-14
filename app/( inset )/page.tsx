'use client';

import { useState } from 'react';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { FiCopy } from 'react-icons/fi';
import { toast } from 'sonner';
import { shortsTitles } from '@/constants/system-instructions';

export default function Page() {
	const [prompt, setPrompt] = useState('');
	const [systemInstruction, setSystemInstruction] = useState(shortsTitles);
	const [model, setModel] = useState<
		| 'gemini-2.0-flash'
		| 'gemini-2.5-flash'
		| 'gemini-2.5-pro'
		| 'gemini-2.5-flash-lite-preview-06-17'
	>('gemini-2.0-flash');
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState<{ [key: string]: string }>({
		tiktok: '',
		youtube: '',
		instagram: '',
	});

	const handleGenerate = async () => {
		if (!prompt.trim()) return;
		setLoading(true);

		try {
			// ESEMPIO DI CHIAMATA FUTURA:
			const res = await fetch('/api/genai/titles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt, systemInstruction, model }),
			});

			const { success, ...props } = await res.json();
			if (!success) return toast.error(props.message);
			console.log(props);
			// Mock temporaneo
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
		<section className="flex flex-col w-full h-fit gap-p ">
			<h1 className="text-2xl font-semibold tracking-tight">AI Title Generator</h1>

			<div className="grid grid-cols-12 auto-rows-fr gap-p">
				{/* CONFIGURAZIONE MODELLO E SYSTEM INSTRUCTION */}
				<div className="col-span-12 md:col-span-8 row-span-3 flex flex-col gap-2">
					<div className="flex flex-row items-end justify-between gap-2">
						<label className="text-sm font-medium text-muted-foreground leading-none">
							Gen. model
						</label>
						<Select
							value={model}
							onValueChange={v => setModel(v as typeof model)}>
							<SelectTrigger className="w-56 !h-full">
								<SelectValue placeholder="Seleziona modello" />
							</SelectTrigger>
							<SelectContent className="!outline-none !border-zinc-600 !ring-0">
								<SelectItem value="gemini-2.0-flash">
									gemini-2.0-flash
								</SelectItem>
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
					<Textarea
						spellCheck={false}
						value={systemInstruction}
						onChange={e => setSystemInstruction(e.target.value)}
						placeholder="Istruzioni di sistema (facoltative, per personalizzare lo stile o il tono del modello)..."
						className="h-full resize-none"
					/>
				</div>

				<div className="grid grid-cols-subgrid grid-rows-subgrid gap-p col-span-full row-span-4">
					{/* AREA PROMPT */}
					<div className="relative flex flex-col col-span-8 row-span-5 col-start-1 gap-p pt-p">
						<label className="text-sm font-medium text-muted-foreground leading-none">
							Transcription
						</label>
						<Textarea
							value={prompt}
							spellCheck={false}
							onChange={e => setPrompt(e.target.value)}
							placeholder="Incolla qui la trascrizione..."
							className="h-full resize-none"
						/>
						<Button
							onClick={handleGenerate}
							disabled={loading}
							className="absolute bottom-4 right-4">
							{loading ? 'Generazione in corso...' : 'Genera Titoli AI'}
						</Button>
					</div>

					{/* RISULTATI */}
					<section className="grid grid-cols-1 auto-rows-fr gap-p col-span-4 row-span-4 pt-10">
						{Object.keys(results).length > 0 &&
							Object.entries(results).map(([key, value]) => (
								<div
									key={key}
									className="relative grid grid-rows-subgrid row-span-3 h-full gap-p">
									<h2 className="capitalize text-lg font-semibold leading-none row-span-1">
										{key}
									</h2>
									<div className="flex flex-row justify-between items-center row-span-2 h-full gap-p p-0">
										<Input
											value={value}
											onChange={e =>
												setResults(prev => ({
													...prev,
													[key]: e.target.value,
												}))
											}
											className="font-medium text-start h-full"
										/>
										<Button
											variant="secondary"
											size="icon"
											onClick={() => handleCopy(value)}
											title="Copia titolo"
											className="cursor-pointer h-full">
											<FiCopy size={18} />
										</Button>
									</div>
								</div>
							))}
					</section>
				</div>
			</div>
		</section>
	);
}
