<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { isFilled } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { PrismicLink } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	// @ts-ignore - GSAP Flip import casing issue
	import { Flip } from 'gsap/Flip';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import HighlightText from '$lib/components/HighlightText.svelte';

	gsap.registerPlugin(Flip, ScrollTrigger);

	type Props = SliceComponentProps<Content.PathwaysCardsSlice>;

	const { slice }: Props = $props();

	// Pathways from Prismic (same structure as PathwaysPreview; index + 1 used for number)
	let pathways = $derived(slice.primary.pathways ?? []);

	let hoveredIndex: number = $state(-1);
	let previousHoveredIndex: number = $state(-1);
	let isMouseInCardArea: boolean = $state(false);
	let cardElements: (HTMLElement | undefined)[] = $state([]);
	let backgroundElement: HTMLElement | undefined = $state();
	
	// Element references for each card's animated elements
	let numberElements: (HTMLElement | undefined)[] = $state([]);
	let titleElements: (HTMLElement | undefined)[] = $state([]);
	let subtitleElements: (HTMLElement | undefined)[] = $state([]);
	let beforeTextElements: (HTMLElement | undefined)[] = $state([]);
	let afterTextElements: (HTMLElement | undefined)[] = $state([]);
	let arrowElements: (HTMLElement | undefined)[] = $state([]);
	
	// Element references for scroll animations
	let sectionElement: HTMLElement | undefined = $state();
	let eyebrowElement: HTMLElement | undefined = $state();
	let highlightTextElement: HTMLElement | undefined = $state();
	let dividerElements: (HTMLElement | undefined)[] = $state([]);

	// GSAP animations for text and arrow on hover
	function handleCardHover(index: number) {
		// Animate text colors to black
		if (numberElements[index]) {
			gsap.to(numberElements[index], { color: '#000000', duration: 0.3, ease: 'power2.out' });
		}
		if (titleElements[index]) {
			gsap.to(titleElements[index], { 
				color: '#000000', 
				x: 16,
				duration: 0.3, 
				ease: 'power2.out' 
			});
		}
		if (subtitleElements[index]) {
			gsap.to(subtitleElements[index], { 
				color: '#000000', 
				x: 16,
				duration: 0.3, 
				ease: 'power2.out' 
			});
		}
		if (beforeTextElements[index]) {
			gsap.to(beforeTextElements[index], { color: '#000000', duration: 0.3, ease: 'power2.out' });
		}
		if (afterTextElements[index]) {
			gsap.to(afterTextElements[index], { color: '#000000', duration: 0.3, ease: 'power2.out' });
		}

		// Animate arrow slide-in from left
		if (arrowElements[index]) {
			gsap.to(arrowElements[index], {
				opacity: 1,
				x: 0,
				color: '#000000',
				duration: 0.4,
				ease: 'power2.out'
			});
		}
	}

	function handleCardLeave(index: number) {
		// Animate text colors back to grey (when mouse is still in card area but not on this card)
		if (numberElements[index]) {
			gsap.to(numberElements[index], { color: '#858585', duration: 0.3, ease: 'power2.out' });
		}
		if (titleElements[index]) {
			gsap.to(titleElements[index], { 
				color: '#858585', 
				x: 0,
				duration: 0.3, 
				ease: 'power2.out' 
			});
		}
		if (subtitleElements[index]) {
			gsap.to(subtitleElements[index], { 
				color: '#858585', 
				x: 0,
				duration: 0.3, 
				ease: 'power2.out' 
			});
		}
		if (beforeTextElements[index]) {
			gsap.to(beforeTextElements[index], { color: '#858585', duration: 0.3, ease: 'power2.out' });
		}
		if (afterTextElements[index]) {
			gsap.to(afterTextElements[index], { color: '#858585', duration: 0.3, ease: 'power2.out' });
		}

		// Animate arrow slide-out to left
		if (arrowElements[index]) {
			gsap.to(arrowElements[index], {
				opacity: 0,
				x: -64,
				color: '#000000',
				duration: 0.4,
				ease: 'power2.out'
			});
		}
	}

	// Set all cards to white (when mouse leaves entire area)
	function setAllCardsToWhite() {
		pathways.forEach((_, index) => {
			if (numberElements[index]) {
				gsap.to(numberElements[index], { color: '#FFFFE6', duration: 0.3, ease: 'power2.out' });
			}
			if (titleElements[index]) {
				gsap.to(titleElements[index], { 
					color: '#FFFFE6', 
					x: 0,
					duration: 0.3, 
					ease: 'power2.out' 
				});
			}
			if (subtitleElements[index]) {
				gsap.to(subtitleElements[index], { 
					color: '#FFFFE6', 
					x: 0,
					duration: 0.3, 
					ease: 'power2.out' 
				});
			}
			if (beforeTextElements[index]) {
				gsap.to(beforeTextElements[index], { color: '#FFFFE6', duration: 0.3, ease: 'power2.out' });
			}
			if (afterTextElements[index]) {
				gsap.to(afterTextElements[index], { color: '#FFFFE6', duration: 0.3, ease: 'power2.out' });
			}
			if (arrowElements[index]) {
				gsap.to(arrowElements[index], {
					opacity: 0,
					x: -64,
					color: '#000000',
					duration: 0.4,
					ease: 'power2.out'
				});
			}
		});
	}

	// Initialize arrow positions and set all text to white
	function initializeArrows() {
		arrowElements.forEach((arrow) => {
			if (arrow) {
				gsap.set(arrow, {
					opacity: 0,
					x: -64,
					color: '#000000'
				});
			}
		});
		
		// Initialize all text elements to white
		numberElements.forEach((el) => {
			if (el) gsap.set(el, { color: '#FFFFE6' });
		});
		titleElements.forEach((el) => {
			if (el) gsap.set(el, { color: '#FFFFE6', x: 0 });
		});
		subtitleElements.forEach((el) => {
			if (el) gsap.set(el, { color: '#FFFFE6', x: 0 });
		});
		beforeTextElements.forEach((el) => {
			if (el) gsap.set(el, { color: '#FFFFE6' });
		});
		afterTextElements.forEach((el) => {
			if (el) gsap.set(el, { color: '#FFFFE6' });
		});
	}

	// Watch for hover state changes and trigger card animations
	$effect(() => {
		if (!isMouseInCardArea) {
			// Mouse is outside card area - set all to white
			setAllCardsToWhite();
		} else {
			// Mouse is in card area - set hovered card to black, others to grey
			pathways.forEach((_, index) => {
				if (hoveredIndex === index) {
					handleCardHover(index);
				} else {
					// Set to grey when mouse is in area but this card is not hovered
					handleCardLeave(index);
				}
			});
		}
	});

	onMount(() => {
		setTimeout(() => {
			initializeArrows();
		}, 100);
		
		// Initialize background element as hidden
		if (backgroundElement) {
			gsap.set(backgroundElement, { opacity: 0 });
		}

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

		// Animate pathway cards with stagger
		if (cardElements.length > 0 && cardElements.every(el => el)) {
			cardElements.forEach((card, index) => {
				if (!card) return;
				
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: card,
						start: 'top 85%',
						toggleActions: 'play reverse play reverse',
						onLeave: () => {
							if (card) {
								gsap.set(card, { opacity: 0, y: 40 });
							}
						}
					}
				});
				tl.fromTo(
					card,
					{ opacity: 0, y: 40 },
					{ opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: index * 0.1 }
				);
			});
		}

		// Animate dividers
		dividerElements.forEach((divider, index) => {
			if (!divider) return;
			
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: divider,
					start: 'top 85%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (divider) {
							gsap.set(divider, { scaleX: 0 });
						}
					}
				}
			});
			tl.fromTo(
				divider,
				{ scaleX: 0 },
				{ scaleX: 1, duration: 0.6, ease: 'power2.out', delay: (index + 1) * 0.1 }
			);
		});

		return () => {
			// Clean up all ScrollTriggers associated with this component
			ScrollTrigger.getAll().forEach((trigger) => {
				const triggerElement = trigger.vars.trigger as HTMLElement;
				if (triggerElement === eyebrowElement ||
				    triggerElement === highlightTextElement ||
				    cardElements.includes(triggerElement) ||
				    dividerElements.includes(triggerElement)) {
					trigger.kill();
				}
			});
		};
	});

	// Animate background sliding with manual GSAP tweens (not FLIP) to control opacity separately
	$effect(() => {
		if (!backgroundElement) return;

		const wasHovered = previousHoveredIndex >= 0;
		const isHovered = hoveredIndex >= 0;

		if (!isHovered) {
			// Hide background if nothing is hovered
			gsap.killTweensOf(backgroundElement);
			gsap.to(backgroundElement, {
				opacity: 0,
				duration: 0.3,
				ease: 'power2.out',
				onComplete: () => {
					// Ensure it stays hidden
					if (backgroundElement && hoveredIndex < 0) {
						gsap.set(backgroundElement, { opacity: 0 });
					}
				}
			});
			previousHoveredIndex = hoveredIndex;
			return;
		}

		const targetCard = cardElements[hoveredIndex];
		if (!targetCard) return;

		const cardRect = targetCard.getBoundingClientRect();
		const containerRect = targetCard.parentElement?.getBoundingClientRect();
		
		if (!containerRect) return;

		// Calculate target position and size
		const targetTop = cardRect.top - containerRect.top;
		const targetLeft = cardRect.left - containerRect.left;
		const targetWidth = cardRect.width;
		const targetHeight = cardRect.height;

		// Kill all running animations on this element
		gsap.killTweensOf(backgroundElement);

		// Always ensure opacity is 1 before animating (for both first hover and card transitions)
		gsap.set(backgroundElement, { opacity: 1 });
		
		// Animate position and size, keeping opacity at 1 throughout
		gsap.to(backgroundElement, {
			top: targetTop,
			left: targetLeft,
			width: targetWidth,
			height: targetHeight,
			opacity: 1, // Explicitly keep opacity at 1 - this prevents any fade
			duration: 0.4,
			ease: 'power2.out',
			overwrite: true
		});

		// Update previous index for next transition
		previousHoveredIndex = hoveredIndex;
	});
</script>

<section
	bind:this={sectionElement}
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-[#FFFFE6] py-16 md:py-24"
>
	<div class="container px-6 md:px-12">
		{#if slice.primary.eyebrow_text}
			<h2 bind:this={eyebrowElement} class="eyebrow-text">
				{slice.primary.eyebrow_text}
			</h2>
		{/if}

		{#if slice.primary.copy}
			<div bind:this={highlightTextElement}>
				<HighlightText text={slice.primary.copy} className="mb-12 md:mb-16 mt-8" />
			</div>
		{/if}

		{#if pathways && pathways.length > 0}
			<div 
				class="flex flex-col gap-0 relative"
				role="presentation"
				onmouseenter={() => {
					isMouseInCardArea = true;
				}}
				onmouseleave={() => {
					isMouseInCardArea = false;
					hoveredIndex = -1;
				}}
			>
				<div
					bind:this={backgroundElement}
					class="absolute bg-[#8BD475] rounded-xl z-0 opacity-0"
				></div>
				{#each pathways as pathway, index}
					{#if pathway}
						<div
							bind:this={cardElements[index]}
							class="relative py-6 px-4 rounded-xl bg-transparent z-1 {isFilled.link(pathway.link) ? 'cursor-pointer' : 'cursor-default'}"
							role="presentation"
							onmouseenter={() => {
								hoveredIndex = index;
							}}
							onmouseleave={() => {
								hoveredIndex = -1;
							}}
						>
							{#if isFilled.link(pathway.link)}
								<PrismicLink
									field={pathway.link}
									class="absolute inset-0 z-10 no-underline text-inherit"
									aria-hidden="true"
								/>
							{/if}
							<!-- Mobile: single column stack. Desktop: 4-column grid -->
							<div class="grid grid-cols-1 md:grid-cols-[320px_1fr_48px_1fr] items-center gap-4 md:gap-12 relative">
								<div class="flex items-start gap-3 shrink-0 md:gap-4">
									<span
										bind:this={numberElements[index]}
										class="text-[#FFFFE6] text-base leading-[1.2] md:text-xl"
										style="font-family: 'Venus+', sans-serif;"
									>
										{index + 1}
									</span>
									<div class="flex flex-col gap-1">
										<h3
											bind:this={titleElements[index]}
											class="text-[#FFFFE6] text-3xl font-normal leading-[1.2] m-0 md:text-[2.5rem]"
											style="font-family: 'Auge Trial', sans-serif;"
										>
											{pathway.title}
										</h3>
										{#if pathway.subtitle}
											<p
												bind:this={subtitleElements[index]}
												class="text-[#FFFFE6] text-sm font-normal uppercase tracking-[0.05em] leading-[1.4] m-0 opacity-90"
												style="font-family: 'ClashDisplay Variable', sans-serif;"
											>
												{pathway.subtitle}
											</p>
										{/if}
									</div>
								</div>
								{#if pathway.before_text}
									<p
										bind:this={beforeTextElements[index]}
										class="text-[#FFFFE6] text-base font-normal leading-normal m-0 min-w-0"
										style="font-family: 'Manrope', sans-serif;"
									>
										{pathway.before_text}
									</p>
								{:else}
									<div></div>
								{/if}
								<!-- Mobile: downward arrow, always visible (not bound so no hover/GSAP) -->
								<div class="shrink-0 flex justify-center md:hidden text-[#FFFFE6]/90" aria-hidden="true">
									<svg
										width="48"
										height="48"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M12 5V19M12 19L5 12M12 19L19 12"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</div>
								<!-- Desktop: horizontal arrow (bound for hover animation) -->
								<div bind:this={arrowElements[index]} class="shrink-0 hidden md:flex justify-center">
									<svg
										width="48"
										height="48"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M5 12H19M19 12L12 5M19 12L12 19"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</div>
								{#if pathway.after_text}
									<p
										bind:this={afterTextElements[index]}
										class="text-[#FFFFE6] text-base font-normal leading-normal m-0 min-w-0"
										style="font-family: 'Manrope', sans-serif;"
									>
										{pathway.after_text}
									</p>
								{:else}
									<div></div>
								{/if}
							</div>
						</div>
						{#if index < pathways.length - 1}
							<div bind:this={dividerElements[index]} class="h-px bg-[rgba(255,255,230,0.2)] m-0"></div>
						{/if}
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</section>
