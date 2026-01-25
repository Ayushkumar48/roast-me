import { db } from '$lib/server/db/index.js';
import { roasts, roastSource } from '$lib/server/db/schema';
import { getGeminiResponse } from '$lib/server/utils.js';
import { error } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';
import { and, eq } from 'drizzle-orm';

export async function load({ locals, params }) {
	if (!locals.user) {
		error(401, 'Unauthorized, Please log in first!');
	}
	const [githubAccount] = await db
		.select({
			id: roastSource.id,
			sourceData: roastSource.sourceData
		})
		.from(roastSource)
		.where(
			and(
				eq(roastSource.roastFor, 'github'),
				eq(roastSource.userId, locals.user.id),
				eq(roastSource.id, params.githubId)
			)
		)
		.limit(1);
	if (!githubAccount) {
		error(404, 'User Profile Not Found');
	}
	const [pastRoasts, geminiResponse] = await Promise.all([
		db
			.select()
			.from(roasts)
			.where(eq(roasts.sourceId, githubAccount.id))
			.orderBy(desc(roasts.createdAt)),

		getGeminiResponse(JSON.stringify(githubAccount))
	]);
	return { geminiResponse, githubAccount, pastRoasts };
}
