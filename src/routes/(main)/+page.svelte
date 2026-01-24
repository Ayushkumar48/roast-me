<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { roastVariants } from '$lib/client/enums.js';
</script>

<div class="container mx-auto px-4 py-12">
	<div class="mb-12 text-center">
		<h1
			class="mb-4 bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
		>
			Get Roasted 🔥
		</h1>
		<p class="text-lg text-muted-foreground">
			Choose your poison. We'll make sure it hurts (your feelings, not you).
		</p>
	</div>

	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		{#each roastVariants as variant (variant.name)}
			{@const Icon = variant.icon}
			<Card.Root
				class="group flex cursor-pointer flex-col justify-between border-2 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl"
			>
				<div class="mb-4 transition-transform duration-300 group-hover:scale-105">
					<Icon />
				</div>
				<Card.Header class="pb-4 text-center">
					<Card.Title class="mb-2 text-2xl font-bold">
						{variant.title}
					</Card.Title>
					<Card.Description class="flex min-h-12 items-center justify-center text-sm italic">
						"{variant.description}"
					</Card.Description>
				</Card.Header>
				<Card.Content class="pt-0">
					<div class="h-1 w-full rounded-full bg-linear-to-r {variant.gradient} mb-4"></div>
					<Button
						class="w-full bg-linear-to-r {variant.gradient} transition-opacity hover:opacity-90"
						href={variant.path}
					>
						Roast My {variant.title}
					</Button>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<div class="mt-12 text-center text-sm text-muted-foreground">
		<p>⚠️ Warning: Roasts may cause emotional damage. Proceed at your own risk.</p>
	</div>
</div>

<style>
	:global(body) {
		background:
			radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1), transparent),
			radial-gradient(circle at 80% 80%, rgba(255, 100, 100, 0.1), transparent);
	}
</style>
