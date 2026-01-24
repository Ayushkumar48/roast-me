import { query } from '$app/server';
import type { Platform, Region } from '$lib/client/enums';
import { valorantSchema } from '$lib/client/schema';
import { getGeminiResponse } from '$lib/server/utils';
import { valFetch } from '$lib/server/valorant/client';
import { endPoints } from '$lib/server/valorant/endpoints';
import { AccountResponseSchema } from '$lib/server/valorant/schema/account';
import { MatchResponseSchema } from '$lib/server/valorant/schema/matchlist';
import { MMRResponseSchema } from '$lib/server/valorant/schema/mmr';
import { MMRHistoryResponseSchema } from '$lib/server/valorant/schema/mmr-history';

export const getAccount = query(valorantSchema, async ({ name, tag }) => {
	const account = await valFetch(endPoints.account(name, tag), AccountResponseSchema);

	const platform = account.data.platforms[0] as Platform;
	const region = account.data.region as Region;
	if (!platform || !region) return { error: 'OOPS!, Account not found' };

	const [matchList, mmr, mmrHistory] = await Promise.all([
		valFetch(endPoints.matchlist(region, platform, name, tag), MatchResponseSchema),
		valFetch(endPoints.mmr(region, platform, name, tag), MMRResponseSchema),
		valFetch(endPoints.mmrHistory(region, platform, name, tag), MMRHistoryResponseSchema)
	]);
	const geminiResponse = await getGeminiResponse(
		JSON.stringify({ account, matchList, mmr, mmrHistory })
	);

	return { content: geminiResponse };
});
