<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import GithubLogo from '$lib/assets/icons/github.svelte';
	import { page } from '$app/state';
	import type { User } from '$lib/server/db/schema';
	import type { GithubUser } from '$lib/server/github/schema.js';

	const user = $derived(page.data.user as User | null);
	let { data } = $props();
</script>

<div
	class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 bg-background p-6 md:p-10"
>
	<Card.Root class="max-h-[80vh] max-w-[40vw] overflow-auto rounded-sm">
		<Card.Header class="text-center">
			<div class="flex items-start gap-4">
				<GithubLogo class="h-8 w-8" />
				<Card.Title class="font-['Press Start 2P']">GitHub</Card.Title>
			</div>
			<Card.Description class="text-justify">
				Sign in with GitHub to unleash the savage roast on your coding sins. Prepare for your
				commits to be mocked, your repos ridiculed, and your 'green wall' of empty contributions
				exposed. Are you ready to get burned? 🔥
			</Card.Description>
		</Card.Header>
		<Card.Content class="text-justify">
			<p class="mb-4 text-sm text-muted-foreground">
				We'll analyze your public GitHub data to craft the perfect, brutal roast. No mercy for bad
				code or abandoned projects!
			</p>
		</Card.Content>
		<Card.Footer class="flex flex-col items-center gap-4">
			{#if data.githubAccounts && data.githubAccounts.length > 0}
				{#each data.githubAccounts as account (account.id)}
					{@const githubData = account.sourceData.data as GithubUser}
					<div class="flex w-full items-center justify-between gap-4 rounded-md border p-2">
						<div class="flex items-center gap-2">
							<Avatar.Root class="h-8 w-8">
								<Avatar.Image src={githubData.avatar_url} alt={githubData.login} />
								<Avatar.Fallback>{githubData.login.charAt(0).toUpperCase()}</Avatar.Fallback>
							</Avatar.Root>
							<span class="font-medium">{githubData.login}</span>
						</div>
						<Button href="/github/roast/{account.id}">Use this account</Button>
					</div>
				{/each}
				<Button href="/github/login" class="flex items-center gap-2">
					<GithubLogo class="h-5 w-5" />
					Add another account
				</Button>
			{:else}
				<Button href="/github/login" class="flex items-center gap-2">
					<GithubLogo class="h-5 w-5" />
					Connect Your GitHub
				</Button>
			{/if}
		</Card.Footer>
	</Card.Root>
</div>
