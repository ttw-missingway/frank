<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.ClientWorkHeadingSlice>;

	const { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-white py-16 md:py-24"
>
	<div class="container px-6 md:px-12">
		<div class="flex flex-col items-center justify-center min-h-[60vh]">
			<!-- Client Label -->
			<div class="w-full mb-8 md:mb-12">
				<p class="text-gray-400 text-sm md:text-base">Client</p>
			</div>

			<!-- Client Name -->
			{#if slice.primary.client_name && 'data' in slice.primary.client_name && slice.primary.client_name.data?.client_name}
				<h1 class="text-white text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-8 md:mb-12">
					{slice.primary.client_name.data.client_name}
				</h1>
			{/if}

			<!-- Client Description -->
			{#if slice.primary.client_description && 'data' in slice.primary.client_description && slice.primary.client_description.data?.description}
				<p class="text-gray-400 text-lg md:text-xl lg:text-2xl text-center max-w-3xl">
					{slice.primary.client_description.data.description}
				</p>
			{/if}
		</div>
	</div>
</section>
