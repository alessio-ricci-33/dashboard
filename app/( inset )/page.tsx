'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
	Legend,
	Cell,
} from 'recharts';

type DataPoint = {
	date: string;
	time?: string;
	timestamp: number;

	views: number;
	likes: number;
	favorites: number;
	comments: number;
};

export default function Home() {
	const [shorts, setShorts] = useState<string[]>([]);
	const [selectedId, setSelectedId] = useState<string>('');
	const [data, setData] = useState<DataPoint[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetch('/api/history/shorts')
			.then(res => res.json())
			.then(res => {
				setShorts(res.data);
				console.log(res.data[0]);
				// if (res.data.length > 0) setSelectedId(res.data[0]);
			});
	}, []);

	// useEffect(() => {
	// 	if (!selectedId) return;
	// 	setLoading(true);
	// 	fetch(`/api/history/shorts/${selectedId}`)
	// 		.then(res => res.json())
	// 		.then(({ data }) => {
	// 			const formatted = data.map((d: any) => {
	// 				const date = new Date(d.timestamp);
	// 				return {
	// 					...d,
	// 					date: date.toISOString().slice(0, 16).replace('T', ' '),
	// 					time: date.toLocaleTimeString('it-IT'),
	// 				};
	// 			});

	// 			console.log(formatted);
	// 			setData(formatted);
	// 			setLoading(false);
	// 		});
	// }, [selectedId]);

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const entry = payload[0].payload;
			return (
				<div className="bg-background border rounded-lg p-2 shadow-md text-sm">
					<p className="font-semibold">{entry.date}</p>
					<p>Ora: {entry.time}</p>

					<p>
						Views: {entry.views >= 0 ? '+' : ''}
						{entry.views}
					</p>
					<p>
						Likes: {entry.likes >= 0 ? '+' : ''}
						{entry.likes}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="w-full h-[500px] space-y-4">
			<h1 className="text-2xl font-semibold">Shorts Analytics</h1>

			<div className="grid auto-rows-fr w-full gap-[calc(var(--p)*2)]">
				{shorts.map((short, index) => (
					<div
						key={index}
						className="flex flex-row justify-between items-start">
						<div className="flex flex-row h-full gap-p">
							<div className="relative h-full aspect-[9/16]">
								<Image
									className="absolute !w-auto !h-full my-auto rounded-sm object-cover"
									src={
										short.metadata.snippet.thumbnails.maxres
											.url
									}
									alt={short.metadata.snippet.title}
									fill
								/>
							</div>
							<div>
								<h4>{short.metadata.snippet.title}</h4>
								<p className="text-sm text-accent-foreground/60">
									Views:{' '}
									{short.metricsHistory.slice(-1)[0].views}
								</p>
							</div>
						</div>
						<div className="relative w-1/3 h-16">
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
										date:
											new Date(d.timestamp).getHours() +
											':' +
											new Date(
												d.timestamp
											).getMinutes(),
										...d,
									}))}>
									<XAxis
										dataKey="date"
										tick={{
											fontSize: '12px',
										}}
										height={12}
									/>

									<YAxis
										yAxisId="left"
										orientation="left"
										stroke="#82ca9d"
									/>

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
													entry.views >= 0
														? '#82ca9d'
														: '#f87171'
												} // Verde o Rosso
											/>
										))}
									</Bar>
									<Bar
										yAxisId="left"
										dataKey="comments"
										name="Comments"
										radius={[4, 4, 0, 0]}
									/>
									<Bar
										yAxisId="left"
										dataKey="likes"
										name="Like"
										fill="#8884d8"
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
