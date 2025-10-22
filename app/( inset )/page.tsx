'use client';
import { useEffect, useState } from 'react';
import { Separator } from '@/ui/separator';
import { ShortAnalytic } from '@/components/short-analytic';
import { Checkbox } from '@/ui/checkbox';

import { getAll } from './page.server';
import { Label } from '@/ui/label';
import { cn } from '@/utils/shadcn';

export default () => {
	const [shorts, setShorts] = useState([]),
		[keys, setKeys] = useState(['views', 'likes', 'comments']);

	// useEffect(() => {
	// 	getAll().then(setShorts);
	// }, []);

	return (
		<div className="flex flex-col gap-[calc(var(--p)*2)] w-full px-p">
			<div className="flex flex-row justify-between items-center gap-[calc(var(--p)*2)]">
				<h1 className="text-2xl font-semibold leading-none">Shorts Analytics</h1>
				<div className="flex flex-row gap-p w-fit">
					{[
						{
							key: 'views',
							label: 'Views',
							className: 'bg-[#82ca9d]/35 border border-[#82ca9d]/50',
							checkBoxProps: {
								className:
									'rounded-full contrast-111 border border-accent data-[state=checked]:bg-[#82ca9d] data-[state=checked]:text-white bg-[#82ca9d]/35',
							},
						},
						{
							key: 'likes',
							label: 'Likes',
							className: 'bg-[#fc365f]/35 border border-[#fc365f]/50',
							checkBoxProps: {
								className:
									'rounded-full contrast-111 border border-accent data-[state=checked]:bg-[#fc365f] data-[state=checked]:text-white bg-[#fc365f]/35',
							},
						},
						{
							key: 'comments',
							label: 'Comments',
							className: 'bg-[#3ea6ff]/35 border border-[#3ea6ff]/50',
							checkBoxProps: {
								className:
									'rounded-full contrast-111 border border-accent data-[state=checked]:bg-[#3ea6ff] data-[state=checked]:text-white bg-[#3ea6ff]/35',
							},
						},
					].map(({ key, label, className, checkBoxProps }, index) => (
						<Label
							key={index + 'label'}
							className={cn(
								'flex flex-row items-center gap-2 py-1.25 pl-1.5 pr-3 rounded-xl opacity-85 has-[[data-state=checked]]:opacity-100 font-secondary text-xs leading-none tracking-wide select-none',
								className
							)}>
							<Checkbox
								key={index}
								checked={keys.includes(key)}
								onCheckedChange={checked => {
									if (checked) setKeys([...keys, key]);
									else setKeys(keys.filter(k => k !== key));
								}}
								{...checkBoxProps}
							/>
							{label}
						</Label>
					))}
				</div>
			</div>
			<div className="grid auto-rows-fr w-full gap-[calc(var(--p)*2)]">
				{shorts.map((short, index) => (
					<div className="relative size-full">
						{index > 0 && (
							<Separator
								className="absolute -top-p -left-p !w-[calc(var(--p)*2+100%)] opacity-90"
								orientation="horizontal"
							/>
						)}
						<ShortAnalytic
							key={index}
							visibleKeys={keys}
							index={index}
							{...short}
						/>
					</div>
				))}
			</div>
		</div>
	);
};
