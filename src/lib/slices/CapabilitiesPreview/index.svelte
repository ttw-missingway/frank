<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { PrismicLink } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.CapabilitiesPreviewSlice>;

	const { slice }: Props = $props();
</script>

<section 
	data-slice-type={slice.slice_type} 
	data-slice-variation={slice.variation}
	class="bg-black text-white py-16 md:py-24 px-6 md:px-8"
>
	<div class="container mx-auto max-w-7xl">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
			<!-- Left Side: Heading, Subtitle, and Arrow -->
			<div class="flex flex-col justify-center">
				{#if slice.primary.heading}
					<h2 class="text-3xl md:text-4xl lg:text-5xl font-sans mb-6 leading-tight">
						{slice.primary.heading}
					</h2>
				{/if}
				
				<p class="text-lg md:text-xl font-sans mb-6">
					All of our capabilities, under one roof
				</p>
				
				{#if slice.primary.link}
					<PrismicLink field={slice.primary.link} class="inline-flex items-center text-white hover:opacity-80 transition-opacity w-fit">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</PrismicLink>
				{:else}
					<div class="inline-flex items-center text-white w-fit">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</div>
				{/if}
			</div>

			<!-- Right Side: Bulleted List of Capabilities -->
			<div class="flex flex-col">
				{#if slice.primary.capabilities && slice.primary.capabilities.length > 0}
					<ul class="space-y-3 md:space-y-4">
						{#each slice.primary.capabilities as item}
							{#if item.capability}
								<li class="text-lg md:text-xl font-sans flex items-start">
									<span class="mr-3 mt-1">•</span>
									<span>{item.capability}</span>
								</li>
							{/if}
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</div>
</section>
