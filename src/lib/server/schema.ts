import { z } from 'zod';
import { githubUserSchema } from './github/schema';
import { AccountSchema } from './valorant/schema/account';

export const RoastSourceDataSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('github'),
		data: githubUserSchema
	}),
	z.object({
		type: z.literal('valorant'),
		data: AccountSchema
	})
]);

export type RoastSourceData = z.infer<typeof RoastSourceDataSchema>;
