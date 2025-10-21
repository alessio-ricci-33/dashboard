'use server';

import { ShortType } from '@/models/schema/analytics/short';
import apiFetch, { ApiRes } from '@/utils/api-fetch';

export const getAll = async () => {
	const { success, ...rest }: ApiRes<ShortType[]> = await apiFetch('/history/shorts', {
		method: 'GET',
	});

	if (!success) throw new Error(rest.message);
	return rest.data.slice(0, 60);
};
