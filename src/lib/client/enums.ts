import Spotify from '$lib/assets/icons/spotify.svelte';
import Valorant from '$lib/assets/icons/valorant.svelte';
import Github from '$lib/assets/icons/github.svelte';
import Leetcode from '$lib/assets/icons/leetcode.svelte';

export const PLATFORMS = ['PC', 'Console'] as const;
export const REGIONS = ['eu', 'na', 'latam', 'br', 'ap', 'kr'] as const;
export const roastVariants = [
	{
		name: 'spotify',
		title: 'Spotify',
		description: 'Your music taste is so basic, even the algorithm gave up on recommendations.',
		icon: Spotify,
		gradient: 'from-green-500 to-emerald-600',
		path: '/spotify'
	},
	{
		name: 'valorant',
		title: 'Valorant',
		description: 'Your K/D ratio is lower than your chances of touching grass.',
		icon: Valorant,
		gradient: 'from-red-500 to-rose-600',
		path: '/valorant'
	},
	{
		name: 'github',
		title: 'GitHub',
		description: 'More commits to "fix typo" than actual features implemented.',
		icon: Github,
		gradient: 'from-purple-500 to-indigo-600',
		path: '/github'
	},
	{
		name: 'leetcode',
		title: 'LeetCode',
		description: 'Still solving "Two Sum" after 100 attempts? Revolutionary.',
		icon: Leetcode,
		gradient: 'from-orange-500 to-amber-600',
		path: '/leetcode'
	}
];

export const roastFor = ['spotify', 'valorant', 'github', 'leetcode'] as const;

export type Region = (typeof REGIONS)[number];
export type Platform = (typeof PLATFORMS)[number];
