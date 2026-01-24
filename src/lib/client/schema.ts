import z from 'zod';

export const signupSchema = z
	.object({
		name: z
			.string()
			.min(2, { error: 'Name must be at least 2 characters long' })
			.max(100, { error: 'Name must be at most 100 characters long' }),
		username: z
			.string()
			.min(2, { error: 'Username must be at least 2 characters long' })
			.max(100, { error: 'Username must be at most 100 characters long' }),
		password: z
			.string()
			.min(8, { error: 'Password must be at least 8 characters long' })
			.max(100, { error: 'Password must be at most 100 characters long' }),
		confirmPassword: z
			.string()
			.min(8, { error: 'Confirm password must be at least 8 characters long' })
			.max(100, { error: 'Confirm password must be at most 100 characters long' })
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: 'Passwords do not match',
		path: ['confirmPassword']
	});

export const loginSchema = z.object({
	username: z
		.string()
		.min(2, { error: 'Username must be at least 2 characters long' })
		.max(100, { error: 'Username must be at most 100 characters long' }),
	password: z
		.string()
		.min(8, { error: 'Password must be at least 8 characters long' })
		.max(100, { error: 'Password must be at most 100 characters long' })
});

export const valorantSchema = z.object({
	name: z.string().min(2, { error: 'Username must be at least 2 characters long' }),
	tag: z.string().min(1, { error: 'Tag must be at least 1 character long' })
});
