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
	class="pathways-hero w-full h-dvh min-h-dvh lg:h-screen bg-black flex items-center overflow-hidden"
>
	<div class="pathways-hero-inner w-full h-full min-h-0 flex relative lg:min-h-screen">
		<!-- Text content: overlays the spline (bottom on mobile, left center on desktop) -->
		<div
			class="pathways-hero-text absolute inset-0 flex items-end justify-start lg:items-center p-4 pb-10 pt-6 sm:p-6 sm:pb-12 md:p-12 md:px-8 lg:p-16 lg:px-12 z-10 pointer-events-none container"
		>
			<div class="flex flex-col gap-5 sm:gap-6 md:gap-8 lg:gap-12 w-full max-w-xl lg:max-w-[55%]">
				<h1 class="pathways-hero-heading formal-heading text-left text-[#FFFFE6]">
					{@html slice.primary.heading || 'Turn, "Keep us updated," into, "Send me the contract."'}
				</h1>
				<Button class="pathways-hero-eyebrow eyebrow-text self-start" type="button">
					{slice.primary.eyebrow_text || 'THIS IS HOW'}
				</Button>
			</div>
		</div>

		<!-- Spline viewer: full bleed behind text on all screen sizes -->
		<div
			class="pathways-hero-spline absolute inset-0 w-full h-full flex items-center justify-center z-0"
		>
			<div class="spline-viewer-wrapper w-full h-full relative">
				<script
					type="module"
					src="https://unpkg.com/@splinetool/viewer@1.12.28/build/spline-viewer.js"
				></script>
				<spline-viewer
					url={slice.primary.spline_url || 'https://prod.spline.design/ACCTUBsbwzuqM7jg/scene.splinecode'}
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

	/* Mobile-friendly heading: smaller on small screens, avoids overlap and awkward breaks */
	.pathways-hero-heading {
		font-size: clamp(1.375rem, 5.5vw + 1rem, 2.5rem);
		line-height: clamp(1.625rem, 6.5vw + 1rem, 3rem);
	}

	@media (min-width: 640px) {
		.pathways-hero-heading {
			font-size: clamp(2rem, 4vw + 1rem, 3rem);
			line-height: clamp(2.25rem, 5vw + 1rem, 3.5rem);
		}
	}

	@media (min-width: 1024px) {
		.pathways-hero-heading {
			font-size: clamp(2.5rem, 5vw + 1rem, 4rem);
			line-height: clamp(2.75rem, 5.5vw + 1rem, 4.5rem);
		}
	}

	/* Eyebrow: compact on mobile (Button forwards class to root) */
	.pathways-hero :global(.pathways-hero-eyebrow) {
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 6px;
		padding-bottom: 6px;
		font-size: 0.75rem;
		letter-spacing: 1px;
	}

	@media (min-width: 640px) {
		.pathways-hero :global(.pathways-hero-eyebrow) {
			padding-left: 12px;
			padding-right: 12px;
			font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem);
			letter-spacing: 1.28px;
		}
	}

	/* Gradient behind text so it reads over the Spline scene */
	.pathways-hero-text::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: -1;
		/* Mobile: gradient from bottom so text at bottom is readable */
		background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, transparent 55%);
	}

	@media (min-width: 1024px) {
		.pathways-hero-text::before {
			/* Desktop: gradient from left so text overlay on left is readable */
			background: linear-gradient(to right, rgba(0, 0, 0, 0.75) 0%, transparent 50%);
		}
	}

	/* Spline wrapper fills the hero so the 3D scene is full bleed */
	.spline-viewer-wrapper {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.spline-viewer-wrapper :global(spline-viewer) {
		position: absolute;
		inset: 0;
		width: 100% !important;
		height: 100% !important;
		min-height: 100%;
		display: block;
	}
</style>
