import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { GoogleGenAI } from '@google/genai/node';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!env.GEMINI_API_KEY) {
	throw new Error('GEMINI_API_KEY is not set');
}

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });
export const gemini = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
