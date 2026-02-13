<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { RichTextSliceHeroPrimary } from '../../../prismicio-types';
	import { PrismicRichText, type SliceComponentProps } from '@prismicio/svelte';
	import Label from './Label.svelte';

	type Props = SliceComponentProps<Content.RichTextSlice>;

	const { slice }: Props = $props();

	const isHero = $derived(slice.variation === 'hero');
	const heroPrimary = $derived(isHero ? (slice.primary as RichTextSliceHeroPrimary) : null);
</script>

{#if isHero && heroPrimary}
	<section
		data-slice-type={slice.slice_type}
		data-slice-variation={slice.variation}
		class="rich-text-hero min-h-dvh bg-black relative flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-20 md:py-32"
	>
		<!-- Centered main content -->
		<div class="rich-text-hero-content text-center max-w-[48rem] mx-auto font-manrope text-white">
			<PrismicRichText
				field={slice.primary.content}
				components={{
					label: Label
				}}
			/>
		</div>

		<!-- Bottom-left: FOUR PATHWAYS pill (lime border) -->
		{#if heroPrimary.eyebrow_text}
			<div class="rich-text-hero-eyebrow absolute left-4 sm:left-6 md:left-8 lg:left-12 bottom-10 sm:bottom-12 md:bottom-16">
				<span class="rich-text-hero-eyebrow-pill">{heroPrimary.eyebrow_text}</span>
			</div>
		{/if}

		<!-- Bottom-right: secondary copy -->
		{#if heroPrimary.secondary_line_1 || heroPrimary.secondary_line_2}
			<div class="rich-text-hero-secondary absolute right-4 sm:right-6 md:right-8 lg:right-12 bottom-10 sm:bottom-12 md:bottom-16 text-right max-w-sm">
				{#if heroPrimary.secondary_line_1}
					<p class="rich-text-hero-secondary-line1 text-white font-manrope">{heroPrimary.secondary_line_1}</p>
				{/if}
				{#if heroPrimary.secondary_line_2}
					<p class="rich-text-hero-secondary-line2 text-[#858585] font-manrope">{heroPrimary.secondary_line_2}</p>
				{/if}
			</div>
		{/if}
	</section>
{:else}
	<section class="rich-text-default container font-manrope">
		<div class="rich-text-default-content">
			<PrismicRichText
				field={slice.primary.content}
				components={{
					label: Label
				}}
			/>
		</div>
	</section>
{/if}

<style>
	.rich-text-default.container {
		max-width: 48rem;
		margin: 6em auto;
	}

	.rich-text-hero-eyebrow-pill {
		display: inline-block;
		color: #ffffff;
		font-family: 'ClashDisplay Variable', sans-serif;
		font-size: clamp(0.75rem, 1vw + 0.5rem, 1rem);
		font-weight: 400;
		letter-spacing: 1.28px;
		text-transform: uppercase;
		border-radius: 40px;
		border: 1px solid #cff602;
		padding: 6px 12px 6px 12px;
	}

	.rich-text-hero-secondary-line1 {
		font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem);
		line-height: 1.5;
		margin-bottom: 0.25em;
	}
	.rich-text-hero-secondary-line2 {
		font-size: clamp(0.8125rem, 0.9vw + 0.5rem, 0.9375rem);
		line-height: 1.5;
	}
</style>
