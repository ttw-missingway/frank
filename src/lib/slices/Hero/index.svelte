<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);

	type Props = SliceComponentProps<Content.HeroSlice>;

	const { slice }: Props = $props();

	let heroSection: HTMLElement;
	let state1Container: HTMLElement;
	let state2Container: HTMLElement;
	let roundedContainer: HTMLElement;
	let textContainer: HTMLElement;
	let videosContainer: HTMLElement;
	let videoWrapper: HTMLElement;

	// Helper function to animate elements from different directions
	function animateFromDirections(elements: NodeListOf<Element>, delay: number = 0) {
		const directions = ['top', 'bottom', 'left', 'right'];
		const distance = 100;

		elements.forEach((el, index) => {
			// Use a more varied pattern: mix of cycling and some randomness
			const directionIndex = (index * 3 + Math.floor(index / 2)) % directions.length;
			const direction = directions[directionIndex];
			let initialX = 0;
			let initialY = 0;

			switch (direction) {
				case 'top':
					initialY = -distance;
					break;
				case 'bottom':
					initialY = distance;
					break;
				case 'left':
					initialX = -distance;
					break;
				case 'right':
					initialX = distance;
					break;
			}

			gsap.set(el, { opacity: 0, x: initialX, y: initialY });

			gsap.to(el, {
				opacity: 1,
				x: 0,
				y: 0,
				duration: 0.67,
				ease: 'power3.out',
				delay: delay + index * 0.1
			});
		});
	}

	// Helper function to animate elements out
	function animateOut(elements: NodeListOf<Element>, timeline: gsap.core.Timeline) {
		elements.forEach((el, index) => {
			timeline.to(
				el,
				{
					opacity: 0,
					y: -30,
					duration: 0.53,
					ease: 'power3.in'
				},
				index * 0.067
			);
		});
	}

	onMount(() => {
		if (!heroSection || !state1Container || !state2Container || !roundedContainer || !textContainer || !videosContainer || !videoWrapper)
			return;

		// Set initial state - state 1 visible, state 2 hidden
		gsap.set(state2Container, { opacity: 0, pointerEvents: 'none', y: 0 });
		gsap.set(state1Container, { opacity: 1 });
		gsap.set(textContainer, { y: 0 });

		// Animate state 1 elements in on mount
		const state1Elements = state1Container.querySelectorAll('[data-animate]');
		animateFromDirections(state1Elements, 0.2);

		let currentState = 1;
		let state1Timeline: gsap.core.Timeline | null = null;
		let state2Timeline: gsap.core.Timeline | null = null;
		let roundedContainerScaled = false;
		let roundedContainerGrown = false;

		// Set initial scale for rounded container (80% = smallest state)
		gsap.set(roundedContainer, { scaleX: 0.8 });

		// Set fixed size for videos container and counteract parent scale
		let resizeObserver: ResizeObserver | null = null;
		if (videosContainer && roundedContainer && videoWrapper) {
			const updateVideosSize = () => {
				// Get the parent container's dimensions (roundedContainer with inset-0 matches this at scale 1.0)
				const parentContainer = roundedContainer.parentElement;
				if (parentContainer) {
					const rect = parentContainer.getBoundingClientRect();
					// Set fixed size for videos container - this never changes
					videosContainer.style.width = `${rect.width}px`;
					videosContainer.style.height = `${rect.height}px`;
				}
			};
			
			const updateVideosScale = () => {
				// Counteract the parent's scale so videos stay fixed size
				const parentScale = (gsap.getProperty(roundedContainer, 'scaleX') as number) || 0.8;
				const inverseScale = 1 / parentScale;
				gsap.set(videosContainer, { scaleX: inverseScale, scaleY: 1 });
			};
			
			updateVideosSize();
			updateVideosScale();
			
			resizeObserver = new ResizeObserver(() => {
				updateVideosSize();
				updateVideosScale();
			});
			resizeObserver.observe(videoWrapper);
		}

		// Pin the hero section
		ScrollTrigger.create({
			trigger: heroSection,
			start: 'top top',
			end: '+=200%',
			pin: true,
			pinSpacing: true,
			onUpdate: (self) => {
				const progress = self.progress;
				const threshold = 0.35;

				// Transition to state 2
				if (progress >= threshold && currentState === 1) {
					currentState = 2;

					// Exit animation for state 1
					if (state1Timeline) state1Timeline.kill();
					state1Timeline = gsap.timeline();
					animateOut(state1Elements, state1Timeline);
					state1Timeline.to(
						state1Container,
						{
							opacity: 0,
							pointerEvents: 'none',
							duration: 0.2
						},
						'-=0.2'
					);

					// Show state 2 container
					gsap.to(state2Container, {
						opacity: 1,
						pointerEvents: 'auto',
						duration: 0.2
					});

					// Enter animation for state 2
					const state2Elements = state2Container.querySelectorAll('[data-animate]');
					if (state2Timeline) state2Timeline.kill();
					animateFromDirections(state2Elements, 0.13);
				}
				// Transition back to state 1
				else if (progress < threshold && currentState === 2) {
					currentState = 1;

					// Exit animation for state 2
					const state2Elements = state2Container.querySelectorAll('[data-animate]');
					if (state2Timeline) state2Timeline.kill();
					state2Timeline = gsap.timeline();
					animateOut(state2Elements, state2Timeline);
					state2Timeline.to(
						state2Container,
						{
							opacity: 0,
							pointerEvents: 'none',
							duration: 0.2
						},
						'-=0.2'
					);

					// Show state 1 container
					gsap.to(state1Container, {
						opacity: 1,
						pointerEvents: 'auto',
						duration: 0.2
					});

					// Enter animation for state 1
					if (state1Timeline) state1Timeline.kill();
					animateFromDirections(state1Elements, 0.13);
				}

				// Scale rounded container from 80% (smallest) to 100% (largest) - single trigger animation
				const scaleTrigger = 0.9; // Trigger point for scaling
				const scaleStart = 0.8; // Smallest state (80%)
				const scaleEnd = 1.0; // Largest state (100% - fills container)

				// Trigger grow animation
				if (progress >= scaleTrigger && !roundedContainerGrown) {
					roundedContainerGrown = true;
					gsap.to(roundedContainer, {
						scaleX: scaleEnd,
						duration: 1.5,
						ease: 'power2.out',
						onUpdate: () => {
							if (videosContainer) {
								const parentScale = (gsap.getProperty(roundedContainer, 'scaleX') as number) || 0.8;
								const inverseScale = 1 / parentScale;
								gsap.set(videosContainer, { scaleX: inverseScale, scaleY: 1 });
							}
						}
					});
				}
				// Trigger shrink animation
				else if (progress < scaleTrigger && roundedContainerGrown) {
					roundedContainerGrown = false;
					gsap.to(roundedContainer, {
						scaleX: scaleStart,
						duration: 1.5,
						ease: 'power2.out',
						onUpdate: () => {
							if (videosContainer) {
								const parentScale = (gsap.getProperty(roundedContainer, 'scaleX') as number) || 0.8;
								const inverseScale = 1 / parentScale;
								gsap.set(videosContainer, { scaleX: inverseScale, scaleY: 1 });
							}
						}
					});
				}
				
				// Continuously update videos scale to counteract parent scale
				if (videosContainer) {
					const currentScale = (gsap.getProperty(roundedContainer, 'scaleX') as number) || 0.8;
					const inverseScale = 1 / currentScale;
					gsap.set(videosContainer, { scaleX: inverseScale, scaleY: 1 });
				}

				// Fade out animations at the end
				if (progress >= 0.92 && !roundedContainerScaled) {
					roundedContainerScaled = true;
					// Fade out state 2 first (slightly before text) - slide up as it fades
					gsap.to(state2Container, {
						opacity: 0,
						y: -50,
						duration: 1,
						ease: 'power2.out'
					});
					// Fade out text slightly after state 2 - slide up slower than state 2
					gsap.to(textContainer, {
						opacity: 0,
						y: -30,
						duration: 1,
						delay: 0.2,
						ease: 'power2.out'
					});
				} else if (progress < 0.92 && roundedContainerScaled) {
					roundedContainerScaled = false;
					// Fade in text first
					gsap.to(textContainer, {
						opacity: 1,
						y: 0,
						duration: 1,
						ease: 'power2.out'
					});
					// Fade in state 2 when container scales back (only if it should be visible)
					if (currentState === 2) {
						gsap.to(state2Container, {
							opacity: 1,
							y: 0,
							duration: 1,
							delay: 0.2,
							ease: 'power2.out'
						});
					}
				}
			}
		});

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => {
				if (trigger.vars.trigger === heroSection) {
					trigger.kill();
				}
			});
			if (state1Timeline) state1Timeline.kill();
			if (state2Timeline) state2Timeline.kill();
			if (resizeObserver) resizeObserver.disconnect();
		};
	});
</script>

<section
	bind:this={heroSection}
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="min-h-[200vh] bg-black text-white flex flex-col relative container"
>
	<!-- State 1: Lincoln Quote with Pills (Top Section) -->
	<div
		bind:this={state1Container}
		class="max-h-[80vh] absolute inset-0 flex flex-col justify-center items-center"
	>
		<div class="text-center max-w-5xl px-4">
			<div class="flex flex-col items-center gap-1 md:gap-2">
				<span class="inline-flex flex-wrap items-center justify-center gap-1 md:gap-2 lg:gap-3 formal-heading">
					<span data-animate>Lincoln</span>
					<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(6rem,20vw+3rem,12rem)] rounded-full overflow-hidden shrink-0" data-animate>
						<img src="/images/abe.png" alt="" class="h-full w-full object-cover" />
					</div>
					<span data-animate>wrote</span>
				</span>
				<span class="inline-flex flex-wrap items-center justify-center gap-1 md:gap-2 lg:gap-3 formal-heading">
					<span data-animate>"I</span>
					<span data-animate>would've</span>
					<span data-animate>sent</span>
					<span data-animate>a</span>
					<span data-animate>shorter</span>
					<span data-animate>letter</span>
				</span>
				<span class="inline-flex flex-wrap items-center justify-center gap-1 md:gap-2 lg:gap-3 formal-heading">
					<span data-animate>if</span>
					<span data-animate>I</span>
					<span data-animate>had</span>
					<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(4rem,15vw+2rem,9.25rem)] bg-white rounded-full overflow-hidden flex items-center justify-center shrink-0" data-animate>
						<span class="text-black font-medium" style="font-size: clamp(0.5rem, 1.5vw + 0.5rem, 0.75rem);">⏰</span>
					</div>
					<span data-animate>more</span>
					<span data-animate>time"</span>
				</span>
			</div>
		</div>
	</div>
	<!-- State 2: Startup Founders with Pills (Bottom Section) -->
	<div
		bind:this={state2Container}
		class="max-h-[80vh] absolute inset-0 flex flex-col justify-center items-center"
	>
		<div class="text-center max-w-5xl px-4">
			<div class="flex flex-col items-center gap-1 md:gap-2">
				<span class="inline-flex flex-wrap items-center justify-center gap-1 md:gap-2 lg:gap-3 formal-heading">
					<span data-animate>Startup</span>
					<span data-animate>Founders,</span>
					<span data-animate>you</span>
				</span>
				<span class="inline-flex flex-wrap items-center justify-center gap-1 md:gap-2 lg:gap-3 formal-heading">
					<span data-animate>already</span>
					<span data-animate>work</span>
					<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(4rem,15vw+2rem,9.25rem)] bg-white rounded-full overflow-hidden shrink-0" data-animate>
						<img src="/images/horse.gif" alt="" class="h-full w-full object-cover" />
					</div>
					<span class="text-italic" data-animate>60+</span>
					<span class="text-italic" data-animate>hours</span>
				</span>
				<span class="inline-flex flex-wrap items-center justify-center gap-1 md:gap-2 lg:gap-3 formal-heading">
					<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(4rem,15vw+2rem,9.25rem)] bg-white rounded-full overflow-hidden shrink-0" data-animate>
						<img src="/images/candle.gif" alt="" class="h-full w-full object-cover" />
					</div>
					<span data-animate>per</span>
					<span data-animate>week...</span>
				</span>
			</div>
		</div>
	</div>
	<div
		bind:this={videoWrapper}
		class="h-screen relative top-[70vh] pt-5 flex flex-col items-center justify-center gap-6 md:gap-10 w-full px-4"
	>
		<div bind:this={textContainer} class="flex flex-col items-center justify-center gap-2 w-full max-w-4xl">
			<h2 class="body-copy">Let us handle the messaging</h2>
			<div class="flex flex-row flex-wrap items-center justify-center gap-3 md:gap-4 lg:gap-6 w-full">
				<p class="small-copy">Marriott Autograph Collection</p>
				<p class="small-copy">United Airlines</p>
				<p class="small-copy">G•Shock</p>
				<p class="small-copy">19 AAF "Addy" Awards</p>
			</div>
		</div>
		<div class="h-full w-full relative">
			<!-- Mask container - scales and reveals more of the videos -->
			<div
				bind:this={roundedContainer}
				class="absolute inset-0 bg-slate-500 rounded-3xl overflow-hidden"
				style="transform-origin: center;"
			>
				<!-- Fixed-size videos container - counteracts parent scale to stay fixed size -->
				<div
					bind:this={videosContainer}
					class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row"
					style="transform-origin: center;"
				>
					{#each Array(3) as _, i}
						<div class="flex-1 h-full relative">
							<iframe
								src="https://customer-yy99jk2iutjm3e4s.cloudflarestream.com/0d5e4df84aa685c96d585ecbc1a4e2f8/iframe?muted=true&loop=true&autoplay=true&poster=https%3A%2F%2Fcustomer-yy99jk2iutjm3e4s.cloudflarestream.com%2F0d5e4df84aa685c96d585ecbc1a4e2f8%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"
								loading="lazy"
								title="Hero video"
								style="border: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
								class="rounded-none"
								allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
								allowfullscreen={true}
							></iframe>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
