import type { Platform, Region } from '$lib/client/enums';

export const endPoints = {
	account: (name: string, tag: string) => `/valorant/v2/account/${name}/${tag}`,
	matchlist: (region: Region, platform: Platform, name: string, tag: string, size = 2) =>
		`/valorant/v4/matches/${region}/${platform}/${name}/${tag}?size=${size}`,
	mmrHistory: (region: Region, platform: Platform, name: string, tag: string) =>
		`/valorant/v2/mmr-history/${region}/${platform}/${name}/${tag}`,
	mmr: (region: Region, platform: Platform, name: string, tag: string) =>
		`/valorant/v3/mmr/${region}/${platform}/${name}/${tag}`
};
