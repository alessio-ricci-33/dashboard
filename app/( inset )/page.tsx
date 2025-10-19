import { ShortAnalytic } from '@/components/short-analytic';
import { ShortType } from '@/models/schema/analytics/short';
import { Separator } from '@/ui/separator';
import apiFetch, { ApiRes } from '@/utils/api-fetch';

export const api = {
	shorts: async () => {
		const { success, ...rest }: ApiRes<ShortType[]> = await apiFetch('/history/shorts', {
			method: 'GET',
		});

		if (!success) throw new Error(rest.message);
		return rest.data;
	},
};

export default async () => {
	const shorts = await api.shorts();

	return (
		<div className="flex flex-col gap-[calc(var(--p)*2)] w-full px-p">
			<h1 className="text-2xl font-semibold leading-none">Shorts Analytics</h1>

			<div className="grid auto-rows-fr w-full gap-[calc(var(--p)*2)]">
				{shorts.map((short, index) => (
					<div className="relative size-full">
						{index > 0 && (
							<Separator
								className="absolute -top-p -left-p !w-[calc(var(--p)*2+100%)] opacity-90"
								orientation="horizontal"
							/>
						)}
						<ShortAnalytic key={index} {...short} />
					</div>
				))}
			</div>
		</div>
	);
};
