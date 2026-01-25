import { query } from '$app/server';
import { getGeminiResponse } from '$lib/server/utils';
import LeetCode from '@leetnotion/leetcode-api';
import { z } from 'zod';

export const leetcode = query(z.string(), async (username) => {
	const lc = new LeetCode();
	const leetcode = await lc.user(username);
	if (!leetcode.matchedUser) {
		return { error: 'User Profile Not Found' };
	}
	const geminiResponse = await getGeminiResponse(JSON.stringify(leetcode));
	return { geminiResponse, leetcodeUser: leetcode.matchedUser };
});
