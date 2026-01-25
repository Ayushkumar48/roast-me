<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import Copy from '@lucide/svelte/icons/copy';
	import { Separator } from '$lib/components/ui/separator';
	import {
		copyRoast,
		formatDateAndTime,
		getInitials,
		getSanitizedMarkdown,
		typewriterEffect
	} from '$lib/utils';
	import { onDestroy } from 'svelte';
	import GithubLogo from '$lib/assets/icons/github.svelte';
	import { saveRoast } from '../../../data.remote.js';
	import { Loader } from '$lib/components/ui/loader/index.js';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';

	let { data } = $props();
	let pastRoasts = $derived(data.pastRoasts);
	const githubData = $derived(
		data.githubAccount.sourceData.type === 'github' ? data.githubAccount.sourceData.data : null
	);
	let roastResult = $state('');
	let cancelTypewriter: (() => void) | null = $state(null);

	function setRoastResult(text: string) {
		roastResult = text;
	}

	function handleStartRoast() {
		if (cancelTypewriter) {
			cancelTypewriter();
			cancelTypewriter = null;
		}
		roastResult = '';
		if (data.geminiResponse) {
			cancelTypewriter = typewriterEffect(data.geminiResponse!, setRoastResult);
		}
	}

	onDestroy(() => {
		if (cancelTypewriter) {
			cancelTypewriter();
		}
	});
	let saveLoading = $state(false);
	function clearRoast() {
		if (cancelTypewriter) {
			cancelTypewriter();
			cancelTypewriter = null;
		}
		roastResult = '';
	}
</script>

<div
	class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 bg-background p-6 md:p-10"
>
	<div class="flex w-full max-w-xl flex-col gap-6">
		<Card.Root class="max-h-[80vh] overflow-auto rounded-sm">
			{#if githubData}
				<Card.Header>
					<a href={resolve('/github')} class="flex items-start gap-4">
						<GithubLogo class="h-8 w-8" />
						<Card.Title class="font-['Press Start 2P']">GitHub</Card.Title>
					</a>
					<Card.Description>So you wanted to get roasted?</Card.Description>
				</Card.Header>
				<Card.Content>
					<p class="pb-4 text-xs">Your GitHub account details:</p>
					<div class="flex items-center gap-4">
						<div>
							<Avatar.Root class="size-12">
								<Avatar.Image src={githubData.avatar_url} alt={githubData.login} />
								<Avatar.Fallback>{getInitials(githubData.login)}</Avatar.Fallback>
							</Avatar.Root>
						</div>
						<div class="space-y-1">
							<p class="font-semibold">
								{githubData.name || githubData.login}
							</p>
							<p class="text-sm text-muted-foreground">
								@{githubData.login}
							</p>
							<p class="text-sm">
								{githubData.bio || 'No bio available'}
							</p>
							<div class="flex gap-4 text-xs">
								<span>Public Repos: {githubData.public_repos || 0}</span>
								<span>Followers: {githubData.followers || 0}</span>
								<span>Following: {githubData.following || 0}</span>
							</div>
						</div>
					</div>
				</Card.Content>
				<Card.Footer class="flex justify-end gap-x-4">
					<Button type="button" onclick={handleStartRoast}>Start Roast</Button>
					<Button type="button" variant="outline" onclick={clearRoast}>Clear Roast</Button>
				</Card.Footer>
				{#if roastResult}
					<Separator />
					<div class="flex gap-2 self-end">
						<Button size="icon" onclick={() => copyRoast(roastResult)}>
							<Copy />
						</Button>
						<Button
							variant="outline"
							onclick={async () => {
								saveLoading = true;
								try {
									const [savedRoast] = await saveRoast({
										content: roastResult,
										sourceId: data.githubAccount.id
									});
									pastRoasts = [savedRoast, ...pastRoasts];
									clearRoast();
									toast.success('Roast saved successfully');
								} catch (error) {
									toast.error('Failed to save roast');
									console.error(error);
								} finally {
									saveLoading = false;
								}
							}}
							disabled={saveLoading}
						>
							{#if saveLoading}
								<Loader />
							{:else}
								Save
							{/if}
						</Button>
					</div>
					<div class="pl-4 text-justify wrap-break-word">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html await getSanitizedMarkdown(roastResult)}
					</div>
				{/if}
			{:else}
				<p class="text-sm text-muted-foreground">GitHub account data not available</p>
			{/if}
		</Card.Root>
		{#if pastRoasts && pastRoasts.length > 0}
			<Card.Root class="max-h-[80vh] overflow-auto rounded-sm">
				<Card.Header>
					<Card.Title>Past Roasts</Card.Title>
				</Card.Header>
				<Card.Content>
					<Accordion.Root type="single">
						{#each pastRoasts as roast (roast.id)}
							<Accordion.Item value={roast.id}>
								<Accordion.Trigger>
									Roast on {formatDateAndTime(roast.createdAt)}
								</Accordion.Trigger>
								<Accordion.Content>
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html await getSanitizedMarkdown(roast.content)}
								</Accordion.Content>
							</Accordion.Item>
						{/each}
					</Accordion.Root>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>
</div>
