<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import Button from '$lib/components/Button.svelte';

	type Props = SliceComponentProps<Content.PathwaysHeroSlice>;

	const { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="w-full min-h-screen bg-black flex items-center overflow-hidden"
>
	<div class="w-full flex min-h-screen flex-col lg:flex-row relative">
		<!-- Left section: Text content -->
		<div class="w-full flex items-center p-8 px-6 md:p-12 md:px-8 lg:p-16 lg:px-12 relative z-10 pointer-events-none container">
			<div class="flex flex-col gap-12 w-7/10">
				<h1 class="formal-heading text-left text-[#FFFFE6]">
					{@html slice.primary.heading || 'Turn, "Keep us updated," into, "Send me the contract."'}
				</h1>
				<Button class="eyebrow-text self-start" type="button">
					{slice.primary.eyebrow_text || 'THIS IS HOW'}
				</Button>
			</div>
		</div>

		<!-- Right section: Graphic placeholder -->
		<div
			class="w-full lg:w-4/5  absolute flex items-center justify-center  lg:min-h-screen z-0 right-0"
		>
			<div class="w-full h-full min-h-[60vh] lg:min-h-screen relative">
				<script
					type="module"
					src="https://unpkg.com/@splinetool/viewer@1.12.28/build/spline-viewer.js"
				></script>
				<spline-viewer url="`https://prod.spline.design/ACCTUBsbwzuqM7jg/scene.splinecode`"
				></spline-viewer>
			</div>
		</div>
	</div>
</section>

<style>
	:global(h1 em),
	:global(h1 i) {
		font-style: italic;
	}
</style>
