<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { isFilled } from '@prismicio/client';
	import { PrismicImage } from '@prismicio/svelte';
	import HorizontalScroller from '$lib/components/HorizontalScroller.svelte';
	import { onMount } from 'svelte';

	type Props = SliceComponentProps<Content.ClientWorkGallerySlice>;

	const { slice }: Props = $props();

	let scrollerElement: HTMLDivElement | null = null;
	let cardElements: HTMLDivElement[] = [];
	let containerElement: HTMLElement;
	const hoverScaleMultiplier = 1.05; // 5% increase on hover

	const updateCardStyles = () => {
		if (!scrollerElement || cardElements.length === 0) return;

		const scrollerRect = scrollerElement.getBoundingClientRect();
		const viewportCenter = scrollerRect.left + scrollerRect.width / 2;

		cardElements.forEach((card, index) => {
			if (!card) return;
			const cardRect = card.getBoundingClientRect();
			const cardCenter = cardRect.left + cardRect.width / 2;
			const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
			const maxDistance = scrollerRect.width / 2;
			const normalizedDistance = maxDistance > 0 ? distanceFromCenter / maxDistance : 0;

			// More extreme scaling: 1.3 at center, 0.5 at edges
			const scale = 1.3 - normalizedDistance * 0.8;
			const clampedScale = Math.max(0.5, Math.min(1.3, scale));

			// Store base scale on the card element for hover effect
			(card as any).baseScale = clampedScale;

			// Calculate z-index: higher at center, lower at edges
			// Use a range from 10 (center) to 1 (edges)
			const zIndex = Math.round(10 - normalizedDistance * 9);
			const clampedZIndex = Math.max(1, Math.min(10, zIndex));

			// Dynamic spacing: negative margin (overlap) at edges, positive margin (more space) at center
			// Account for base gap (~24px), so we add/subtract from that
			// At center: +60px extra margin (total ~84px spacing), at edges: -80px margin (total ~-56px overlap)
			// Skip margin on first card to avoid shifting the carousel
			const marginLeft = index === 0 ? 0 : 60 - normalizedDistance * 140; // 60px at center, -80px at edges
			const clampedMargin = index === 0 ? 0 : Math.max(-80, Math.min(60, marginLeft));

			// Only update transform if not hovering (hover state is handled separately)
			if (!(card as any).isHovering) {
				card.style.transform = `scale(${clampedScale})`;
			}
			card.style.zIndex = clampedZIndex.toString();
			card.style.marginLeft = `${clampedMargin}px`;
			card.style.transition = 'transform 0.2s ease-out, z-index 0.2s ease-out, margin-left 0.2s ease-out';
		});
	};

	const handleCardHover = (card: HTMLDivElement, isHovering: boolean) => {
		if (!card) return;
		const baseScale = (card as any).baseScale || 1;
		(card as any).isHovering = isHovering;
		
		if (isHovering) {
			card.style.transform = `scale(${baseScale * hoverScaleMultiplier})`;
		} else {
			card.style.transform = `scale(${baseScale})`;
		}
	};

	// Reactive effect to find scroller and set up listeners when container is available
	$effect(() => {
		if (containerElement) {
			const scroller = containerElement.querySelector('.horizontal-scroller') as HTMLDivElement;
			if (scroller && scroller !== scrollerElement) {
				// Remove old listener if it exists
				if (scrollerElement) {
					scrollerElement.removeEventListener('scroll', updateCardStyles);
				}
				scrollerElement = scroller;
				scrollerElement.addEventListener('scroll', updateCardStyles);
				// Initial update after DOM is ready
				requestAnimationFrame(() => {
					setTimeout(updateCardStyles, 50);
				});
			}
		}
		// Also update when cards are available
		if (cardElements.length > 0 && scrollerElement) {
			requestAnimationFrame(updateCardStyles);
		}
	});

	onMount(() => {
		// Update on resize
		window.addEventListener('resize', updateCardStyles);
		// Initial update
		setTimeout(updateCardStyles, 150);

		return () => {
			if (scrollerElement) {
				scrollerElement.removeEventListener('scroll', updateCardStyles);
			}
			window.removeEventListener('resize', updateCardStyles);
		};
	});
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-white carousel-section"
>
	<div class="container px-6 md:px-12" bind:this={containerElement}>
		<HorizontalScroller>
			{#each slice.primary.work || [] as item, index}
				{@const hasVideo = isFilled.linkToMedia(item.video)}
				{@const hasImage = isFilled.image(item.image)}
				{@const videoUrl = hasVideo && 'url' in item.video ? item.video.url : null}
				<div
					bind:this={cardElements[index]}
					class="shrink-0 bg-gray-300 rounded-lg relative overflow-hidden aspect-4/5 w-[180px] md:w-[220px] lg:w-[260px] carousel-card"
					role="button"
					tabindex="0"
					onmouseenter={() => handleCardHover(cardElements[index], true)}
					onmouseleave={() => handleCardHover(cardElements[index], false)}
				>
						{#if hasVideo && videoUrl}
							<video
								src={videoUrl}
								class="w-full h-full object-cover"
								autoplay
								loop
								muted
								playsinline
							></video>
						{:else if hasImage}
							<PrismicImage
								field={item.image}
								class="w-full h-full object-cover"
							/>
						{:else}
							<!-- Placeholder -->
							<div class="w-full h-full flex items-center justify-center bg-gray-800">
								<svg
									width="48"
									height="48"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-gray-600"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
									<circle cx="8.5" cy="8.5" r="1.5" />
									<polyline points="21 15 16 10 5 21" />
								</svg>
							</div>
					{/if}
				</div>
			{/each}
		</HorizontalScroller>
	</div>
</section>

<style>
	.carousel-section {
		overflow-y: hidden;
		/* Min height to accommodate largest scaled card: 260px * 1.25 (aspect) * 1.3 (max scale) = 422.5px + padding */
		min-height: 600px;
	}

	@media (min-width: 768px) {
		.carousel-section {
			min-height: 700px;
		}
	}

	@media (min-width: 1024px) {
		.carousel-section {
			min-height: 800px;
		}
	}

	:global(.carousel-section .horizontal-scroller) {
		overflow-y: hidden;
	}

	:global(.carousel-section .horizontal-scroller-content) {
		/* Add vertical padding to accommodate scaled cards (up to 1.3x scale) */
		/* Mobile: 180px * 1.25 * 1.3 = 292.5px, need ~150px padding */
		padding-top: 150px;
		padding-bottom: 150px;
	}

	@media (min-width: 768px) {
		:global(.carousel-section .horizontal-scroller-content) {
			/* Tablet: 220px * 1.25 * 1.3 = 357.5px, need ~180px padding */
			padding-top: 180px;
			padding-bottom: 180px;
		}
	}

	@media (min-width: 1024px) {
		:global(.carousel-section .horizontal-scroller-content) {
			/* Desktop: 260px * 1.25 * 1.3 = 422.5px, need ~220px padding */
			padding-top: 220px;
			padding-bottom: 220px;
		}
	}

	.carousel-card {
		transform-origin: center center;
		will-change: transform;
		cursor: pointer;
	}
</style>
