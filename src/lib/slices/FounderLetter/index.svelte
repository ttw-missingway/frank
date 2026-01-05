<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { PrismicImage } from '@prismicio/svelte';
	import HighlightText from '$lib/components/HighlightText.svelte';

	type Props = SliceComponentProps<Content.FounderLetterSlice>;

	const { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-white container"
>
	<div class="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 w-full max-w-[1400px] mx-auto">
		<div
			class="flex flex-col justify-start items-start p-10 bg-[#2a2a2a] rounded-bl-2xl rounded-tr-2xl"
		>
			<div class="flex items-start gap-6 md:gap-8 lg:gap-10 w-full mb-6 md:mb-8 lg:mb-10">
				{#if slice.primary.avatar?.url}
					<div
						class="w-[100px] h-[100px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px] shrink-0 rounded-full overflow-hidden relative"
					>
						<PrismicImage field={slice.primary.avatar} class="w-full h-full object-cover" />
					</div>
				{/if}

				<div class="flex-1 flex flex-col gap-1">
					{#if slice.primary.heading}
						<h2 class="m-0 text-center font-auge text-[36px] font-semibold leading-[48px] tracking-[0.72px] text-[#FFFFE6] whitespace-nowrap">{slice.primary.heading}</h2>
					{/if}

					{#if slice.primary.description}
						<p
							class="text-sm md:text-[0.9375rem] lg:text-base text-[#e5e5e5] leading-6 font-normal m-0 font-manrope"
						>
							{slice.primary.description}
						</p>
					{/if}
				</div>
			</div>

			{#if (slice.primary as any).bio_text}
				<p
					class="text-[#D9D9D9] font-inter text-[24px] font-normal not-italic leading-[36px] w-full m-0"
				>
					{(slice.primary as any).bio_text}
				</p>
			{/if}
		</div>

		<div
			class="flex items-center justify-start p-10 bg-[#9baa6f] rounded-bl-2xl rounded-tr-2xl"
		>
			{#if slice.primary.letter_text}
				<HighlightText
					text={slice.primary.letter_text}
					baseColor="#1E1E1E"
					highlightColor="#1e1e1e"
					fontSize="32px"
					lineHeight="52px"
					className="founder-letter-text w-full"
				/>
			{/if}
		</div>
	</div>
</section>
