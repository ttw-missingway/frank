<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { PrismicImage } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.SelectedPartnersSlice>;

	const { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-[#FFFFE6] py-12 md:py-16"
>
	<div class="container px-6 md:px-12">
		{#if slice.primary.heading}
			<h2 class="text-[#FFFFE6] text-3xl md:text-4xl lg:text-5xl font-normal text-center mb-8 md:mb-12">
				{slice.primary.heading}
			</h2>
		{/if}

		{#if slice.primary.logos && slice.primary.logos.length > 0}
			<div class="partners-grid">
				{#each slice.primary.logos as item}
					{#if item.logo?.url}
						<div class="partner-logo">
							<PrismicImage
								field={item.logo}
								class="w-full h-full object-contain"
							/>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.partners-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		width: 100%;
	}

	@media (min-width: 768px) {
		.partners-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 3rem;
		}
	}

	.partner-logo {
		width: 100%;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@media (min-width: 768px) {
		.partner-logo {
			height: 100px;
		}
	}

	@media (min-width: 1024px) {
		.partner-logo {
			height: 120px;
		}
	}
</style>
