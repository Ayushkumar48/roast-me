import { z } from 'zod';

const TeamSchemaEnum = z.enum(['Red', 'Blue']);

const MetadataSchema = z.object({
	map: z.object({
		name: z.string()
	}),

	queue: z.object({
		name: z.string()
	})
});

const PlayerStatsSchema = z.object({
	score: z.number(),
	kills: z.number(),
	deaths: z.number(),
	assists: z.number(),
	damage: z.object({
		dealt: z.number()
	})
});

const BehaviorSchema = z.object({
	afk_rounds: z.number()
});

const PlayerSchema = z.object({
	name: z.string(),
	tag: z.string(),

	agent: z.object({
		name: z.string()
	}),

	stats: PlayerStatsSchema,

	tier: z.object({
		name: z.string()
	}),

	behavior: BehaviorSchema
});

const TeamSchema = z.object({
	team_id: TeamSchemaEnum,
	won: z.boolean(),
	rounds: z.object({
		won: z.number(),
		lost: z.number()
	})
});

const MatchSchema = z.object({
	metadata: MetadataSchema,
	players: z.array(PlayerSchema),
	teams: z.array(TeamSchema)
});

export const MatchResponseSchema = z.object({
	status: z.number(),
	data: z.array(MatchSchema)
});

export type MatchResponse = z.infer<typeof MatchResponseSchema>;
export type Match = z.infer<typeof MatchSchema>;
export type Player = z.infer<typeof PlayerSchema>;
