<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import HighlightText from '$lib/components/HighlightText.svelte';

	type Props = SliceComponentProps<Content.HighlightTextSlice>;

	const { slice }: Props = $props();

	// Get alignment class based on the alignment value
	function getAlignmentClass(alignment: string | null | undefined): string {
		switch (alignment?.toLowerCase()) {
			case 'center':
				return 'text-center mx-auto';
			case 'right':
				return 'text-right ml-auto';
			case 'left':
			default:
				return 'text-left mr-auto';
		}
	}
</script>

<section 
	data-slice-type={slice.slice_type} 
	data-slice-variation={slice.variation}
	class="bg-black text-[#FFFFE6] min-h-screen flex flex-col justify-center items-center px-6 md:px-8 py-20 md:py-32"
>
	<div class="container">
		{#if slice.primary.label}
			<div class="mb-8 md:mb-12 {getAlignmentClass(slice.primary.alignment)}">
				<span class="text-[#8BD475] underline font-clash text-base md:text-lg">
					{slice.primary.label}
				</span>
			</div>
		{/if}
		
		{#if slice.primary.text}
			<div class="{getAlignmentClass(slice.primary.alignment)}">
				<HighlightText 
					text={slice.primary.text}
					fontSize="clamp(1.75rem, 3vw + 1rem, 2.25rem)"
					lineHeight="clamp(2.25rem, 4vw + 1.25rem, 3.25rem)"
					maxWidth="100%"
					alignment={(slice.primary.alignment?.toLowerCase() as 'left' | 'center' | 'right') || 'left'}
				/>
			</div>
		{/if}
	</div>
</section>
