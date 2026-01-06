<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);

	type Props = SliceComponentProps<Content.QuoteBlockSlice>;

	const { slice }: Props = $props();

	let quoteSection: HTMLElement | undefined = $state();
	let quoteText: HTMLElement | undefined = $state();
	let attributionText: HTMLElement | undefined = $state();

	onMount(() => {
		if (!quoteSection || !quoteText || !attributionText) return;

		// Set initial state
		gsap.set([quoteText, attributionText], {
			opacity: 0,
			y: 30
		});

		// Create scroll-triggered animation timeline
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: quoteSection,
				start: 'top 80%',
				toggleActions: 'play reset play reset'
			}
		});

		// Animate quote text first
		tl.to(quoteText, {
			opacity: 1,
			y: 0,
			duration: 0.8,
			ease: 'power2.out'
		});

		// Then animate attribution with a slight delay
		tl.to(
			attributionText,
			{
				opacity: 1,
				y: 0,
				duration: 0.6,
				ease: 'power2.out'
			},
			'-=0.3'
		);

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => {
				if (trigger.vars.trigger === quoteSection) {
					trigger.kill();
				}
			});
		};
	});
</script>

<section
	bind:this={quoteSection}
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="w-full py-24 md:py-32 px-6 md:px-12 container"
>
	<div class="max-w-4xl mx-auto text-center">
		{#if slice.primary.quote}
			<blockquote
				bind:this={quoteText}
				class="text-[#FFFFE6] font-auge leading-tight mb-8 md:mb-12"
				style="font-size: clamp(2rem, 4vw + 1rem, 3.75rem);"
			>
				{slice.primary.quote}
			</blockquote>
		{/if}
		{#if slice.primary.bottom_text}
			<p
				bind:this={attributionText}
				class="text-[#8bd475] text-center font-clash-variable not-italic font-normal tracking-[1.28px] uppercase [leading-trim:both] [text-edge:cap]"
				style="font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem); line-height: clamp(1.75rem, 3vw + 0.5rem, 2rem);"
			>
				{slice.primary.bottom_text}
			</p>
		{/if}
	</div>
</section>
