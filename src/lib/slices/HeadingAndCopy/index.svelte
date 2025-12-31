<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.HeadingAndCopySlice>;

	const { slice }: Props = $props();
</script>

<section 
	data-slice-type={slice.slice_type} 
	data-slice-variation={slice.variation}
	class="bg-black text-white min-h-screen flex flex-col justify-center items-center px-6 md:px-8 py-20 md:py-32"
>
	<div class="text-center max-w-4xl">
		{#if slice.primary.heading}
			<h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 md:mb-12 leading-tight">
				{slice.primary.heading}
			</h2>
		{/if}
		
		{#if slice.primary.copy}
			<p class="text-base md:text-lg lg:text-xl leading-relaxed">
				{slice.primary.copy}
			</p>
		{/if}
	</div>
</section>
