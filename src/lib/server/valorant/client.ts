import { HENRIK_API_KEY, VALORANT_BASE_URL } from '$env/static/private';
import type z from 'zod';

export async function valFetch<T>(path: string, schema: z.ZodSchema<T>): Promise<T> {
	const res = await fetch(VALORANT_BASE_URL + path, {
		headers: {
			Authorization: HENRIK_API_KEY
		}
	});

	if (!res.ok) {
		throw new Error(`Valorant API error ${res.status}`);
	}

	const json = await res.json();
	return schema.parse(json);
}
