<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { isFilled } from '@prismicio/client';
	import HighlightText from '$lib/components/HighlightText.svelte';
	import HorizontalScroller from '$lib/components/HorizontalScroller.svelte';
	import TiltCard from '$lib/components/TiltCard.svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	gsap.registerPlugin(ScrollTrigger);

	type Props = SliceComponentProps<Content.SelectedWorkSlice>;

	const { slice }: Props = $props();

	let scrollerContainer: HTMLElement | null = $state(null);
	let glowElement: HTMLElement | null = $state(null);
	let isHoveringScroller = $state(false);
	
	// Element references for scroll animations
	let sectionElement: HTMLElement | undefined = $state();
	let eyebrowElement: HTMLElement | undefined = $state();
	let highlightTextElement: HTMLElement | undefined = $state();

	function handleCardHover(isHovering: boolean) {
		
		if (!glowElement) return;

		if (isHovering) {
			// Grow glow when hovering over card
			gsap.to(glowElement, {
				width: 500,
				height: 500,
				filter: 'blur(50px)',
				duration: 0.6,
				ease: 'power2.out'
			});
		} else {
			// Shrink glow when not hovering over card
			gsap.to(glowElement, {
				width: 150,
				height: 150,
				filter: 'blur(20px)',
				duration: 0.6,
				ease: 'power2.out'
			});
		}
	}

	function handleScrollerHover(isHovering: boolean) {
		isHoveringScroller = isHovering;
		if (!glowElement) return;

		gsap.killTweensOf(glowElement);

		if (isHovering) {
			// Fade in smoothly first - slower than card animation
			gsap.to(glowElement, {
				opacity: 0.5,
				duration: 0.9,
				ease: 'power2.out',
				onComplete: () => {
					// Create subtle flickering electric light effect
					// Using a function-based approach for organic flicker
					const baseOpacity = 0.5;
					const variation = 0.04; // Subtle variation
					
					// Electric flicker - less frequent, subtle opacity changes
					const flicker = () => {
						const targetOpacity = baseOpacity + (Math.random() - 0.5) * variation * 2;
						const duration = 0.15 + Math.random() * 0.2; // Much slower flicker
						
						gsap.to(glowElement, {
							opacity: targetOpacity,
							duration: duration,
							ease: 'power1.inOut',
							onComplete: flicker
						});
					};
					
					flicker();
				}
			});
		} else {
			// Fade out smoothly - lingering afterglow
			gsap.to(glowElement, {
				opacity: 0,
				duration: 2.5,
				ease: 'power1.out'
			});
		}
	}

	function handleScrollerMouseMove(event: MouseEvent) {
		if (!scrollerContainer || !glowElement || !isHoveringScroller) return;

		const rect = scrollerContainer.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		// Position glow centered at mouse cursor with slight lag
		gsap.to(glowElement, {
			x: x,
			y: y,
			xPercent: -50,
			yPercent: -50,
			duration: 0.7,
			ease: 'power2.out'
		});
	}

	onMount(() => {
		// Animate eyebrow text
		if (eyebrowElement) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: eyebrowElement,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (eyebrowElement) {
							gsap.set(eyebrowElement, { opacity: 0, y: -20 });
						}
					}
				}
			});
			tl.fromTo(
				eyebrowElement,
				{ opacity: 0, y: -20 },
				{ opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
			);
		}

		// Animate highlight text container
		if (highlightTextElement) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: highlightTextElement,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (highlightTextElement) {
							gsap.set(highlightTextElement, { opacity: 0, y: 30 });
						}
					}
				}
			});
			tl.fromTo(
				highlightTextElement,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
			);
		}

		// Animate scroller wrapper
		if (scrollerContainer) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: scrollerContainer,
					start: 'top 85%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (scrollerContainer) {
							gsap.set(scrollerContainer, { opacity: 0, y: 50 });
						}
					}
				}
			});
			tl.fromTo(
				scrollerContainer,
				{ opacity: 0, y: 50 },
				{ opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
			);
		}

		return () => {
			// Clean up all ScrollTriggers associated with this component
			ScrollTrigger.getAll().forEach((trigger) => {
				const triggerElement = trigger.vars.trigger as HTMLElement;
				if (triggerElement === eyebrowElement ||
				    triggerElement === highlightTextElement ||
				    triggerElement === scrollerContainer) {
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
	class="bg-black text-[#FFFFE6] py-12 md:py-16"
>
	<div class="container px-6 md:px-12 mb-8 md:mb-12">
		{#if slice.primary.eyebrow_text}
			<p bind:this={eyebrowElement} class="eyebrow-text">{slice.primary.eyebrow_text}</p>
		{/if}
		{#if slice.primary.heading}
			<div bind:this={highlightTextElement}>
				<HighlightText text={slice.primary.heading} className="mb-12 md:mb-16 mt-8" />
			</div>
		{/if}
	</div>

	<div
		class="scroller-wrapper"
		role="presentation"
		bind:this={scrollerContainer}
		onmouseenter={() => handleScrollerHover(true)}
		onmouseleave={() => handleScrollerHover(false)}
		onmousemove={(e) => handleScrollerMouseMove(e)}
	>
		<div class="glow-effect" bind:this={glowElement}></div>
		<HorizontalScroller overflowPadding={60}>
			{#each slice.primary.selected_work || [] as item}
				{@const work = (item as any).work}
				{@const hasWork = work && 'data' in work && work.data}
				{#if hasWork}
					{@const featuredVideo = work.data?.featured_video}
					{@const featuredImage = work.data?.featured_image}
					{@const hasVideo = featuredVideo && isFilled.linkToMedia(featuredVideo)}
					{@const hasImage = featuredImage && isFilled.image(featuredImage)}
					{@const workUid = 'uid' in work ? work.uid : null}
					{@const workLink = workUid ? `/work/${workUid}` : null}
					<TiltCard
						image={hasImage ? featuredImage : null}
						video={hasVideo ? featuredVideo : null}
						link={workLink}
						onHoverChange={handleCardHover}
					/>
				{/if}
			{/each}
		</HorizontalScroller>
	</div>
</section>

<style>
	.scroller-wrapper {
		position: relative;
	}

	.glow-effect {
		position: absolute;
		width: 150px;
		height: 150px;
		left: 0;
		top: 0;
		background: radial-gradient(
			circle at center,
			rgba(139, 212, 117, 0.6) 0%,
			rgba(139, 212, 117, 0.4) 25%,
			rgba(139, 212, 117, 0.25) 40%,
			rgba(139, 212, 117, 0.15) 55%,
			rgba(139, 212, 117, 0.08) 70%,
			transparent 85%
		);
		border-radius: 50%;
		opacity: 0;
		pointer-events: none;
		z-index: 0;
		filter: blur(20px);
		will-change: opacity, transform, width, height, filter;
	}

</style>
