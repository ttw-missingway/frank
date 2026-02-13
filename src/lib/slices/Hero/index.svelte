<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { PrismicImage } from '@prismicio/svelte';
	import { isFilled } from '@prismicio/client';
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

		// Set initial states for all animated elements immediately to prevent flicker
		const state1Elements = state1Container.querySelectorAll('[data-animate]');
		const state2Elements = state2Container.querySelectorAll('[data-animate]');
		
		// Set initial states for state 1 elements immediately
		state1Elements.forEach((el) => {
			const directions = ['top', 'bottom', 'left', 'right'];
			const distance = 100;
			const index = Array.from(state1Elements).indexOf(el);
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
		});

		// Set initial states for state 2 elements immediately (they're hidden anyway, but this prevents any flicker)
		state2Elements.forEach((el) => {
			const directions = ['top', 'bottom', 'left', 'right'];
			const distance = 100;
			const index = Array.from(state2Elements).indexOf(el);
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
		});

		// Animate state 1 elements in on mount
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
						},
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
	class="min-h-[200vh] bg-black text-[#FFFFE6] flex flex-col relative container overflow-visible"
>
	<!-- State 1: Lincoln Quote with Pills (Top Section) -->
	<div
		bind:this={state1Container}
		class="max-h-[80vh] absolute inset-0 flex flex-col justify-center items-center"
	>
		<!-- Desktop State 1 -->
		<div class="hidden md:block text-center max-w-5xl px-4">
			<div class="flex flex-col items-center gap-1 md:gap-2">
				<span class="inline-flex flex-wrap items-center justify-center gap-1 md:gap-2 lg:gap-3 formal-heading">
					<span data-animate>Lincoln</span>
					{#if slice.primary.pills?.[0]}
						{@const pill0 = slice.primary.pills[0]}
						{@const pill0HasVideo = isFilled.linkToMedia(pill0.pill_video)}
						{@const pill0HasImage = isFilled.image(pill0.pill_image)}
						{@const pill0VideoUrl = pill0HasVideo && 'url' in pill0.pill_video ? pill0.pill_video.url : null}
						<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(6rem,20vw+3rem,12rem)] rounded-full overflow-hidden shrink-0" data-animate>
							{#if pill0HasVideo && pill0VideoUrl}
								<video
									src={pill0VideoUrl}
									class="h-full w-full object-cover"
									autoplay
									loop
									muted
									playsinline
								></video>
							{:else if pill0HasImage}
								<PrismicImage
									field={pill0.pill_image}
									class="h-full w-full object-cover"
								/>
							{/if}
						</div>
					{/if}
					<span data-animate>wrote</span>
				</span>
				<span class="inline-flex flex-wrap items-center justify-center gap-1 md:gap-2 lg:gap-3 formal-heading-italic">
					<span data-animate>"I</span>
					<span data-animate>would've</span>
					<span data-animate>sent</span>
					<span data-animate>a</span>
					<span data-animate>shorter</span>
					<span data-animate>letter</span>
				</span>
				<span class="inline-flex flex-wrap items-center justify-center gap-1 md:gap-2 lg:gap-3 formal-heading-italic">
					<span data-animate>if</span>
					<span data-animate>I</span>
					<span data-animate>had</span>
					{#if slice.primary.pills?.[1]}
						{@const pill1 = slice.primary.pills[1]}
						{@const pill1HasVideo = isFilled.linkToMedia(pill1.pill_video)}
						{@const pill1HasImage = isFilled.image(pill1.pill_image)}
						{@const pill1VideoUrl = pill1HasVideo && 'url' in pill1.pill_video ? pill1.pill_video.url : null}
						<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(6rem,20vw+3rem,9.25rem)] rounded-full overflow-hidden shrink-0" data-animate>
							{#if pill1HasVideo && pill1VideoUrl}
								<video
									src={pill1VideoUrl}
									class="h-full w-full object-cover"
									autoplay
									loop
									muted
									playsinline
								></video>
							{:else if pill1HasImage}
								<PrismicImage
									field={pill1.pill_image}
									class="h-full w-full object-cover"
								/>
							{/if}
						</div>
					{/if}
					<span data-animate>more</span>
					<span data-animate>time"</span>
				</span>
			</div>
		</div>
		<!-- Mobile State 1 -->
		<div class="block md:hidden text-center max-w-5xl px-4">
			<div class="flex flex-col items-center gap-1 md:gap-2">
				<span class="inline-flex flex-wrap items-center justify-center formal-heading hero-text-line">
					<span class="hero-word-group" data-animate>Lincoln</span>
					{#if slice.primary.pills?.[0]}
						{@const pill0 = slice.primary.pills[0]}
						{@const pill0HasVideo = isFilled.linkToMedia(pill0.pill_video)}
						{@const pill0HasImage = isFilled.image(pill0.pill_image)}
						{@const pill0VideoUrl = pill0HasVideo && 'url' in pill0.pill_video ? pill0.pill_video.url : null}
						<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(6rem,20vw+3rem,12rem)] rounded-full overflow-hidden shrink-0" data-animate>
							{#if pill0HasVideo && pill0VideoUrl}
								<video
									src={pill0VideoUrl}
									class="h-full w-full object-cover"
									autoplay
									loop
									muted
									playsinline
								></video>
							{:else if pill0HasImage}
								<PrismicImage
									field={pill0.pill_image}
									class="h-full w-full object-cover"
								/>
							{/if}
						</div>
					{/if}
					<span class="hero-word-group" data-animate>wrote</span>
				</span>
				<span class="inline-flex flex-wrap items-center justify-center formal-heading-italic hero-text-line">
					<span class="hero-word-group" data-animate>"I would've sent</span>
					<span class="hero-word-group" data-animate>a shorter letter</span>
				</span>
				<span class="inline-flex flex-wrap items-center justify-center formal-heading-italic hero-text-line">
					<span class="hero-word-group" data-animate>if I had</span>
					{#if slice.primary.pills?.[1]}
						{@const pill1 = slice.primary.pills[1]}
						{@const pill1HasVideo = isFilled.linkToMedia(pill1.pill_video)}
						{@const pill1HasImage = isFilled.image(pill1.pill_image)}
						{@const pill1VideoUrl = pill1HasVideo && 'url' in pill1.pill_video ? pill1.pill_video.url : null}
						<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(4rem,15vw+2rem,9.25rem)] rounded-full overflow-hidden shrink-0" data-animate>
							{#if pill1HasVideo && pill1VideoUrl}
								<video
									src={pill1VideoUrl}
									class="h-full w-full object-cover"
									autoplay
									loop
									muted
									playsinline
								></video>
							{:else if pill1HasImage}
								<PrismicImage
									field={pill1.pill_image}
									class="h-full w-full object-cover"
								/>
							{/if}
						</div>
					{/if}
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
		<!-- Desktop State 2 -->
		<div class="hidden md:block text-center max-w-5xl px-4">
			<div class="flex flex-col items-center gap-1 md:gap-2">
				<span class="inline-flex flex-wrap items-center justify-center gap-1 md:gap-2 lg:gap-3 formal-heading">
					<span data-animate>Startup</span>
					<span data-animate>Founders,</span>
					<span data-animate>you</span>
				</span>
				<span class="inline-flex flex-wrap items-center justify-center gap-1 md:gap-2 lg:gap-3 formal-heading">
					<span data-animate>already</span>
					<span data-animate>work</span>
					{#if slice.primary.pills?.[2]}
						{@const pill2 = slice.primary.pills[2]}
						{@const pill2HasVideo = isFilled.linkToMedia(pill2.pill_video)}
						{@const pill2HasImage = isFilled.image(pill2.pill_image)}
						{@const pill2VideoUrl = pill2HasVideo && 'url' in pill2.pill_video ? pill2.pill_video.url : null}
						<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(6rem,20vw+3rem,9.25rem)] rounded-full overflow-hidden shrink-0" data-animate>
							{#if pill2HasVideo && pill2VideoUrl}
								<video
									src={pill2VideoUrl}
									class="h-full w-full object-cover"
									autoplay
									loop
									muted
									playsinline
								></video>
							{:else if pill2HasImage}
								<PrismicImage
									field={pill2.pill_image}
									class="h-full w-full object-cover"
								/>
							{/if}
						</div>
					{/if}
					<span class="formal-heading-italic" data-animate>60+</span>
					<span class="formal-heading-italic" data-animate>hours</span>
				</span>
				<span class="inline-flex flex-wrap items-center justify-center gap-1 md:gap-2 lg:gap-3 formal-heading">
					{#if slice.primary.pills?.[3]}
						{@const pill3 = slice.primary.pills[3]}
						{@const pill3HasVideo = isFilled.linkToMedia(pill3.pill_video)}
						{@const pill3HasImage = isFilled.image(pill3.pill_image)}
						{@const pill3VideoUrl = pill3HasVideo && 'url' in pill3.pill_video ? pill3.pill_video.url : null}
						<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(4rem,15vw+2rem,9.25rem)] rounded-full overflow-hidden shrink-0" data-animate>
							{#if pill3HasVideo && pill3VideoUrl}
								<video
									src={pill3VideoUrl}
									class="h-full w-full object-cover"
									autoplay
									loop
									muted
									playsinline
								></video>
							{:else if pill3HasImage}
								<PrismicImage
									field={pill3.pill_image}
									class="h-full w-full object-cover"
								/>
							{/if}
						</div>
					{/if}
					<span data-animate>per</span>
					<span data-animate>week...</span>
				</span>
			</div>
		</div>
		<!-- Mobile State 2 -->
		<div class="block md:hidden text-center max-w-5xl px-4">
			<div class="flex flex-col items-center gap-1 md:gap-2">
				<span class="inline-flex flex-wrap items-center justify-center formal-heading hero-text-line">
					<span class="hero-word-group" data-animate>Startup Founders,</span>
					<span class="hero-word-group" data-animate>you already work</span>
					{#if slice.primary.pills?.[2]}
						{@const pill2 = slice.primary.pills[2]}
						{@const pill2HasVideo = isFilled.linkToMedia(pill2.pill_video)}
						{@const pill2HasImage = isFilled.image(pill2.pill_image)}
						{@const pill2VideoUrl = pill2HasVideo && 'url' in pill2.pill_video ? pill2.pill_video.url : null}
						<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(4rem,15vw+2rem,9.25rem)] rounded-full overflow-hidden shrink-0" data-animate>
							{#if pill2HasVideo && pill2VideoUrl}
								<video
									src={pill2VideoUrl}
									class="h-full w-full object-cover"
									autoplay
									loop
									muted
									playsinline
								></video>
							{:else if pill2HasImage}
								<PrismicImage
									field={pill2.pill_image}
									class="h-full w-full object-cover"
								/>
							{/if}
						</div>
					{/if}
					<span class="hero-word-group formal-heading-italic" data-animate>60+ hours</span>
				</span>
				<span class="inline-flex flex-wrap items-center justify-center formal-heading hero-text-line">
					{#if slice.primary.pills?.[3]}
						{@const pill3 = slice.primary.pills[3]}
						{@const pill3HasVideo = isFilled.linkToMedia(pill3.pill_video)}
						{@const pill3HasImage = isFilled.image(pill3.pill_image)}
						{@const pill3VideoUrl = pill3HasVideo && 'url' in pill3.pill_video ? pill3.pill_video.url : null}
						<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(4rem,15vw+2rem,9.25rem)] rounded-full overflow-hidden shrink-0" data-animate>
							{#if pill3HasVideo && pill3VideoUrl}
								<video
									src={pill3VideoUrl}
									class="h-full w-full object-cover"
									autoplay
									loop
									muted
									playsinline
								></video>
							{:else if pill3HasImage}
								<PrismicImage
									field={pill3.pill_image}
									class="h-full w-full object-cover"
								/>
							{/if}
						</div>
					{/if}
					<span class="hero-word-group" data-animate>per week...</span>
				</span>
			</div>
		</div>
	</div>
	<div
		bind:this={videoWrapper}
		class="h-screen relative top-[70vh] pt-5 flex flex-col items-center justify-center gap-6 md:gap-10 w-full px-4"
	>
		<div bind:this={textContainer} class="flex flex-col items-center justify-center gap-2 w-full max-w-4xl">
			{#if slice.primary.lead_in_text}
				<h2 class="body-copy">{slice.primary.lead_in_text}</h2>
			{/if}
			{#if slice.primary.social_proof && slice.primary.social_proof.length > 0}
				<div class="flex flex-row flex-wrap items-center justify-center gap-3 md:gap-4 lg:gap-6 w-full">
					{#each slice.primary.social_proof as item}
						{#if item.social_proof}
							<p class="small-copy">{item.social_proof}</p>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
		<div class="h-full w-full relative -mx-10 md:-mx-16 lg:-mx-12 overflow-visible">
			<!-- Mask container - scales and reveals more of the video -->
			<div
				bind:this={roundedContainer}
				class="absolute inset-0 rounded-3xl overflow-hidden xl:max-h-[33vw] max-h-[90vh]"
				style="transform-origin: center;"
			>
				<!-- Fixed-size video container - counteracts parent scale to stay fixed size -->
				<div
					bind:this={videosContainer}
					class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full overflow-hidden rounded-3xl"
					style="transform-origin: center;"
				>
					{#if slice.primary.cloudflare_stream_id}
						{@const streamId = slice.primary.cloudflare_stream_id}
						{@const customerId = 'yy99jk2iutjm3e4s'}
						{@const videoUrl = `https://customer-${customerId}.cloudflarestream.com/${streamId}/iframe?muted=true&loop=true&autoplay=true&controls=false&poster=https%3A%2F%2Fcustomer-${customerId}.cloudflarestream.com%2F${streamId}%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600`}
						<div class="block md:hidden w-full h-full">
							<iframe
								src={videoUrl}
								loading="lazy"
								title="Hero video"
								style="border: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(2.5); width: 100%; height: 100%; min-width: 100%; min-height: 100%;"
								class="rounded-none"
								allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
								allowfullscreen
							></iframe>
						</div>
						<div class="hidden md:flex h-full w-full items-center justify-between gap-6">
							{#each Array(3) as _}
								<div class="relative h-full max-h-[85vh] w-full max-w-[22vw] flex-1 min-w-0 aspect-9/16 overflow-hidden rounded-2xl bg-black/10">
									<iframe
										src={videoUrl}
										loading="lazy"
										title="Hero video"
										style="border: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1.35); width: 100%; height: 100%; min-width: 100%; min-height: 100%;"
										class="rounded-none"
										allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
										allowfullscreen
									></iframe>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>
