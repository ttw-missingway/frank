<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { isFilled } from '@prismicio/client';
	import { PrismicImage } from '@prismicio/svelte';
	import HorizontalScroller from '$lib/components/HorizontalScroller.svelte';
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';

	type Props = SliceComponentProps<Content.ClientWorkGallerySlice>;

	const { slice }: Props = $props();

	let scrollerElement: HTMLDivElement | null = null;
	let scrollerOriginalSnap: string | null = null;
	let cardElements: HTMLDivElement[] = [];
	let containerElement: HTMLElement;
	let isJumping = false;
	let suppressTransitions = false;
	const hoverScaleMultiplier = 1.05; // 5% increase on hover

	const baseItems = $derived.by(() => slice.primary.work || []);
	const shouldLoop = $derived.by(() => baseItems.length > 1);
	const loopCopies = 3;
	const displayedItems = $derived.by(() =>
		shouldLoop ? Array.from({ length: loopCopies }, () => baseItems).flat() : baseItems
	);
	const getOriginalIndex = (displayIndex: number) =>
		shouldLoop ? displayIndex % baseItems.length : displayIndex;
	
	// Lightbox state
	let lightboxOpen = $state(false);
	let lightboxIndex = $state<number | null>(null);
	let lightboxElement = $state<HTMLDivElement | null>(null);

	const updateCardStyles = () => {
		if (!scrollerElement || cardElements.length === 0) return;

		const scrollerRect = scrollerElement.getBoundingClientRect();
		const viewportCenter = scrollerRect.left + scrollerRect.width / 2;

		let closestIndex = 0;
		let closestDistance = Number.POSITIVE_INFINITY;
		let closestScale = 1;

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

			if (distanceFromCenter < closestDistance) {
				closestDistance = distanceFromCenter;
				closestIndex = index;
				closestScale = clampedScale;
			}

			// Store base scale on the card element for hover effect
			(card as any).baseScale = clampedScale;

			// Calculate z-index: higher at center, lower at edges
			// Use a range from 10 (center) to 1 (edges)
			const zIndex = Math.round(10 - normalizedDistance * 9);
			const clampedZIndex = Math.max(1, Math.min(10, zIndex));

			// Dynamic spacing via translateX so layout/scrollWidth stays stable
			// At center: +60px, at edges: -80px
			const translateX = 60 - normalizedDistance * 140; // 60px at center, -80px at edges
			const clampedTranslateX = Math.max(-80, Math.min(60, translateX));

			// Store base translate for hover effect (so we only scale on hover)
			(card as any).baseTranslateX = clampedTranslateX;

			// Only update transform if not hovering (hover state is handled separately)
			if (!(card as any).isHovering) {
				card.style.transform = `translateX(${clampedTranslateX}px) scale(${clampedScale})`;
			}
			card.style.zIndex = clampedZIndex.toString();
			card.style.marginLeft = '';
			card.style.transition = suppressTransitions
				? 'none'
				: 'transform 0.2s ease-out, z-index 0.2s ease-out';
		});

		// #region agent log
		fetch('http://127.0.0.1:7244/ingest/53c6304f-f016-4df4-aa32-0336bf84c333',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ClientWorkGallery/index.svelte:updateCardStyles',message:'scroller metrics',data:{scrollLeft:scrollerElement.scrollLeft,scrollWidth:scrollerElement.scrollWidth,clientWidth:scrollerElement.clientWidth,cardCount:cardElements.length,viewportCenter,closestIndex,closestDistance,closestScale,isJumping},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H5'})}).catch(()=>{});
		// #endregion
	};

	const setScrollerPosition = (position: number) => {
		if (!scrollerElement) return;
		const previousBehavior = scrollerElement.style.scrollBehavior;
		const previousSnap = scrollerElement.style.scrollSnapType;
		isJumping = true;
		suppressTransitions = true;
		// #region agent log
		fetch('http://127.0.0.1:7244/ingest/53c6304f-f016-4df4-aa32-0336bf84c333',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ClientWorkGallery/index.svelte:setScrollerPosition',message:'before jump',data:{scrollLeft:scrollerElement.scrollLeft,target:position,previousBehavior,previousSnap},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{});
		// #endregion
		scrollerElement.style.scrollBehavior = 'auto';
		scrollerElement.style.scrollSnapType = 'none';
		scrollerElement.scrollLeft = position;
		updateCardStyles();
		requestAnimationFrame(() => {
			if (!scrollerElement) return;
			scrollerElement.style.scrollBehavior = previousBehavior;
			scrollerElement.style.scrollSnapType = previousSnap;
			// #region agent log
			fetch('http://127.0.0.1:7244/ingest/53c6304f-f016-4df4-aa32-0336bf84c333',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ClientWorkGallery/index.svelte:setScrollerPosition',message:'after jump',data:{scrollLeft:scrollerElement.scrollLeft,restoredBehavior:scrollerElement.style.scrollBehavior,restoredSnap:scrollerElement.style.scrollSnapType},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{});
			// #endregion
			// #region agent log
			const computed = getComputedStyle(scrollerElement);
			const scrollerRect = scrollerElement.getBoundingClientRect();
			const viewportCenterX = scrollerRect.left + scrollerRect.width / 2;
			let closestIndex = 0;
			let closestDistance = Number.POSITIVE_INFINITY;
			for (let i = 0; i < cardElements.length; i += 1) {
				const card = cardElements[i];
				if (!card) continue;
				const rect = card.getBoundingClientRect();
				const center = rect.left + rect.width / 2;
				const distance = Math.abs(center - viewportCenterX);
				if (distance < closestDistance) {
					closestDistance = distance;
					closestIndex = i;
				}
			}
			fetch('http://127.0.0.1:7244/ingest/53c6304f-f016-4df4-aa32-0336bf84c333',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ClientWorkGallery/index.svelte:setScrollerPosition',message:'post-jump snap check',data:{scrollLeft:scrollerElement.scrollLeft,closestIndex,closestDistance,snapType:computed.scrollSnapType,behavior:computed.scrollBehavior},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H4'})}).catch(()=>{});
			// #endregion
			suppressTransitions = false;
			isJumping = false;
		});
	};

	const handleInfiniteScroll = () => {
		if (!scrollerElement || !shouldLoop) return;

		const totalScrollWidth = scrollerElement.scrollWidth;
		if (!totalScrollWidth) return;

		const segmentWidth = totalScrollWidth / loopCopies;
		if (!segmentWidth) return;

		const leftThreshold = segmentWidth * 0.1;
		const rightThreshold = segmentWidth * 1.9;

		const baseCount = baseItems.length;
		const leftStart = cardElements[0]?.offsetLeft ?? null;
		const middleStart = cardElements[baseCount]?.offsetLeft ?? null;
		const rightStart = cardElements[baseCount * 2]?.offsetLeft ?? null;
		const offsetSegment = leftStart !== null && middleStart !== null ? middleStart - leftStart : null;

		const scrollerRect = scrollerElement.getBoundingClientRect();
		const viewportCenterX = scrollerRect.left + scrollerRect.width / 2;
		let closestIndex = 0;
		let closestDistance = Number.POSITIVE_INFINITY;
		for (let i = 0; i < cardElements.length; i += 1) {
			const card = cardElements[i];
			if (!card) continue;
			const rect = card.getBoundingClientRect();
			const center = rect.left + rect.width / 2;
			const distance = Math.abs(center - viewportCenterX);
			if (distance < closestDistance) {
				closestDistance = distance;
				closestIndex = i;
			}
		}
		const originalIndex = baseCount > 0 ? closestIndex % baseCount : 0;
		const leftIndex = originalIndex;
		const middleIndex = baseCount + originalIndex;
		const rightIndex = baseCount * 2 + originalIndex;
		const leftOffset = cardElements[leftIndex]?.offsetLeft ?? null;
		const middleOffset = cardElements[middleIndex]?.offsetLeft ?? null;
		const rightOffset = cardElements[rightIndex]?.offsetLeft ?? null;
		const leftDelta =
			leftOffset !== null && middleOffset !== null ? middleOffset - leftOffset : null;
		const rightDelta =
			middleOffset !== null && rightOffset !== null ? rightOffset - middleOffset : null;

		// #region agent log
		fetch('http://127.0.0.1:7244/ingest/53c6304f-f016-4df4-aa32-0336bf84c333',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ClientWorkGallery/index.svelte:handleInfiniteScroll',message:'threshold check',data:{scrollLeft:scrollerElement.scrollLeft,segmentWidth,leftThreshold,rightThreshold,scrollWidth:totalScrollWidth,baseCount,leftStart,middleStart,rightStart,offsetSegment,closestIndex,originalIndex,leftDelta,rightDelta},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
		// #endregion

		if (scrollerElement.scrollLeft <= leftThreshold) {
			// #region agent log
			fetch('http://127.0.0.1:7244/ingest/53c6304f-f016-4df4-aa32-0336bf84c333',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ClientWorkGallery/index.svelte:handleInfiniteScroll',message:'jump right',data:{scrollLeft:scrollerElement.scrollLeft,delta:leftDelta ?? offsetSegment ?? segmentWidth},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
			// #endregion
			const delta = leftDelta ?? offsetSegment ?? segmentWidth;
			setScrollerPosition(scrollerElement.scrollLeft + delta);
		} else if (scrollerElement.scrollLeft >= rightThreshold) {
			// #region agent log
			fetch('http://127.0.0.1:7244/ingest/53c6304f-f016-4df4-aa32-0336bf84c333',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ClientWorkGallery/index.svelte:handleInfiniteScroll',message:'jump left',data:{scrollLeft:scrollerElement.scrollLeft,delta:rightDelta ?? offsetSegment ?? segmentWidth},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
			// #endregion
			const delta = rightDelta ?? offsetSegment ?? segmentWidth;
			setScrollerPosition(scrollerElement.scrollLeft - delta);
		}
	};

	const handleScrollerScroll = () => {
		handleInfiniteScroll();
		updateCardStyles();
	};

	const handleCardHover = (card: HTMLDivElement, isHovering: boolean) => {
		if (!card) return;
		const baseScale = (card as any).baseScale || 1;
		const baseTranslateX = (card as any).baseTranslateX || 0;
		(card as any).isHovering = isHovering;
		
		if (isHovering) {
			card.style.transform = `translateX(${baseTranslateX}px) scale(${baseScale * hoverScaleMultiplier})`;
		} else {
			card.style.transform = `translateX(${baseTranslateX}px) scale(${baseScale})`;
		}
	};

	const openLightbox = (index: number) => {
		lightboxIndex = index;
		lightboxOpen = true;
		// Prevent body scroll when lightbox is open
		document.body.style.overflow = 'hidden';
	};

	const closeLightbox = () => {
		lightboxOpen = false;
		lightboxIndex = null;
		// Restore body scroll
		document.body.style.overflow = '';
	};

	const handleLightboxKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			closeLightbox();
		} else if (e.key === 'ArrowLeft' && lightboxIndex !== null) {
			// Navigate to previous image
			if (baseItems.length > 0) {
				const newIndex = lightboxIndex > 0 ? lightboxIndex - 1 : baseItems.length - 1;
				lightboxIndex = newIndex;
			}
		} else if (e.key === 'ArrowRight' && lightboxIndex !== null) {
			// Navigate to next image
			if (baseItems.length > 0) {
				const newIndex = lightboxIndex < baseItems.length - 1 ? lightboxIndex + 1 : 0;
				lightboxIndex = newIndex;
			}
		}
	};

	const handleLightboxBackdropClick = (e: MouseEvent) => {
		// Close if clicking on the backdrop (not the image itself)
		if (e.target === lightboxElement) {
			closeLightbox();
		}
	};

	// Reactive effect to find scroller and set up listeners when container is available
	$effect(() => {
		if (containerElement) {
			const scroller = containerElement.querySelector('.horizontal-scroller') as HTMLDivElement;
			if (scroller && scroller !== scrollerElement) {
				// Remove old listener if it exists
				if (scrollerElement) {
					scrollerElement.removeEventListener('scroll', handleScrollerScroll);
				}
				scrollerElement = scroller;
				if (shouldLoop) {
					if (scrollerOriginalSnap === null) {
						scrollerOriginalSnap = scrollerElement.style.scrollSnapType;
					}
					scrollerElement.style.scrollSnapType = 'none';
				}
				scrollerElement.addEventListener('scroll', handleScrollerScroll);
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
		setTimeout(() => {
			if (scrollerElement && shouldLoop) {
				const segmentWidth = scrollerElement.scrollWidth / loopCopies;
				if (segmentWidth) {
					setScrollerPosition(segmentWidth);
				}
			}
		}, 150);

		return () => {
			if (scrollerElement) {
				scrollerElement.removeEventListener('scroll', handleScrollerScroll);
				if (scrollerOriginalSnap !== null) {
					scrollerElement.style.scrollSnapType = scrollerOriginalSnap;
				}
			}
			window.removeEventListener('resize', updateCardStyles);
			// Restore body scroll on cleanup
			document.body.style.overflow = '';
		};
	});

	// Handle keyboard events when lightbox is open
	$effect(() => {
		if (lightboxOpen) {
			window.addEventListener('keydown', handleLightboxKeydown);
			return () => {
				window.removeEventListener('keydown', handleLightboxKeydown);
			};
		}
	});
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-white carousel-section"
>
	<div class="container px-6 md:px-12" bind:this={containerElement}>
		<HorizontalScroller>
			{#each displayedItems as item, index}
				{@const hasVideo = isFilled.linkToMedia(item.video)}
				{@const hasImage = isFilled.image(item.image)}
				{@const videoUrl = hasVideo && 'url' in item.video ? item.video.url : null}
				{@const originalIndex = getOriginalIndex(index)}
				<div
					bind:this={cardElements[index]}
					class="shrink-0 bg-gray-300 rounded-lg relative overflow-hidden aspect-4/5 w-[180px] md:w-[220px] lg:w-[260px] carousel-card"
					role="button"
					tabindex="0"
					onmouseenter={() => handleCardHover(cardElements[index], true)}
					onmouseleave={() => handleCardHover(cardElements[index], false)}
					onclick={() => {
						if (hasImage || hasVideo) {
							openLightbox(originalIndex);
						}
					}}
					onkeydown={(e) => {
						if ((e.key === 'Enter' || e.key === ' ') && (hasImage || hasVideo)) {
							e.preventDefault();
							openLightbox(originalIndex);
						}
					}}
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

	<!-- Lightbox Modal -->
	{#if lightboxOpen && lightboxIndex !== null}
		{@const currentItem = baseItems[lightboxIndex]}
		{@const hasVideo = currentItem && isFilled.linkToMedia(currentItem.video)}
		{@const hasImage = currentItem && isFilled.image(currentItem.image)}
		{@const videoUrl = hasVideo && currentItem.video && 'url' in currentItem.video ? currentItem.video.url : null}
		{@const hasMultiple = baseItems.length > 1}
		<div
			bind:this={lightboxElement}
			class="lightbox-overlay"
			onclick={handleLightboxBackdropClick}
			onkeydown={(e) => {
				if (e.key === 'Escape') {
					closeLightbox();
				}
			}}
			role="dialog"
			aria-modal="true"
			aria-label="Image lightbox"
			tabindex="-1"
		>
			<div
				class="lightbox-content"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => {
					if (e.key === 'Escape') {
						closeLightbox();
					}
				}}
				role="presentation"
			>
				<!-- Close button -->
				<Button
					class="lightbox-close"
					on:click={closeLightbox}
					aria-label="Close lightbox"
					type="button"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</Button>

				<!-- Navigation arrows -->
				{#if hasMultiple}
					<Button
						class="lightbox-nav lightbox-nav-prev"
						on:click={() => {
							const newIndex = lightboxIndex! > 0 ? lightboxIndex! - 1 : baseItems.length - 1;
							lightboxIndex = newIndex;
						}}
						aria-label="Previous image"
						type="button"
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</Button>
					<Button
						class="lightbox-nav lightbox-nav-next"
						on:click={() => {
							const newIndex = lightboxIndex! < baseItems.length - 1 ? lightboxIndex! + 1 : 0;
							lightboxIndex = newIndex;
						}}
						aria-label="Next image"
						type="button"
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</Button>
				{/if}

				<!-- Media content -->
				<div class="lightbox-media">
					{#if hasVideo && videoUrl}
						<video
							src={videoUrl}
							class="lightbox-video"
							controls
							autoplay
							loop
							muted
							playsinline
						></video>
					{:else if hasImage && currentItem}
						<div class="lightbox-image-wrapper">
							<PrismicImage
								field={currentItem.image}
								class="lightbox-image"
							/>
						</div>
					{/if}
				</div>

				<!-- Image counter -->
				{#if hasMultiple}
					<div class="lightbox-counter">
					{lightboxIndex + 1} / {baseItems.length}
					</div>
				{/if}
			</div>
		</div>
	{/if}
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

	/* Lightbox Styles */
	.lightbox-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.95);
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.lightbox-content {
		position: relative;
		width: 100%;
		height: 100%;
		max-width: 90vw;
		max-height: 90vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.lightbox-close) {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: white;
		z-index: 10000;
		transition: background-color 0.2s, border-color 0.2s;
	}

	:global(.lightbox-close:hover) {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.3);
	}

	:global(.lightbox-nav) {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: white;
		z-index: 10000;
		transition: background-color 0.2s, border-color 0.2s;
	}

	:global(.lightbox-nav:hover) {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.3);
	}

	:global(.lightbox-nav-prev) {
		left: 1rem;
	}

	:global(.lightbox-nav-next) {
		right: 1rem;
	}

	.lightbox-media {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lightbox-image-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lightbox-image-wrapper :global(img) {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
	}

	.lightbox-video {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
	}

	.lightbox-counter {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		color: white;
		background: rgba(0, 0, 0, 0.5);
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-size: clamp(0.75rem, 1vw + 0.5rem, 0.875rem); /* Responsive: 12px to 14px */
		z-index: 10000;
	}

	@media (max-width: 768px) {
		.lightbox-overlay {
			padding: 1rem;
		}

		:global(.lightbox-close) {
			top: 0.5rem;
			right: 0.5rem;
			width: 40px;
			height: 40px;
		}

		:global(.lightbox-nav) {
			width: 40px;
			height: 40px;
		}

		:global(.lightbox-nav-prev) {
			left: 0.5rem;
		}

		:global(.lightbox-nav-next) {
			right: 0.5rem;
		}
	}
</style>
