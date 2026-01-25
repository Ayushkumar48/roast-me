import { command } from '$app/server';
import { db } from '$lib/server/db';
import { roasts } from '$lib/server/db/schema';
import { z } from 'zod';

const saveRoastSchema = z.object({
	content: z.string(),
	sourceId: z.string()
});

export const saveRoast = command(saveRoastSchema, async ({ sourceId, content }) => {
	return await db
		.insert(roasts)
		.values({
			id: crypto.randomUUID(),
			sourceId,
			content,
			createdAt: new Date()
		})
		.returning();
});
