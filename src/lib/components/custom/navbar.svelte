<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import User from '@lucide/svelte/icons/user';
	import LogOut from '@lucide/svelte/icons/log-out';
	import DarkModeToggler from './dark-mode-toggler.svelte';
	import { resolve } from '$app/paths';
	import { logout } from '../../../routes/(auth)/login/auth.remote';
	import { page } from '$app/state';
	import type { User as UserType } from '$lib/server/db/schema';

	let menuOpen = $state(false);
	const user = $derived(page.data.user as UserType | null);
</script>

<header
	class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
>
	<div class="container mx-auto flex h-14 items-center">
		<div class="mr-4 flex">
			<a href={resolve('/')} class="mr-6 flex items-center space-x-2">
				<span class="font-bold">Roast Me</span>
			</a>
		</div>
		<div class="flex flex-1 items-center justify-between sm:space-x-2 md:justify-end md:space-x-6">
			<a
				href={resolve('/')}
				class="hidden text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80 md:flex"
			>
				Home
			</a>

			<Button variant="ghost" class="md:hidden" onclick={() => (menuOpen = !menuOpen)}>
				{#if menuOpen}
					<X class="h-5 w-5" />
				{:else}
					<Menu class="h-5 w-5" />
				{/if}
				<span class="sr-only">Toggle Menu</span>
			</Button>
			<nav class="flex items-center sm:space-x-2 md:space-x-6">
				<DarkModeToggler />
				{#if user}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class="flex items-center justify-center">
							<Avatar class="h-8 w-8">
								<AvatarFallback class="text-xs text-gray-600">
									{user.name[0].toUpperCase()}
								</AvatarFallback>
							</Avatar>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-56" align="end">
							<DropdownMenu.Label class="font-normal">
								<div class="flex flex-col space-y-1">
									<p class="text-sm leading-none font-medium">{user.name}</p>
									<p class="text-xs leading-none text-muted-foreground">{user.username}</p>
								</div>
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<User class="mr-2 h-4 w-4" />
								<span>Profile</span>
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item
								onclick={async () => {
									await logout();
									window.location.reload();
								}}
							>
								<LogOut class="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else}
					<Button href="/signup" variant="secondary">SignUp</Button>
					<Button variant="outline" href="/login">Login</Button>
				{/if}
			</nav>
		</div>
	</div>
	{#if menuOpen}
		<div class="border-t bg-background md:hidden">
			<div class="container py-4">
				<nav class="flex flex-col space-y-3">
					<a href={resolve('/')} onclick={() => (menuOpen = false)}>Home</a>
				</nav>
			</div>
		</div>
	{/if}
</header>
