<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Field, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Loader } from '$lib/components/ui/loader';
	import Copy from '@lucide/svelte/icons/copy';
	import { Separator } from '$lib/components/ui/separator';
	import { copyRoast, getSanitizedMarkdown, typewriterEffect } from '$lib/utils';
	import { leetcodeSchema } from '$lib/client/schema';
	import { toast } from 'svelte-sonner';
	import { leetcode } from './data.remote';
	import { onDestroy } from 'svelte';
	import type { MatchedUser } from '@leetnotion/leetcode-api';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Leetcode from '$lib/assets/icons/leetcode.svelte';

	let leetcodeData = $state({
		username: ''
	});
	let leetcodeLoading = $state(false);
	let roastResult = $state('');
	let profile: MatchedUser | null = $state(null);
	let cancelTypewriter: (() => void) | null = $state(null);

	function setRoastResult(text: string) {
		roastResult = text;
	}

	async function handleLeetCodeSubmit() {
		leetcodeLoading = true;
		if (cancelTypewriter) {
			cancelTypewriter();
			cancelTypewriter = null;
		}
		roastResult = '';
		profile = null;

		const validationResult = leetcodeSchema.safeParse(leetcodeData);
		if (!validationResult.success) {
			toast.error(validationResult.error.issues[0].message);
			leetcodeLoading = false;
			return;
		}
		try {
			const res = await leetcode(leetcodeData.username);
			if (res.error || !res.geminiResponse) {
				toast.error(res.error || 'Unknown error');
				return;
			}
			profile = res.leetcodeUser;
			cancelTypewriter = typewriterEffect(res.geminiResponse, setRoastResult);
		} catch (error) {
			console.error(error);
			toast.error('An error occurred');
		} finally {
			leetcodeLoading = false;
		}
	}

	onDestroy(() => {
		if (cancelTypewriter) {
			cancelTypewriter();
		}
	});
</script>

<div
	class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 bg-background p-6 md:p-10"
>
	<form
		class="flex w-full max-w-xl flex-col gap-6"
		id="leetcode-form"
		onsubmit={handleLeetCodeSubmit}
	>
		<Card.Root class="max-h-[80vh] overflow-auto rounded-sm">
			<Card.Header>
				<div class="flex items-start gap-4">
					<Leetcode class="h-8 w-8" />
					<Card.Title class="font-['Press Start 2P']">LeetCode</Card.Title>
				</div>
				<Card.Description>So you wanted to get roasted?</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="pb-4 text-xs">Fill your data first.</p>
				<FieldGroup>
					<Field>
						<FieldLabel for="leetcode-username">Username</FieldLabel>
						<Input
							id="leetcode-username"
							type="text"
							placeholder="Enter your LeetCode username"
							bind:value={leetcodeData.username}
						/>
					</Field>
				</FieldGroup>
			</Card.Content>
			<Card.Footer class="flex justify-end gap-x-4">
				<Button type="submit" disabled={leetcodeLoading}>Roast Me!</Button>

				<Button
					type="button"
					variant="outline"
					disabled={leetcodeLoading}
					onclick={() => {
						if (cancelTypewriter) {
							cancelTypewriter();
							cancelTypewriter = null;
						}
						roastResult = '';
						profile = null;
						leetcodeData = {
							username: ''
						};
					}}
				>
					Clear Current Data
				</Button>
			</Card.Footer>
			{#if profile}
				<Separator />
				<Card.Content>
					<h3 class="text-lg font-semibold">Profile</h3>
					<div class="mb-4 flex items-center gap-4">
						<Avatar.Root class="h-16 w-16">
							<Avatar.Image src={profile.profile?.userAvatar} alt="Avatar" />
							<Avatar.Fallback>{profile.username.charAt(0).toUpperCase()}</Avatar.Fallback>
						</Avatar.Root>
						<div>
							<p><strong>Username:</strong> {profile.username}</p>
							<p><strong>Real Name:</strong> {profile.profile?.realName || 'Not provided'}</p>
						</div>
					</div>
					<p><strong>About:</strong> {profile.profile?.aboutMe || 'Not provided'}</p>
				</Card.Content>
			{/if}
			{#if leetcodeLoading}
				<Separator />
				<div class="flex items-center justify-center">
					<Loader />
				</div>
			{:else if roastResult}
				<Separator />
				<div class="flex gap-2 self-end">
					<Button size="icon" onclick={() => copyRoast(roastResult)}>
						<Copy />
					</Button>
				</div>
				<div class="pl-4 text-justify wrap-break-word">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html await getSanitizedMarkdown(roastResult)}
				</div>
			{/if}
		</Card.Root>
	</form>
</div>
