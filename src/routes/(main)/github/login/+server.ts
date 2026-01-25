import { generateState } from 'arctic';

import type { RequestEvent } from '@sveltejs/kit';
import { github } from '$lib/server/db';
import { cookieNames } from '$lib/server/auth';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const scopes = ['user:email', 'read:user'];
	const url = github.createAuthorizationURL(state, scopes);

	event.cookies.set(cookieNames.github, state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}
