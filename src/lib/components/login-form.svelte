<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { login } from '../../routes/(auth)/login/auth.remote';
	import { Loader } from './ui/loader';
	import { loginSchema } from '$lib/client/schema';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();

	let loginData = $state({
		username: '',
		password: ''
	});
	let loginLoading = $state(false);

	async function handleLogin() {
		loginLoading = true;
		const validationResult = loginSchema.safeParse(loginData);
		if (!validationResult.success) {
			toast.error(validationResult.error.issues[0].message);
			loginLoading = false;
			return;
		}
		try {
			const res = await login(loginData);
			if (res?.error) {
				toast.error(res.error);
				return;
			}
			window.location.replace('/');
		} catch (error) {
			console.error(error);
		} finally {
			loginLoading = false;
		}
	}
</script>

<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card.Root class="rounded-sm">
		<Card.Header class="text-center">
			<Card.Description>Login to your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form onsubmit={handleLogin}>
				<FieldGroup>
					<Field>
						<FieldLabel for="username">Username</FieldLabel>
						<Input
							id="username"
							type="text"
							placeholder="Enter your username"
							bind:value={loginData.username}
						/>
					</Field>
					<Field>
						<div class="flex items-center">
							<FieldLabel for="password">Password</FieldLabel>
							<a href="##" class="ms-auto text-sm underline-offset-4 hover:underline">
								Forgot your password?
							</a>
						</div>
						<Input
							id="password"
							type="password"
							placeholder="********"
							bind:value={loginData.password}
						/>
					</Field>
					<Field>
						<Button
							type="submit"
							disabled={loginLoading}
							class={cn(loginLoading && 'bg-background hover:bg-background')}
						>
							{#if loginLoading}
								<Loader />
							{:else}
								Login
							{/if}
						</Button>
						<FieldDescription class="text-center">
							Don't have an account? <a href={resolve('/signup')}>Sign up</a>
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</Card.Content>
	</Card.Root>
	<FieldDescription class="px-6 text-center">
		By clicking continue, you agree to our <a href="##">Terms of Service</a>
		and <a href="##">Privacy Policy</a>.
	</FieldDescription>
</div>
