<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { signupSchema } from '$lib/client/schema';
	import { toast } from 'svelte-sonner';
	import { signup } from '../../routes/(auth)/signup/auth.remote';
	import { Loader } from './ui/loader';
	import { resolve } from '$app/paths';

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
	let signupData = $state({
		name: '',
		username: '',
		password: '',
		confirmPassword: ''
	});
	let signupLoading = $state(false);
	async function handleSignup() {
		signupLoading = true;
		const validationResult = signupSchema.safeParse(signupData);
		if (!validationResult.success) {
			toast.error(validationResult.error.issues[0].message);
			signupLoading = false;
			return;
		}
		try {
			const res = await signup(signupData);
			if (res?.error) {
				toast.error(res.error);
			}
		} catch (error) {
			console.error(error);
		} finally {
			signupLoading = false;
			window.location.replace('/');
		}
	}
</script>

<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card.Root class="rounded-sm">
		<Card.Header class="text-center">Create Account</Card.Header>
		<Card.Content>
			<form onsubmit={handleSignup}>
				<Field.Group>
					<Field.Field>
						<Field.Label for="name">Name</Field.Label>
						<Input id="name" type="text" placeholder="John Doe" bind:value={signupData.name} />
					</Field.Field>
					<Field.Field>
						<Field.Label for="username">Username</Field.Label>
						<Input
							id="username"
							type="text"
							placeholder="john_doe"
							bind:value={signupData.username}
						/>
					</Field.Field>
					<Field.Field>
						<Field.Field class="grid grid-cols-2 gap-4">
							<Field.Field>
								<Field.Label for="password">Password</Field.Label>
								<Input
									id="password"
									type="password"
									placeholder="********"
									bind:value={signupData.password}
								/>
							</Field.Field>
							<Field.Field>
								<Field.Label for="confirm-password">Confirm Password</Field.Label>
								<Input
									id="confirm-password"
									type="password"
									placeholder="********"
									bind:value={signupData.confirmPassword}
								/>
							</Field.Field>
						</Field.Field>
						<Field.Description>Must be at least 8 characters long.</Field.Description>
					</Field.Field>
					<Field.Field>
						<Button
							type="submit"
							disabled={signupLoading}
							class={cn(signupLoading && 'bg-background hover:bg-background')}
						>
							{#if signupLoading}
								<Loader />
							{:else}
								Create Account
							{/if}
						</Button>
						<Field.Description class="text-center">
							Already have an account? <a href={resolve('/login')}>Sign in</a>
						</Field.Description>
					</Field.Field>
				</Field.Group>
			</form>
		</Card.Content>
	</Card.Root>
	<Field.Description class="px-6 text-center">
		By clicking continue, you agree to our <a href="#/">Terms of Service</a>
		and <a href="#/">Privacy Policy</a>.
	</Field.Description>
</div>
