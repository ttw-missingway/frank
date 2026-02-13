<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.PackagesSlice>;

	const { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="container px-6 md:px-12 py-12 md:py-16 lg:py-20"
>
	<div class="w-full">
		{#if slice.primary.packages && slice.primary.packages.length > 0}
			<div class="flex flex-wrap items-stretch justify-around gap-5">
				{#each slice.primary.packages as packageItem}
					<div
						class="flex h-[220px] w-[220px] flex-col items-center justify-center rounded-lg bg-[#FFFFE6] py-5 px-6 text-black md:h-[260px] md:w-[260px] md:py-6 md:px-8 lg:h-[300px] lg:w-[300px] lg:py-7 lg:px-9"
					>
						{#if packageItem.eyebrow_text}
							<div
								class="mb-1 text-center font-clash-variable text-[clamp(0.75rem,1vw+0.5rem,0.875rem)] uppercase tracking-[0.05em] text-[#858585]"
							>
								{packageItem.eyebrow_text}
							</div>
						{/if}
						{#if packageItem.heading}
							<div
								class="my-2 mb-1 text-center font-venus text-[clamp(2.5rem,4vw+1rem,3.5rem)] font-normal leading-[1.1] md:text-[clamp(2.75rem,4.5vw+1.25rem,4rem)] lg:text-[clamp(3rem,5vw+1.5rem,4.5rem)]"
							>
								{packageItem.heading}
							</div>
						{/if}
						{#if packageItem.description}
							<div
								class="mt-1 text-center font-manrope text-[clamp(0.75rem,1vw+0.5rem,0.875rem)] font-normal text-black opacity-70"
							>
								{packageItem.description}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
