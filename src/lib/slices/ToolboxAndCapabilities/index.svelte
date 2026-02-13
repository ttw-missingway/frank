<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { PrismicRichText, type SliceComponentProps } from '@prismicio/svelte';
	import HighlightText from '$lib/components/HighlightText.svelte';

	type Props = SliceComponentProps<Content.ToolboxAndCapabilitiesSlice>;

	const { slice }: Props = $props();

</script>

<section
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
		color: #FFFFE6;
	}

	.capabilities-content :global(h1),
	.capabilities-content :global(h2) {
		font-size: clamp(1.25rem, 2vw + 0.75rem, 1.5rem); /* Responsive: 20px to 24px */
		font-weight: 600; /* font-semibold */
		font-family: 'Manrope', sans-serif; /* font-['Manrope'] */
		line-height: clamp(1.5rem, 2vw + 0.75rem, 1.75rem); /* Responsive: 24px to 28px */
		margin-top: 2rem;
		margin-bottom: 1rem;
		color: #FFFFE6;
	}

	.capabilities-content :global(h1:first-child),
	.capabilities-content :global(h2:first-child) {
		margin-top: 0;
	}

	.capabilities-content :global(h3),
	.capabilities-content :global(h4),
	.capabilities-content :global(h5),
	.capabilities-content :global(h6) {
		font-size: clamp(0.6875rem, 0.75vw + 0.5rem, 0.75rem); /* Responsive: 11px to 12px */
		font-weight: 700; /* font-bold */
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		font-family: 'Manrope', sans-serif; /* font-['Manrope'] */
		line-height: clamp(1.25rem, 1.5vw + 0.75rem, 1.5rem); /* Responsive: 20px to 24px */
	}

	.capabilities-content :global(ul) {
		margin-left: 1.5rem;
		margin-bottom: 1rem;
		margin-top: 0.5rem;
		list-style-type: disc;
		font-size: clamp(0.6875rem, 0.75vw + 0.5rem, 0.75rem); /* Responsive: 11px to 12px */
		font-weight: 600; /* font-semibold */
		font-family: 'Manrope', sans-serif; /* font-['Manrope'] */
		line-height: clamp(1rem, 1.25vw + 0.625rem, 1.25rem); /* Responsive: 16px to 20px */
		letter-spacing: -0.01em; /* tracking-tight */
		opacity: 0.8;
	}

	.capabilities-content :global(li) {
		margin-bottom: 0.5rem;
		color: #FFFFE6;
		font-size: clamp(0.6875rem, 0.75vw + 0.5rem, 0.75rem); /* Responsive: 11px to 12px */
		font-weight: 600; /* font-semibold */
		font-family: 'Manrope', sans-serif; /* font-['Manrope'] */
		line-height: clamp(1rem, 1.25vw + 0.625rem, 1.25rem); /* Responsive: 16px to 20px */
		letter-spacing: -0.01em; /* tracking-tight */
		opacity: 0.8;
	}

	.capabilities-content :global(p) {
		margin-bottom: 0.75rem;
		color: #FFFFE6;
		font-size: clamp(0.6875rem, 0.75vw + 0.5rem, 0.75rem); /* Responsive: 11px to 12px */
		font-weight: 600; /* font-semibold */
		font-family: 'Manrope', sans-serif; /* font-['Manrope'] */
		line-height: clamp(1rem, 1.25vw + 0.625rem, 1.25rem); /* Responsive: 16px to 20px */
		letter-spacing: -0.01em; /* tracking-tight */
		opacity: 0.8;
	}

	.capabilities-content :global(strong) {
		font-weight: 600;
		color: #FFFFE6;
		font-size: clamp(0.6875rem, 0.75vw + 0.5rem, 0.75rem); /* Responsive: 11px to 12px */
		font-family: 'Manrope', sans-serif; /* font-['Manrope'] */
		line-height: clamp(1rem, 1.25vw + 0.625rem, 1.25rem); /* Responsive: 16px to 20px */
		letter-spacing: -0.01em; /* tracking-tight */
		opacity: 0.8;
	}
</style>
