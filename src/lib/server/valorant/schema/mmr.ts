import { z } from 'zod';

const AccountSchema = z.object({
	name: z.string(),
	tag: z.string()
});

const TierSchema = z.object({
	name: z.string()
});

const PeakSchema = z.object({
	tier: TierSchema
});

const CurrentSchema = z.object({
	tier: TierSchema,
	rr: z.number()
});

const SeasonalSchema = z.object({
	wins: z.number(),
	games: z.number(),
	end_tier: TierSchema
});

export const MMRResponseSchema = z.object({
	status: z.number(),
	data: z.object({
		account: AccountSchema,
		peak: PeakSchema,
		current: CurrentSchema,
		seasonal: z.array(SeasonalSchema)
	})
});

export type MMRResponse = z.infer<typeof MMRResponseSchema>;
export type MMRData = MMRResponse['data'];
