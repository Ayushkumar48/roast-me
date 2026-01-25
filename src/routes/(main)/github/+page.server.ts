import { db } from '$lib/server/db/index.js';
import { roastSource } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function load({ locals }) {
	if (!locals.user) return;
	const githubAccounts = await db
		.select()
		.from(roastSource)
		.where(and(eq(roastSource.userId, locals.user.id), eq(roastSource.roastFor, 'github')));
	return { githubAccounts };
}
