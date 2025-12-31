<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { PrismicImage } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.ClientWorkGallerySlice>;

	const { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-white py-12 md:py-16"
>
	<div class="container px-6 md:px-12">
		<div class="flex gap-3 md:gap-4 overflow-x-auto pb-2">
			{#each slice.primary.work || [] as item, index}
				{@const work = item.work}
				{@const gallery = work && 'data' in work && work.data?.gallery}
				{@const firstGalleryItem = gallery && Array.isArray(gallery) && gallery.length > 0 ? gallery[0] : null}
				<div
					class="shrink-0 bg-gray-300 rounded-lg relative overflow-hidden aspect-4/5 w-[180px] md:w-[220px] lg:w-[260px]"
				>
					{#if firstGalleryItem && firstGalleryItem.gallery_image && 'url' in firstGalleryItem.gallery_image && firstGalleryItem.gallery_image.url}
						<PrismicImage
							field={firstGalleryItem.gallery_image}
							class="w-full h-full object-cover"
						/>
					{:else if firstGalleryItem && firstGalleryItem.gallery_video}
						<div class="w-full h-full flex items-center justify-center">
							<!-- Video placeholder -->
						</div>
					{/if}
					{#if index === 0}
						<!-- Envelope icon in bottom-left of first card -->
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
								<path
									d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
								/>
								<polyline points="22,6 12,13 2,6" />
							</svg>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>
