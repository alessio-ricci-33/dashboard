'use client';
import { useEffect, useMemo, useState } from 'react';
import { Separator } from '@/ui/separator';
import { ShortAnalytic } from '@/components/short-analytic';
import { Checkbox } from '@/ui/checkbox';

import { getAll } from './page.server';
import { Label } from '@/ui/label';
import { cn } from '@/utils/shadcn';
import { usePersistentState } from '@/hooks/usePersistentState';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';

// import shorts_list from '@/constants/shorts.json';

export default () => {
	const [shorts, setShorts] = useState([]),
		[type, SetType] = usePersistentState<'trend' | 'avg'>('heatmap-type', 'trend', 'local'),
		[sliceCount, setSliceCount] = usePersistentState('heatmap-slice-count', 60, 'local'),
		[keys, setKeys] = usePersistentState('visible-keys', ['views'], 'local');

	useEffect(() => {
		getAll().then(setShorts);
	}, []);

	// --- Calcolo heatmap ---
	const heatmapData = useMemo(() => {
		if (!shorts?.length) return [];

		console.log(shorts);

		const now = new Date();
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(now.getMonth() - 1);

		// inizializza matrice 7x24 (giorni x ore)
		const matrix = Array.from({ length: 7 }, () => Array(24).fill(0));

		shorts.slice(0, sliceCount).forEach(short => {
			const publishDate = new Date(short.metadata.snippet.publishedAt);
			const ageDays = Math.max((now - publishDate) / (1000 * 60 * 60 * 24), 1);
			const weight = 1 / ageDays;

			short.metricsHistory.forEach(metrics => {
				const date = new Date(metrics.timestamp);
				const day = date.getDay(); // 0=Sunday, 1=Monday...
				const hour = date.getHours();

				const performance =
					(metrics.views || 0) * 1 +
					(metrics.likes || 0) * 0 +
					(metrics.comments || 0) * 0;

				if (type === 'avg') matrix[day][hour] += performance;
				else matrix[day][hour] += performance * weight;
			});
		});

		const max = Math.max(...matrix.flat());
		matrix.forEach(day => {
			day.forEach((hour, i) => {
				day[i] = Math.max(0, Math.min(1, hour / max));
			});
		});
		return matrix;
	}, [shorts, sliceCount, type]);

	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	return (
		<div className="flex flex-col gap-p w-full px-p mb-40">
			{/* --- HEATMAP --- */}
			<div className="w-full flex flex-col gap-2">
				<div className="flex flex-row justify-start items-center gap-2.5">
					<h2 className="text-lg font-semibold">Heatmap</h2>

					{/* 🔢 Input per numero di shorts da considerare */}
					<div className="flex items-center gap-2 text-sm text-foreground/85">
						<p className="text-foreground/60">/</p>
						Based on latest
						<Input
							id="sliceCount"
							type="number"
							min={1}
							max={shorts.length}
							value={sliceCount}
							step={1}
							onChange={e => setSliceCount(Number(e.target.value))}
							className="inline mx-2 !size-fit !p-0 file:!w-fit border rounded-md text-center text-xs bg-transparent border-border"
						/>
						shorts
					</div>

					<Button
						onClick={() => SetType(type === 'trend' ? 'avg' : 'trend')}
						variant={type === 'trend' ? 'default' : 'outline'}>
						Trend
					</Button>
				</div>
				<div className="grid grid-cols-[repeat(25,1rem)] grid-rows-[repeat(8,1rem)] gap-p text-[10px] grid-flow-col">
					<div className="grid grid-rows-subgrid grid-cols-1 row-span-full col-span-1 col-start-1 row-start-2 -row-end-1 size-full">
						{days.map(day => (
							<div
								key={'day' + day}
								className="row-span-1 size-full text-center font-medium">
								{day}
							</div>
						))}
					</div>

					<div className="grid grid-cols-subgrid grid-rows-1 col-start-2 -col-end-1 row-span-1 row-start-1 size-full grid-flow-col">
						{Array.from({ length: 24 }).map((_, h) => (
							<div
								key={'h' + h}
								className="col-span-1 row-start-1 text-center font-medium">
								{h}
							</div>
						))}
					</div>

					<div className="grid grid-rows-subgrid grid-cols-subgrid col-start-2 row-start-2 -col-end-1 row-span-full">
						{days.map((day, d) =>
							Array.from({ length: 24 }).map((_, h) => {
								const opacity = heatmapData?.[d]?.[h] ?? 0;
								return (
									<div
										key={`${d}-${h}`}
										className="col-span-1 row-span-1 w-4 h-4 mx-auto rounded-xs"
										style={{
											backgroundColor: `rgba(82,202,157,${opacity})`,
										}}
										title={`${day} ${h}:00 — Score: ${opacity.toFixed(
											2
										)}`}
									/>
								);
							})
						)}
					</div>
				</div>
			</div>
			<Separator />
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
						{
							key: 'favorites',
							label: 'Favorites',
							className: 'bg-[#ffda0c]/35 border border-[#ffda0c]/50',
							checkBoxProps: {
								className:
									'rounded-full contrast-111 border border-accent data-[state=checked]:bg-[#ffda0c] data-[state=checked]:text-white bg-[#ffda0c]/35',
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
			{/* <div className="grid auto-rows-fr w-full gap-[calc(var(--p)*2)]">
				{shorts.slice(0, 15).map((short, i) => (
					<div className="relative size-full">
						<ShortAnalytic
							key={i}
							visibleKeys={keys}
							index={i}
							{...short}
						/>
					</div>
				))}
			</div> */}
		</div>
	);
};
