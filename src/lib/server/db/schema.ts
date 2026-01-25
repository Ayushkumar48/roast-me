import { jsonb, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { roastFor } from './enums';
import type { RoastSourceData } from '../schema';
export const roastForEnum = pgEnum('roast_for', roastFor);

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	username: text('username').notNull().unique(),
	password: text('password').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const roastSource = pgTable('roast_source', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	roastFor: roastForEnum().notNull(),
	sourceData: jsonb('source_data').$type<RoastSourceData>().notNull()
});

export const roasts = pgTable('roasts', {
	id: text('id').primaryKey(),
	sourceId: text('source_id')
		.notNull()
		.references(() => roastSource.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
