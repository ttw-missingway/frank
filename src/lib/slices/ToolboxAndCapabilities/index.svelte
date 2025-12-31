<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { PrismicRichText, type SliceComponentProps } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import { createBackgroundChanger } from '$lib/backgroundChanger';
	import HighlightText from '$lib/components/HighlightText.svelte';

	type Props = SliceComponentProps<Content.ToolboxAndCapabilitiesSlice>;

	const { slice }: Props = $props();

	let sectionElement: HTMLElement;

	onMount(() => {
		if (!sectionElement) return;

		const backgroundChanger = createBackgroundChanger(sectionElement);

		return () => {
			backgroundChanger?.destroy();
		};
	});
</script>

<section
	bind:this={sectionElement}
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="px-6 py-12 md:px-12 md:py-16 container relative min-h-screen"
>
	<div class="mb-12">
		{#if slice.primary.heading}
			<HighlightText text={slice.primary.heading} />
		{/if}
		{#if slice.primary.eyebrow_text}
			<div
				class="mt-4 px-6 py-2 rounded-[40px] outline outline-1 outline-offset-[-1px] outline-[#B4B4B4] inline-flex justify-start items-center gap-2.5"
			>
				<div
					class="justify-start text-[#B4B4B4] text-base font-normal font-clash-variable uppercase leading-8 tracking-wider"
				>
					{slice.primary.eyebrow_text}
				</div>
			</div>
		{/if}
	</div>

	{#if slice.primary.capabilities_body}
		<div class="capabilities-content">
			<PrismicRichText field={slice.primary.capabilities_body} />
		</div>
	{/if}
</section>

<style>
	.capabilities-content {
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
		color: white;
	}

	.capabilities-content :global(h1),
	.capabilities-content :global(h2) {
		font-size: 1.5rem; /* text-2xl */
		font-weight: 600; /* font-semibold */
		font-family: 'Manrope', sans-serif; /* font-['Manrope'] */
		line-height: 1.5rem; /* leading-6 */
		margin-top: 2rem;
		margin-bottom: 1rem;
		color: white;
	}

	.capabilities-content :global(h1:first-child),
	.capabilities-content :global(h2:first-child) {
		margin-top: 0;
	}

	.capabilities-content :global(h3),
	.capabilities-content :global(h4),
	.capabilities-content :global(h5),
	.capabilities-content :global(h6) {
		font-size: 0.75rem; /* text-xs */
		font-weight: 700; /* font-bold */
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		font-family: 'Manrope', sans-serif; /* font-['Manrope'] */
		line-height: 1.5rem; /* leading-6 */
	}

	.capabilities-content :global(ul) {
		margin-left: 1.5rem;
		margin-bottom: 1rem;
		margin-top: 0.5rem;
		list-style-type: disc;
		font-size: 0.75rem; /* text-xs */
		font-weight: 600; /* font-semibold */
		font-family: 'Manrope', sans-serif; /* font-['Manrope'] */
		line-height: 1.25rem; /* leading-5 */
		letter-spacing: -0.01em; /* tracking-tight */
		opacity: 0.8;
	}

	.capabilities-content :global(li) {
		margin-bottom: 0.5rem;
		color: white;
		font-size: 0.75rem; /* text-xs */
		font-weight: 600; /* font-semibold */
		font-family: 'Manrope', sans-serif; /* font-['Manrope'] */
		line-height: 1.25rem; /* leading-5 */
		letter-spacing: -0.01em; /* tracking-tight */
		opacity: 0.8;
	}

	.capabilities-content :global(p) {
		margin-bottom: 0.75rem;
		color: white;
		font-size: 0.75rem; /* text-xs */
		font-weight: 600; /* font-semibold */
		font-family: 'Manrope', sans-serif; /* font-['Manrope'] */
		line-height: 1.25rem; /* leading-5 */
		letter-spacing: -0.01em; /* tracking-tight */
		opacity: 0.8;
	}

	.capabilities-content :global(strong) {
		font-weight: 600;
		color: white;
		font-size: 0.75rem; /* text-xs */
		font-family: 'Manrope', sans-serif; /* font-['Manrope'] */
		line-height: 1.25rem; /* leading-5 */
		letter-spacing: -0.01em; /* tracking-tight */
		opacity: 0.8;
	}
</style>
