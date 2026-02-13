<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { PrismicImage } from '@prismicio/svelte';

	gsap.registerPlugin(ScrollTrigger);

	type Props = SliceComponentProps<Content.AnimationShelfSlice>;

	const { slice }: Props = $props();

	let sectionElement: HTMLElement;
	let cardsContainer: HTMLElement;

	onMount(() => {
		if (!sectionElement || !cardsContainer) return;

		// Get all card elements
		const cardElements = cardsContainer.querySelectorAll('.card') as NodeListOf<HTMLElement>;
		const totalCards = cardElements.length;
		
		if (totalCards === 0) return;
		
		// Calculate spacing based on card width and screen size to ensure all cards are visible
		const cardWidth = window.innerWidth >= 768 ? 260 : 220; // Responsive card width
		const minSpacing = cardWidth * 0.9; // Minimum spacing to prevent overlap (90% of card width)
		// Use larger spacing on desktop, smaller on mobile
		const baseSpacing = window.innerWidth >= 768 ? 120 : 90;
		const cardSpacing = Math.max(minSpacing, baseSpacing);
		const maxRotation = 20; // Maximum rotation in degrees
		const centerIndex = (totalCards - 1) / 2;

		// Set initial state: all cards stacked in center with slight offset for depth
		cardElements.forEach((card, index) => {
			const offsetFromCenter = index - centerIndex;
			
			gsap.set(card, {
				rotation: 0,
				xPercent: -50, // Center horizontally (offset by half width)
				yPercent: -50, // Center vertically (offset by half height)
				x: 0, // No additional horizontal offset initially
				y: 0, // No additional vertical offset initially
				z: -Math.abs(offsetFromCenter) * 5, // Stack cards with z-offset
				scale: 1 - Math.abs(offsetFromCenter) * 0.03, // Slightly scale down cards behind
				opacity: 1,
				transformOrigin: 'center center'
			});
		});

		// Create ScrollTrigger animation
		ScrollTrigger.create({
			trigger: sectionElement,
			start: 'top 80%',
			end: 'bottom 20%',
			scrub: 1,
			onUpdate: (self) => {
				const progress = self.progress;
				const easedProgress = gsap.utils.clamp(0, 1, progress);

				cardElements.forEach((card, index) => {
					const offsetFromCenter = index - centerIndex;
					
					// Calculate rotation (cards on edges rotate more, creating fan effect)
					const rotation = offsetFromCenter * (maxRotation / Math.max(centerIndex, 1)) * easedProgress;
					
					// Calculate horizontal position (spread out from center)
					// Start from centered position (50% - 50% of width) and spread
					const x = offsetFromCenter * cardSpacing * easedProgress;
					
					// Calculate vertical position (slight arc like a hand of cards)
					const y = -Math.abs(offsetFromCenter) * 8 * easedProgress;
					
					// Bring cards forward as they spread (reduce z-depth)
					const z = -Math.abs(offsetFromCenter) * 5 * (1 - easedProgress);
					
					// Slight scale animation (cards become more uniform as they spread)
					const scale = 1 - Math.abs(offsetFromCenter) * 0.03 * (1 - easedProgress);

					gsap.to(card, {
						rotation: rotation,
						x: x, // Spread horizontally from center
						y: y, // Slight vertical arc
						z: z,
						scale: scale,
						duration: 0.1,
						ease: 'none'
					});
				});
			}
		});

		return () => {
			ScrollTrigger.getAll().forEach(trigger => {
				if (trigger.vars.trigger === sectionElement) {
					trigger.kill();
				}
			});
		};
	});
</script>

	<section
		bind:this={sectionElement}
		data-slice-type={slice.slice_type}
		data-slice-variation={slice.variation}
		class="py-20 md:py-32"
	>
	<div class="container px-6 md:px-12">
		<div
			bind:this={cardsContainer}
			class="relative"
			style="min-height: 500px; perspective: 1200px; display: flex; align-items: center; justify-content: center; width: 100%;"
		>
			{#each slice.primary.images || [] as item, index}
				{@const image = item.image}
				<div
					class="card absolute"
					style="transform-style: preserve-3d; left: 50%; top: 50%;"
				>
					<div class="rounded-2xl overflow-hidden shadow-lg w-[220px] md:w-[260px] aspect-3/4">
						{#if image?.url}
							<PrismicImage
								field={image}
								class="w-full h-full object-cover"
							/>
						{:else}
							<div class="w-full h-full bg-gray-300"></div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.card {
		will-change: transform;
		backface-visibility: hidden;
	}
</style>
