<script>
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import SignupForm from '$lib/components/signup-form.svelte';
	import { resolve } from '$app/paths';
</script>

<div
	class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 bg-background p-6 md:p-10"
>
	<div class="flex w-full max-w-xl flex-col gap-6">
		<a href={resolve('/')} class="flex items-center gap-2 self-center font-medium">
			<div
				class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
			>
				<GalleryVerticalEndIcon class="size-4" />
			</div>
			RoastMe
		</a>
		<SignupForm />
	</div>
</div>
