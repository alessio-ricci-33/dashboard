'use client';

import { ShortType } from '@/models/schema/analytics/short';
import { Separator } from '@/ui/separator';
import Image from 'next/image';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

export const ShortAnalytic = (short: ShortType) => {
	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const entry = payload[0].payload;
			return (
				<div className="z-99 bg-background border rounded-lg p-2 shadow-md text-sm">
					<p className="font-semibold">{entry.date}</p>
					<p className="font-semibold">Ora: {entry.hours}</p>

					<p>
						Views: {entry.views >= 0 ? '+' : ''}
						{entry.views}
					</p>
					<p>
						Likes: {entry.likes >= 0 ? '+' : ''}
						{entry.likes}
					</p>

					<p>
						Comments: {entry.comments >= 0 ? '+' : ''}
						{entry.comments}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="flex flex-row justify-between items-start size-full">
			<div className="flex flex-row h-full gap-p">
				<div className="relative h-full aspect-[9/16]">
					<Image
						className="absolute !w-auto !h-full my-auto rounded-sm object-cover"
						src={short.metadata.snippet.thumbnails.maxres.url}
						alt={short.metadata.snippet.title}
						fill
					/>
				</div>
				<div>
					<h4>{short.metadata.snippet.title}</h4>
					<p className="text-sm text-accent-foreground/60">
						Views: {short.metricsHistory.slice(-1)[0].views}
					</p>
				</div>
			</div>
			<div className="relative w-2/5 h-20">
				<ResponsiveContainer width="100%" height="100%">
					<Legend
						wrapperStyle={{
							height: 20, // Altezza totale della legenda (in px)
							fontSize: '12px', // Dimensione del testo
							lineHeight: '1em', // Altezza linea
							overflow: 'hidden', // Se vuoi troncare gli overflow
						}}
					/>

					<BarChart
						data={short.deltas.map(d => ({
							date: new Date(d.timestamp).toLocaleTimeString('it-IT', {
								month: 'short',
								weekday: 'narrow',
							}),
							hours:
								new Date(d.timestamp).getHours() +
								':' +
								new Date(d.timestamp).getMinutes(),
							...d,
						}))}>
						<XAxis
							dataKey="date"
							tick={{
								fontSize: '12px',
							}}
							height={12}
						/>

						<YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />

						<Tooltip content={<CustomTooltip />} />

						<Bar
							yAxisId="left"
							dataKey="views"
							name="Δ Rispetto Barra Precedente"
							radius={[4, 4, 0, 0]}>
							{short.deltas.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={
										entry.views >= 0 ? '#82ca9d' : '#f87171'
									} // Verde o Rosso
								/>
							))}
						</Bar>

						<Bar
							dataKey="likes"
							name="Like"
							fill="#fc365f"
							radius={[4, 4, 0, 0]}
						/>

						<Bar
							dataKey="comments"
							name="Comments"
							fill="#3ea6ff"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
