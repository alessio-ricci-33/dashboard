'use client';

import { useState, useRef, useEffect } from 'react';

interface PromptInputProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit?: () => void;
	placeholder?: string;
}

export function PromptInput({
	value,
	onChange,
	onSubmit,
	placeholder = 'Incolla qui la trascrizione...',
}: PromptInputProps) {
	const divRef = useRef<HTMLDivElement>(null);

	// Mantiene il contenuto <p> sincronizzato con lo stato React
	useEffect(() => {
		const el = divRef.current;
		if (!el) return;
		const current = el.innerText.trim();
		if (value.trim() === current) return;
		if (!value) {
			el.innerHTML = `<p><br></p>`;
		} else {
			el.innerHTML = `<p>${value.replace(/\n/g, '</p><p>')}</p>`;
		}
	}, [value]);

	return (
		<div
			className="
				relative
				flex-1
                        flex
				overflow-y-auto
				size-full
				[scrollbar-width:0]
				text-foreground
				bg-transparent
				cursor-text
			">
			<div
				ref={divRef}
				contentEditable
				suppressContentEditableWarning
				role="textbox"
				translate="no"
				data-placeholder={placeholder}
				onInput={e => {
					const text = e.currentTarget.innerText;
					onChange(text);
				}}
				onKeyDown={e => {
					if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
						e.preventDefault();
						onSubmit?.();
					}
				}}
				className={`
					relative
				      flex-1
					size-full
					text-start
					text-sm
					outline-none
					bg-transparent
					whitespace-pre-wrap
					break-words
					flex
					flex-col
					items-start
					justify-end
					overflow-y-auto
					before:content-[attr(data-placeholder)]
					before:relative
                              before:self-start
                              before:translate-y-[2px]
                              before:text-start
					before:text-muted-foreground
					before:pointer-events-none
					before:opacity-50
					empty:before:block
				`}
				onFocus={e => {
					// Se vuoto, mostra un p vuoto per non "collassare" il caret
					if (!e.currentTarget.innerText.trim()) {
						e.currentTarget.innerHTML = '<p><br></p>';
					}
				}}
				onBlur={e => {
					// Se vuoto, svuota del tutto per far riapparire il placeholder
					if (!e.currentTarget.innerText.trim()) {
						e.currentTarget.innerHTML = '';
					}
				}}
				dangerouslySetInnerHTML={{
					__html: value ? `<p>${value.replace(/\n/g, '</p><p>')}</p>` : '',
				}}
			/>
		</div>
	);
}
