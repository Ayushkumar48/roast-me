import { command, getRequestEvent } from '$app/server';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { loginSchema } from '$lib/client/schema';
import { user } from '$lib/server/db/schema';
import {
	createSession,
	deleteSessionTokenCookie,
	generateSessionToken,
	invalidateSession,
	setSessionTokenCookie,
	verifyPassword
} from '$lib/server/auth';

export const login = command(loginSchema, async (input) => {
	const event = getRequestEvent();
	try {
		const [existingUser] = await db.select().from(user).where(eq(user.username, input.username));
		if (!existingUser) {
			return { error: 'Username does not exist' };
		}
		if (!verifyPassword(input.password, existingUser.password)) {
			return { error: 'Invalid credentials' };
		}
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} catch (error) {
		console.error(error);
		return { error: 'Unable to create account, Internal Server Error' };
	}
});

export const logout = command(async () => {
	const event = getRequestEvent();
	if (event.locals.session) {
		try {
			await invalidateSession(event.locals.session.id);
			deleteSessionTokenCookie(event);
		} catch (error) {
			console.error(error);
		} finally {
			deleteSessionTokenCookie(event);
		}
	}
});
