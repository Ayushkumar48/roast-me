import { cookieNames } from '$lib/server/auth';
import { db, github } from '$lib/server/db';
import { roastSource } from '$lib/server/db/schema';
import { githubUserSchema } from '$lib/server/github/schema';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { and, eq, sql } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get(cookieNames.github) ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		console.error(e);
		return new Response(null, {
			status: 400
		});
	}
	const githubUserResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});
	const githubUser = githubUserSchema.parse(await githubUserResponse.json());
	const existingUser = await db
		.select({ id: roastSource.id })
		.from(roastSource)
		.where(
			and(
				eq(roastSource.roastFor, 'github'),
				sql<number>`
          (${roastSource.sourceData} -> 'data' ->> 'id')::int = ${githubUser.id}
        `
			)
		)
		.limit(1);
	if (existingUser.length > 0) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/github'
			}
		});
	}
	if (event.locals.user) {
		await db.insert(roastSource).values({
			id: randomUUID(),
			userId: event.locals.user.id,
			roastFor: 'github',
			sourceData: {
				type: 'github',
				data: githubUser
			}
		});
	}

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/github'
		}
	});
}
