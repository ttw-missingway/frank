<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { PrismicImage } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.WorkGallerySlice>;

	const { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="px-6 py-12 md:px-12 md:py-16 container"
>
	<div class="mb-12">
		{#if slice.primary.eyebrow_text}
			<p class="text-gray-400 text-sm md:text-base mb-2">{slice.primary.eyebrow_text}</p>
		{/if}
		{#if slice.primary.heading}
			<h2 class="text-[#FFFFE6] text-4xl md:text-5xl lg:text-6xl font-normal">
				{slice.primary.heading}
			</h2>
		{/if}
	</div>

	<div class="grid grid-cols-3 gap-2 md:gap-3">
		{#each slice.primary.gallery || [] as item, index}
			{@const work = item.work}
			{@const isTopRow = index < 3}
			<div
				class="bg-gray-300 rounded-lg relative overflow-hidden {isTopRow
					? 'aspect-[3/4]'
					: 'aspect-[4/3]'}"
			>
				{#if work && 'data' in work && work.data?.featured_image}
					<PrismicImage
						field={work.data.featured_image}
						class="w-full h-full object-cover"
					/>
				{:else}
					<div class="w-full h-full flex items-center justify-center">
						<!-- Placeholder -->
					</div>
				{/if}
				{#if index === 3}
					<!-- Camera icon in bottom-left of first bottom rectangle -->
					<div class="absolute bottom-3 left-3">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="text-gray-600"
						>
							<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
							<circle cx="12" cy="13" r="3" />
						</svg>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>
