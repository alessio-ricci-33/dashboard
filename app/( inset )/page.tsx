'use client';
import { useEffect, useMemo, useState } from 'react';
import { Separator } from '@/ui/separator';
import { ShortAnalytic } from '@/components/short-analytic';
import { Checkbox } from '@/ui/checkbox';

import { Label } from '@/ui/label';
import { cn } from '@/utils/shadcn';
import { usePersistentState } from '@/hooks/usePersistentState';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import SliceInput from '@/components/SliceInput';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';

// import shorts_list from '@/constants/shorts.json';

export default () => {
	const [shorts, setShorts] = useState([]),
		[type, SetType] = usePersistentState<'trend' | 'avg'>('heatmap-type', 'trend', 'local'),
		[sliceCount, setSliceCount] = usePersistentState('heatmap-slice-count', 28, 'local'),
		[keys, setKeys] = usePersistentState('visible-keys', ['views'], 'local');

	useEffect(() => {
		fetch('/api/history/shorts', {
			method: 'GET',
			credentials: 'include',
			cache: 'no-store',
		})
			.then(r => r.json())
			.then(({ data }) => {
				console.log(data);
				setShorts(data);
			});
	}, []);

	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const heatmap = useMemo(() => {
		if (!shorts.length)
			return {
				deltaAvg: new Map(),
				deltaTrend: new Map(),
				maxTrend: 0,
				trend: new Map(),
				maxAvg: 0,
				avg: new Map(),
			};

		const trendMatrix = new Map(days.map(day => [day, Array(24).fill(0) as number[]])),
			avgMatrix = new Map(days.map(day => [day, Array(24).fill(0) as number[]]));

		shorts.slice(0, sliceCount).forEach((short, i) => {
			// const publishDate = new Date(short.metadata.snippet.publishedAt);
			// const ageDays = Math.max((now - publishDate) / (1000 * 60 * 60 * 24), 1);
			// const weight = 1 / ageDays;
			const weight = sliceCount - i;

			short.metricsHistory.forEach(metrics => {
				const date = new Date(metrics.timestamp);
				const day = date.toLocaleDateString('en-US', { weekday: 'short' });
				const hour = date.getHours();

				const performance =
					(metrics.views || 0) * 1 +
					(metrics.likes || 0) * 0 +
					(metrics.comments || 0) * 0;

				trendMatrix.get(day)![hour] += performance * weight;
				avgMatrix.get(day)![hour] += performance;
			});
		});

		const maxTrend = Math.max(...Array.from(trendMatrix.values()).flat()),
			maxAvg = Math.max(...Array.from(avgMatrix.values()).flat());
		const round = (num: number, step: number) => Math.round(num * step) / step;

		const deltaTrend = new Map(
				Array.from(trendMatrix).map(([day, scores]) => [
					day,
					scores.map((score, i) =>
						Math.max(
							-1,
							Math.min(
								1,
								round(score / maxTrend, 5) -
									round(avgMatrix.get(day)![i] / maxAvg, 10)
							)
						)
					),
				])
			),
			deltaAvg = new Map(
				Array.from(avgMatrix).map(([day, scores]) => [
					day,
					scores.map((score, i) =>
						Math.max(
							-1,
							Math.min(
								1,
								Math.min(
									1,
									round(score / maxAvg, 3) -
										round(
											trendMatrix.get(day)![i] /
												maxTrend,
											7
										)
								)
							)
						)
					),
				])
			),
			maxDeltaTrend = Math.max(
				...Array.from(deltaTrend.values())
					.flat()
					.map(score => Math.abs(score))
			),
			maxDeltaAvg = Math.max(
				...Array.from(deltaAvg.values())
					.flat()
					.map(score => Math.abs(score))
			),
			totDeltaTrend = deltaTrend
				.values()
				.reduce(
					(total, scores) =>
						total + scores.reduce((tot, score) => tot + Math.abs(score), 0),
					0
				),
			totDeltaAvg = deltaAvg
				.values()
				.reduce(
					(total, scores) =>
						total + scores.reduce((tot, score) => tot + Math.abs(score), 0),
					0
				);

		const trend = new Map(
				Array.from(trendMatrix).map(([day, scores]) => [
					day,
					scores.map(score =>
						Math.max(
							0,
							Math.min(1, Math.round((score / maxTrend) * 10) / 10)
						)
					),
				])
			),
			totTrend = trend
				.values()
				.reduce(
					(total, scores) =>
						total + scores.reduce((tot, score) => tot + score, 0),
					0
				),
			avg = new Map(
				Array.from(avgMatrix).map(([day, scores]) => [
					day,
					scores.map(score =>
						Math.max(0, Math.min(1, Math.round((score / maxAvg) * 10) / 10))
					),
				])
			),
			totAvg = avg
				.values()
				.reduce(
					(total, scores) =>
						total + scores.reduce((tot, score) => tot + score, 0),
					0
				);
		return {
			maxDeltaTrend,
			totDeltaTrend,
			deltaTrend,
			maxTrend,
			totTrend,
			trend,
			maxDeltaAvg,
			totDeltaAvg,
			deltaAvg,
			maxAvg,
			totAvg,
			avg,
		};
	}, [shorts, sliceCount]);

	return (
		<div className="flex flex-col gap-5 w-full px-p mb-40">
			{/* --- HEATMAP --- */}
			{/* <div className="flex flex-col justify-start items-start gap-2.5">
				<h2 className="text-lg font-semibold">Week projection</h2>
				<div className="flex flex-row justify-between items-center gap-p w-full">
					{Array.from({ length: 7 }).map((_, i) => (
						<div
							key={i}
							className="h-24 rounded-md aspect-square bg-green-400 text-center text-sm font-semibold">
							{days[i]}
						</div>
					))}
				</div>
			</div>
			<Separator
				className="[mask-image:radial-gradient(50%_50%_at_center,white,transparent)]"
				orientation="orizontal"
			/> */}

			<div className="w-full flex flex-col gap-2 pb-3">
				<Tabs
					style={{
						'--color': '36,164,242',
						'--negative': '252,54,95',
						'--positive': '130,202,157',
					}}
					onValueChange={tabValue => SetType(tabValue)}
					value={type}
					className="shrink w-full">
					<div className="relative flex flex-row justify-start items-center gap-2.5 w-full">
						<h2 className="text-lg font-semibold">Heatmap</h2>
						{/* 🔢 Input per numero di shorts da considerare */}
						<div className="shrink-0 flex items-center gap-2 text-sm text-foreground/85">
							<p className="text-foreground/60">/</p>
							Based on latest
							<SliceInput
								defaultValue={sliceCount}
								validShorts={shorts}
								onHeavyProcess={setSliceCount}
								className="inline mx-1 !size-fit !p-0 file:!w-fit border rounded-md text-center text-xs bg-transparent border-border"
							/>
							shorts
						</div>
						<TabsList className="absolute mx-auto inset-x-0 w-fit">
							<TabsTrigger value="trend">Trend</TabsTrigger>
							<TabsTrigger value="avg">Avg</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="trend">
						<div className="grid grid-cols-[1fr_1px_1fr] gap-p overflow-hidden w-full">
							<div className="grid grid-cols-28 grid-rows-8 gap-1 text-[10px] grid-flow-col col-span-1 size-full">
								<div className="grid grid-rows-subgrid grid-cols-1 row-span-full col-span-1 col-start-1 row-start-2 -row-end-1 size-full opacity-85">
									{days.map(day => (
										<div
											key={'day' + day}
											className="row-span-1 size-full text-left font-medium text-[.62rem] leading-none flex flex-col justify-center items-start aspect-square">
											{day}
										</div>
									))}
								</div>

								<div className="grid grid-rows-subgrid grid-cols-3 row-span-full col-span-3 col-start-2 row-start-1 -row-end-1 size-full gap-[inherit]">
									<div
										key={'TOTAL'}
										className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
										T. %
									</div>
									<div
										key={'MIN'}
										className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
										Max
									</div>
									<div
										key={'MAX'}
										className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
										Min
									</div>

									{heatmap.trend.values().map(scores => {
										const percent =
												scores.reduce(
													(total, score) =>
														total + score,

													0
												) / heatmap.totTrend,
											min =
												Math.min(...scores) /
												heatmap.totTrend,
											max =
												Math.max(...scores) /
												heatmap.totTrend;

										return (
											<>
												<div
													className="col-span-1 row-span-1 size-full rounded-xs text-[.67rem] text-center font-bold leading-none flex justify-center items-center aspect-square"
													style={{
														backgroundColor: `rgba(var(--color),${percent})`,
													}}>
													{Math.round(
														percent * 100
													).toFixed(0)}
												</div>
												<div
													className="col-span-1 row-span-1 size-full rounded-xs text-[.67rem] text-center font-bold leading-none flex justify-center items-center aspect-square"
													style={{
														backgroundColor: `rgba(var(--color),${percent})`,
													}}>
													{(max * 100).toFixed(
														0
													)}
												</div>
												<div
													className="col-span-1 row-span-1 size-full rounded-xs text-[.67rem] text-center font-bold leading-none flex justify-center items-center aspect-square"
													style={{
														backgroundColor: `rgba(var(--color),${percent})`,
													}}>
													{(min * 100).toFixed(
														0
													)}
												</div>
											</>
										);
									})}
								</div>
								<div className="grid grid-cols-subgrid grid-rows-1 col-start-5 -col-end-1 row-span-1 row-start-1 size-full grid-flow-col opacity-85">
									{Array.from({ length: 18 }).map((_, h) => (
										<div
											key={'h' + h + 7}
											className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
											{h + 7}
										</div>
									))}
									{Array.from({ length: 6 }).map((_, h) => (
										<div
											key={'h' + h + 1}
											className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
											{h + 1}
										</div>
									))}
								</div>

								<div className="grid grid-rows-subgrid grid-cols-subgrid col-start-5 row-start-2 -col-end-1 row-span-full">
									{heatmap.trend
										.entries()
										.map(([day, scores]) =>
											[
												...scores
													.slice(7)
													.map((score, i) => ({
														score,
														hour: i + 7,
													})),
												...scores
													.slice(0, 7)
													.map((score, i) => ({
														score,
														hour: i + 1,
													})),
											].map(({ score, hour }) => {
												return (
													<div
														key={`trend-${day}-${hour}`}
														className="col-span-1 row-span-1 size-full mx-auto rounded-xs"
														style={{
															backgroundColor: `rgba(var(--color),${score})`,
														}}
														title={`${day} ${hour}:00 — Score: ${score.toFixed(
															2
														)}`}
													/>
												);
											})
										)}
								</div>
							</div>
							<Separator
								className="[mask-image:radial-gradient(50%_50%_at_center,white,transparent)]"
								orientation="vertical"
							/>
							<div className="grid grid-cols-27 grid-rows-8 gap-1 text-[10px] grid-flow-col col-span-1 size-full mr-auto">
								<div className="grid grid-rows-subgrid grid-cols-3 row-span-full col-span-3 col-start-1 row-start-1 -row-end-1 size-full gap-[inherit]">
									<div
										key={'TOTAL'}
										className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
										T. %
									</div>
									<div
										key={'MIN'}
										className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
										Max
									</div>
									<div
										key={'MAX'}
										className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
										Min
									</div>

									{heatmap.deltaTrend.values().map(scores => {
										let delta = 0;
										const percent =
												scores.reduce(
													(total, score) => {
														delta += score;
														return (
															total +
															Math.abs(
																score
															)
														);
													},
													0
												) / heatmap.totDeltaTrend,
											min =
												Math.min(...scores) /
												heatmap.totDeltaTrend,
											max =
												Math.max(...scores) /
												heatmap.totDeltaTrend;

										return (
											<>
												<div
													className="col-span-1 row-span-1 size-full rounded-xs text-[.67rem] text-center font-bold leading-none flex justify-center items-center aspect-square"
													style={{
														backgroundColor: `rgba(var(--${
															delta < 0
																? 'negative'
																: 'positive'
														}),${percent})`,
													}}>
													{Math.round(
														percent *
															(delta < 0
																? -100
																: 100)
													).toFixed(0)}
												</div>
												<div
													className="col-span-1 row-span-1 size-full rounded-xs text-[.67rem] text-center font-bold leading-none flex justify-center items-center aspect-square"
													style={{
														backgroundColor: `rgba(var(--${
															max < 0
																? 'negative'
																: 'positive'
														}),${percent})`,
													}}>
													{(max * 100).toFixed(
														0
													)}
												</div>
												<div
													className="col-span-1 row-span-1 size-full rounded-xs text-[.67rem] text-center font-bold leading-none flex justify-center items-center aspect-square"
													style={{
														backgroundColor: `rgba(var(--${
															min < 0
																? 'negative'
																: 'positive'
														}),${percent})`,
													}}>
													{(min * 100).toFixed(
														0
													)}
												</div>
											</>
										);
									})}
								</div>
								<div className="grid grid-cols-subgrid grid-rows-1 col-start-4 -col-end-1 row-span-1 row-start-1 size-full grid-flow-col opacity-85">
									{Array.from({ length: 18 }).map((_, h) => (
										<div
											key={'h' + h + 7}
											className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
											{h + 7}
										</div>
									))}
									{Array.from({ length: 6 }).map((_, h) => (
										<div
											key={'h' + h + 1}
											className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
											{h + 1}
										</div>
									))}
								</div>

								<div className="grid grid-rows-subgrid grid-cols-subgrid col-start-4 row-start-2 -col-end-1 row-span-full">
									{heatmap.deltaTrend
										.entries()
										.map(([day, scores]) =>
											[
												...scores
													.slice(7)
													.map((score, i) => ({
														score,
														hour: i + 7,
													})),
												...scores
													.slice(0, 7)
													.map((score, i) => ({
														score,
														hour: i + 1,
													})),
											].map(({ score, hour }) => {
												const opacity = Math.abs(
													score /
														heatmap.maxDeltaTrend
												);
												return (
													<div
														key={`avg-${day}-${hour}`}
														className="col-span-1 row-span-1 size-full mx-auto rounded-xs"
														style={{
															backgroundColor: `rgba(var(--${
																score <
																0
																	? 'negative'
																	: 'positive'
															}),${opacity})`,
														}}
														title={`${day} ${hour}:00 — Score: ${score.toFixed(
															2
														)}`}
													/>
												);
											})
										)}
								</div>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="avg">
						<div className="grid grid-cols-[1fr_1px_1fr] gap-p overflow-hidden w-full">
							<div className="grid grid-cols-28 grid-rows-8 gap-1 text-[10px] grid-flow-col col-span-1 size-full">
								<div className="grid grid-rows-subgrid grid-cols-1 row-span-full col-span-1 col-start-1 row-start-2 -row-end-1 size-full opacity-85">
									{days.map(day => (
										<div
											key={'day' + day}
											className="row-span-1 size-full text-left font-medium text-[.62rem] leading-none flex flex-col justify-center items-start aspect-square">
											{day}
										</div>
									))}
								</div>

								<div className="grid grid-rows-subgrid grid-cols-3 row-span-full col-span-3 col-start-2 row-start-1 -row-end-1 size-full gap-[inherit]">
									<div
										key={'TOTAL'}
										className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
										T. %
									</div>
									<div
										key={'MIN'}
										className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
										Max
									</div>
									<div
										key={'MAX'}
										className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
										Min
									</div>

									{heatmap.avg.values().map(scores => {
										const percent =
												scores.reduce(
													(total, score) =>
														total + score,
													0
												) / heatmap.totAvg,
											min =
												Math.min(...scores) /
												heatmap.totAvg,
											max =
												Math.max(...scores) /
												heatmap.totAvg;

										return (
											<>
												<div
													className="col-span-1 row-span-1 size-full rounded-xs text-[.67rem] text-center font-bold leading-none flex justify-center items-center aspect-square"
													style={{
														backgroundColor: `rgba(var(--color),${percent})`,
													}}>
													{Math.round(
														percent * 100
													).toFixed(0)}
												</div>
												<div
													className="col-span-1 row-span-1 size-full rounded-xs text-[.67rem] text-center font-bold leading-none flex justify-center items-center aspect-square"
													style={{
														backgroundColor: `rgba(var(--color),${percent})`,
													}}>
													{(max * 100).toFixed(
														0
													)}
												</div>
												<div
													className="col-span-1 row-span-1 size-full rounded-xs text-[.67rem] text-center font-bold leading-none flex justify-center items-center aspect-square"
													style={{
														backgroundColor: `rgba(var(--color),${percent})`,
													}}>
													{(min * 100).toFixed(
														0
													)}
												</div>
											</>
										);
									})}
								</div>
								<div className="grid grid-cols-subgrid grid-rows-1 col-start-5 -col-end-1 row-span-1 row-start-1 size-full grid-flow-col opacity-85">
									{Array.from({ length: 18 }).map((_, h) => (
										<div
											key={'h' + h + 7}
											className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
											{h + 7}
										</div>
									))}
									{Array.from({ length: 6 }).map((_, h) => (
										<div
											key={'h' + h + 1}
											className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
											{h + 1}
										</div>
									))}
								</div>

								<div className="grid grid-rows-subgrid grid-cols-subgrid col-start-5 row-start-2 -col-end-1 row-span-full">
									{heatmap.avg.entries().map(([day, scores]) =>
										[
											...scores
												.slice(7)
												.map((score, i) => ({
													score,
													hour: i + 7,
												})),
											...scores
												.slice(0, 7)
												.map((score, i) => ({
													score,
													hour: i + 1,
												})),
										].map(({ score, hour }) => {
											return (
												<div
													key={`trend-${day}-${hour}`}
													className="col-span-1 row-span-1 size-full mx-auto rounded-xs"
													style={{
														backgroundColor: `rgba(var(--color),${score})`,
													}}
													title={`${day} ${hour}:00 — Score: ${score.toFixed(
														2
													)}`}
												/>
											);
										})
									)}
								</div>
							</div>
							<Separator
								className="[mask-image:radial-gradient(50%_50%_at_center,white,transparent)]"
								orientation="vertical"
							/>
							<div className="grid grid-cols-27 grid-rows-8 gap-1 text-[10px] grid-flow-col col-span-1 size-full mr-auto">
								<div className="grid grid-rows-subgrid grid-cols-3 row-span-full col-span-3 col-start-1 row-start-1 -row-end-1 size-full gap-[inherit]">
									<div
										key={'TOTAL'}
										className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
										T. %
									</div>
									<div
										key={'MIN'}
										className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
										Max
									</div>
									<div
										key={'MAX'}
										className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
										Min
									</div>

									{heatmap.deltaAvg.values().map(scores => {
										let delta = 0;
										const percent =
												scores.reduce(
													(total, score) => {
														delta += score;
														return (
															total +
															Math.abs(
																score
															)
														);
													},
													0
												) / heatmap.totDeltaAvg,
											min =
												Math.min(...scores) /
												heatmap.totDeltaAvg,
											max =
												Math.max(...scores) /
												heatmap.totDeltaAvg;

										return (
											<>
												<div
													className="col-span-1 row-span-1 size-full rounded-xs text-[.67rem] text-center font-bold leading-none flex justify-center items-center aspect-square"
													style={{
														backgroundColor: `rgba(var(--${
															delta < 0
																? 'negative'
																: 'positive'
														}),${percent})`,
													}}>
													{Math.round(
														percent *
															(delta < 0
																? -100
																: 100)
													).toFixed(0)}
												</div>
												<div
													className="col-span-1 row-span-1 size-full rounded-xs text-[.67rem] text-center font-bold leading-none flex justify-center items-center aspect-square"
													style={{
														backgroundColor: `rgba(var(--${
															max < 0
																? 'negative'
																: 'positive'
														}),${percent})`,
													}}>
													{(max * 100).toFixed(
														0
													)}
												</div>
												<div
													className="col-span-1 row-span-1 size-full rounded-xs text-[.67rem] text-center font-bold leading-none flex justify-center items-center aspect-square"
													style={{
														backgroundColor: `rgba(var(--${
															min < 0
																? 'negative'
																: 'positive'
														}),${percent})`,
													}}>
													{(min * 100).toFixed(
														0
													)}
												</div>
											</>
										);
									})}
								</div>
								<div className="grid grid-cols-subgrid grid-rows-1 col-start-4 -col-end-1 row-span-1 row-start-1 size-full grid-flow-col opacity-85">
									{Array.from({ length: 18 }).map((_, h) => (
										<div
											key={'h' + h + 7}
											className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
											{h + 7}
										</div>
									))}
									{Array.from({ length: 6 }).map((_, h) => (
										<div
											key={'h' + h + 1}
											className="col-span-1 row-start-1 text-center font-medium text-[.67rem] flex flex-col justify-center items-center aspect-square">
											{h + 1}
										</div>
									))}
								</div>

								<div className="grid grid-rows-subgrid grid-cols-subgrid col-start-4 row-start-2 -col-end-1 row-span-full">
									{heatmap.deltaAvg
										.entries()
										.map(([day, scores]) =>
											[
												...scores
													.slice(7)
													.map((score, i) => ({
														score,
														hour: i + 7,
													})),
												...scores
													.slice(0, 7)
													.map((score, i) => ({
														score,
														hour: i + 1,
													})),
											].map(({ score, hour }) => {
												const opacity = Math.abs(
													score /
														heatmap.maxDeltaAvg
												);
												return (
													<div
														key={`avg-${day}-${hour}`}
														className="col-span-1 row-span-1 size-full mx-auto rounded-xs"
														style={{
															backgroundColor: `rgba(var(--${
																score <
																0
																	? 'negative'
																	: 'positive'
															}),${opacity})`,
														}}
														title={`${day} ${hour}:00 — Score: ${score.toFixed(
															2
														)}`}
													/>
												);
											})
										)}
								</div>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
			<Separator className="[mask-image:radial-gradient(50%_50%_at_center,white,transparent)]" />
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
			<div className="grid auto-rows-fr w-full gap-[calc(var(--p)*2)]">
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
			</div>
		</div>
	);
};
