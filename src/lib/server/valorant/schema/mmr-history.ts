import { z } from 'zod';

const AccountSchema = z.object({
	name: z.string(),
	tag: z.string()
});

const TierSchema = z.object({
	name: z.string()
});

const HistoryEntrySchema = z.object({
	match_id: z.string(),
	date: z.string(),

	map: z.object({
		name: z.string()
	}),

	tier: TierSchema,

	rr: z.number(),
	last_change: z.number(),
	elo: z.number()
});

export const MMRHistoryResponseSchema = z.object({
	status: z.number(),
	data: z.object({
		account: AccountSchema,
		history: z.array(HistoryEntrySchema)
	})
});

export type MMRHistoryResponse = z.infer<typeof MMRHistoryResponseSchema>;
export type MMRHistoryEntry = z.infer<typeof HistoryEntrySchema>;
