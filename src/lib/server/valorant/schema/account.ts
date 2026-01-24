import { PLATFORMS, REGIONS } from '$lib/client/enums';
import { z } from 'zod';

export const AccountSchema = z.object({
	puuid: z.string(),
	region: z.enum(REGIONS),
	account_level: z.number().int().nonnegative(),
	name: z.string(),
	tag: z.string(),
	card: z.string(),
	title: z.string(),
	platforms: z.array(z.enum(PLATFORMS)),
	updated_at: z.iso.datetime()
});

export const AccountResponseSchema = z.object({
	status: z.number(),
	data: AccountSchema
});

export type AccountResponse = z.infer<typeof AccountResponseSchema>;
export type Account = z.infer<typeof AccountSchema>;
