'use client';

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
} from 'recharts';

type DataPoint = {
	date: string;
	timestamp: number;
	count: number;
	delta: number;
	time?: string;
};

export default function Home() {
	const [videoIds, setVideoIds] = useState<string[]>([]);
	const [selectedId, setSelectedId] = useState<string>('');
	const [data, setData] = useState<DataPoint[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetch('/api/history/shorts')
			.then(res => res.json())
			.then(res => {
				setVideoIds(res.data);
				if (res.data.length > 0) setSelectedId(res.data[0]);
			});
	}, []);

	useEffect(() => {
		if (!selectedId) return;
		setLoading(true);
		fetch(`/api/history/shorts/${selectedId}`)
			.then(res => res.json())
			.then(({ data }) => {
				const formatted = data.map((d: any) => {
					const date = new Date(d.timestamp);
					return {
						...d,
						date: date.toISOString().slice(0, 16).replace('T', ' '),
						time: date.toLocaleTimeString('it-IT'),
					};
				});

				console.log(formatted);
				setData(formatted);
				setLoading(false);
			});
	}, [selectedId]);

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const entry = payload[0].payload;
			return (
				<div className="bg-background border rounded-lg p-2 shadow-md text-sm">
					<p className="font-semibold">{entry.date}</p>
					<p>Ora: {entry.time}</p>
					<p>Views totali: {entry.count}</p>
					<p>
						Incremento: {entry.delta >= 0 ? '+' : ''}
						{entry.delta}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="w-full h-[500px] p-6 space-y-4">
			<h1 className="text-2xl font-semibold">Shorts Analytics</h1>

			<div className="flex items-center gap-3">
				<label className="text-sm font-medium">Video ID:</label>
				<select
					value={selectedId}
					onChange={e => setSelectedId(e.target.value)}
					className="border rounded-lg p-2 bg-background">
					{videoIds.map(id => (
						<option key={id} value={id}>
							{id}
						</option>
					))}
				</select>
			</div>

			<div className="w-full h-[400px]">
				{loading ? (
					<div className="text-center mt-10 text-gray-500">
						Caricamento dati...
					</div>
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={data}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis yAxisId="left" stroke="#8884d8" />
							<YAxis
								yAxisId="right"
								orientation="right"
								stroke="#82ca9d"
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend />
							<Bar
								yAxisId="left"
								dataKey="count"
								name="Views Totali"
								fill="#8884d8"
								radius={[4, 4, 0, 0]}
							/>
							<Bar
								yAxisId="right"
								dataKey="delta"
								name="Δ Rispetto Barra Precedente"
								fill="#82ca9d"
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
}
