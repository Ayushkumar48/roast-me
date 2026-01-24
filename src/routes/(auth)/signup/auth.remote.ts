import { command, getRequestEvent } from '$app/server';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { signupSchema } from '$lib/client/schema';
import { user } from '$lib/server/db/schema';
import { randomUUID } from 'node:crypto';
import {
	createSession,
	generateSessionToken,
	hashPassword,
	setSessionTokenCookie
} from '$lib/server/auth';

export const signup = command(signupSchema, async (input) => {
	const event = getRequestEvent();
	try {
		const [existingUser] = await db.select().from(user).where(eq(user.username, input.username));
		if (existingUser) {
			return { error: 'Username already exists' };
		}
		const passwordHash = await hashPassword(input.password);
		const [newUser] = await db
			.insert(user)
			.values({
				id: randomUUID(),
				name: input.name,
				username: input.username,
				password: passwordHash
			})
			.returning();

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, newUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} catch (error) {
		console.error(error);
		return { error: 'Unable to create account, Internal Server Error' };
	}
});
