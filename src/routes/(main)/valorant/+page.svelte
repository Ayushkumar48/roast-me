<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Field, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Loader } from '$lib/components/ui/loader';
	import Copy from '@lucide/svelte/icons/copy';
	import { Separator } from '$lib/components/ui/separator';
	import { page } from '$app/state';
	import type { User } from '$lib/server/db/schema';
	import { cn, copyRoast, getSanitizedMarkdown, typewriterEffect } from '$lib/utils';
	import { valorantSchema } from '$lib/client/schema';
	import { toast } from 'svelte-sonner';
	import { getAccount } from './data.remote';
	import { onDestroy } from 'svelte';

	const user = $derived(page.data.user as User | null);
	let valorantData = $state({
		name: '',
		tag: ''
	});
	let valorantLoading = $state(false);
	let roastResult = $state('');
	let cancelTypewriter: (() => void) | null = $state(null);

	function setRoastResult(text: string) {
		roastResult = text;
	}

	async function handleValorantSubmit() {
		valorantLoading = true;
		if (cancelTypewriter) {
			cancelTypewriter();
			cancelTypewriter = null;
		}
		roastResult = '';

		const validationResult = valorantSchema.safeParse(valorantData);
		if (!validationResult.success) {
			toast.error(validationResult.error.issues[0].message);
			valorantLoading = false;
			return;
		}
		try {
			const res = await getAccount(valorantData);
			if (res.error || !res.content) {
				toast.error(res.error || 'Unknown error');
				return;
			}
			cancelTypewriter = typewriterEffect(res.content, setRoastResult);
		} catch (error) {
			console.error(error);
		} finally {
			valorantLoading = false;
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
		id="valorant-form"
		onsubmit={handleValorantSubmit}
	>
		<Card.Root class="max-h-[80vh] overflow-auto rounded-sm">
			<Card.Header>
				<Card.Title class="font-['Press Start 2P']">Valorant</Card.Title>
				<Card.Description>So you wanted to get roasted?</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="pb-4 text-xs">Fill your data first.</p>
				<FieldGroup>
					<Field>
						<FieldLabel for="valo-name">Name</FieldLabel>
						<Input
							id="valo-name"
							type="text"
							placeholder="Enter your name"
							bind:value={valorantData.name}
						/>
					</Field>
					<Field>
						<FieldLabel for="valo-tag">Tag</FieldLabel>
						<Input
							id="valo-tag"
							type="text"
							placeholder="Enter your tag"
							bind:value={valorantData.tag}
						/>
					</Field>
				</FieldGroup>
			</Card.Content>
			<Card.Footer class="flex justify-end gap-x-4">
				{#if user}
					<Button type="submit" disabled={valorantLoading}>Roast Me!</Button>
				{:else}
					{@render roastMe()}
				{/if}

				<Button
					type="button"
					variant="outline"
					disabled={valorantLoading}
					onclick={() => {
						if (cancelTypewriter) {
							cancelTypewriter();
							cancelTypewriter = null;
						}
						roastResult = '';
						valorantData = {
							name: '',
							tag: ''
						};
					}}
				>
					Clear Current Data
				</Button>
			</Card.Footer>
			{#if valorantLoading}
				<Separator />
				<div class="flex items-center justify-center">
					<Loader />
				</div>
			{:else if roastResult}
				<Separator />
				<Button size="icon" class="self-end" onclick={() => copyRoast(roastResult)}>
					<Copy />
				</Button>
				<div class="pl-4 text-justify wrap-break-word">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html await getSanitizedMarkdown(roastResult)}
				</div>
			{/if}
		</Card.Root>
	</form>
</div>

{#snippet roastMe()}
	<Dialog.Root>
		<Dialog.Trigger class={cn(buttonVariants({ variant: 'default' }))} type="button"
			>Roast Me!</Dialog.Trigger
		>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title class="text-sm">Data Won't be saved?</Dialog.Title>
				<Dialog.Description class="text-justify text-xs">
					You are currently not logged in. <br /> If you proceed without logging in, your data will
					not be saved. <br /> Do you want to continue without saving your data?
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="flex gap-x-4">
				<Dialog.Close
					class={cn(buttonVariants({ variant: 'outline' }))}
					type="submit"
					form="valorant-form"
					disabled={valorantLoading}
				>
					Continue Without Saving
				</Dialog.Close>
				<Button type="button" href="/login">Login</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/snippet}
