<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { createBackgroundChanger } from '$lib/backgroundChanger';
	import { PrismicImage } from '@prismicio/svelte';

	gsap.registerPlugin(ScrollTrigger);

	type Props = SliceComponentProps<Content.OurStorySlice>;

	const { slice }: Props = $props();

	let sectionElement: HTMLElement;
	let headingElement: HTMLElement;
	let descriptionElement: HTMLElement;
	let bodyCopyElement: HTMLElement;
	let animationFrameElement1: HTMLElement;
	let animationFrameElement2: HTMLElement;
	let animationFrameElement3: HTMLElement;
	let animationFrameContainer: HTMLElement;
	let animationFrameTextElement1: HTMLElement;
	let animationFrameTextElement2: HTMLElement;
	let secondSectionElement: HTMLElement;

	onMount(() => {
		if (!sectionElement) return;

		// Initialize background changer but don't use its auto ScrollTrigger
		// We'll control it manually based on pin state
		const backgroundChanger = createBackgroundChanger(sectionElement);
		// Destroy the auto ScrollTrigger from background changer
		backgroundChanger?.destroy();

		// Set initial states immediately (before timeline starts)
		// These ensure elements start with the correct values before any scroll animation
		if (animationFrameContainer) {
			gsap.set(animationFrameContainer, { scale: 0.25, opacity: 0 });
		}
		if (headingElement) {
			gsap.set(headingElement, {
				/* Add initial properties here */
			});
		}
		if (descriptionElement) {
			gsap.set(descriptionElement, {
				/* Add initial properties here */
			});
		}
		if (bodyCopyElement) {
			gsap.set(bodyCopyElement, {
				/* Add initial properties here */
			});
		}
		if (animationFrameElement1) {
			gsap.set(animationFrameElement1, {
				/* Add initial properties here */
			});
		}

		// Set initial states for second section elements
		if (animationFrameElement3) {
			gsap.set(animationFrameElement3, {
				scale: 0.25
			});
		}

		// Create timeline for 9 keyframes
		// Each keyframe segment will be evenly distributed across the scroll
		const totalKeyframes = 9;
		const keyframeDuration = 1; // Duration for each keyframe segment

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionElement,
				start: 'top top',
				end: '+=200%', // Adjust this value to control scroll distance
				pin: true,
				pinSpacing: true,
				scrub: true, // Smoothly scrub through timeline on scroll
				onEnter: () => {
					// Turn white when pinning starts
					backgroundChanger?.toggleWhiteMode(true);
				},
				onLeave: () => {
					// Don't change background yet - wait for second section to complete
					// Background will change when second section leaves
				},
				onEnterBack: () => {
					// Turn white when scrolling back into pinned section
					backgroundChanger?.toggleWhiteMode(true);
				},
				onLeaveBack: () => {
					// Turn black when scrolling back before pinned section
					backgroundChanger?.toggleWhiteMode(false);
				}
			}
		});

		// Second section timeline that pins after the first animation completes
		let tl2: gsap.core.Timeline | null = null;
		if (secondSectionElement) {
			const secondTotalKeyframes = 9;
			const secondKeyframeDuration = 1; // Duration for each keyframe segment

			tl2 = gsap.timeline({
				scrollTrigger: {
					trigger: secondSectionElement,
					start: 'top top',
					end: '+=200%', // Adjust this value to control scroll distance for second section
					pin: true,
					pinSpacing: true,
					scrub: true, // Smoothly scrub through timeline on scroll
					onEnter: () => {
						// Keep white background (first section already set it)
						backgroundChanger?.toggleWhiteMode(true);
					},
					onLeave: () => {
						// Turn black when both sections are complete
						backgroundChanger?.toggleWhiteMode(false);
					},
					onEnterBack: () => {
						// Keep white when scrolling back into second section
						backgroundChanger?.toggleWhiteMode(true);
					},
					onLeaveBack: () => {
						// Keep white when leaving second section (first section is still active)
						backgroundChanger?.toggleWhiteMode(true);
					}
				}
			});

			// Add 9 keyframes to the second section timeline
			// Each keyframe is evenly spaced (0%, 12.5%, 25%, 37.5%, 50%, 62.5%, 75%, 87.5%, 100%)

			// Keyframe 1 (0%)
			tl2.addLabel('keyframe1', 0);
			// Add your animation logic here
			tl2.to(animationFrameElement3, {
				scale: 0.8,
				opacity: 1,
				duration: secondKeyframeDuration,
				ease: 'power2.out'
			});
			// Example: tl2.to(animationFrameElement3, { opacity: 0, duration: 0 });

			// Keyframe 2 (12.5%)
			tl2.addLabel('keyframe2', secondKeyframeDuration);
			// Add your animation logic here

			// Example: tl2.to(animationFrameElement3, { opacity: 0.5, duration: secondKeyframeDuration }, 'keyframe2');

			// Keyframe 3 (25%)
			tl2.addLabel('keyframe3', secondKeyframeDuration * 2);
			// Add your animation logic here

			// Keyframe 4 (37.5%)
			tl2.addLabel('keyframe4', secondKeyframeDuration * 3);
			// Add your animation logic here

			// Keyframe 5 (50%)
			tl2.addLabel('keyframe5', secondKeyframeDuration * 4);
			// Add your animation logic here

			// Keyframe 6 (62.5%)
			tl2.addLabel('keyframe6', secondKeyframeDuration * 5);
			// Add your animation logic here

			// Keyframe 7 (75%)
			tl2.addLabel('keyframe7', secondKeyframeDuration * 6);
			// Add your animation logic here

			// Keyframe 8 (87.5%)
			tl2.addLabel('keyframe8', secondKeyframeDuration * 7);
			// Add your animation logic here

			// Keyframe 9 (100%)
			tl2.addLabel('keyframe9', secondKeyframeDuration * 8);
			// Add your animation logic here
		}

		// Add 9 keyframes to the timeline
		// Each keyframe is evenly spaced (0%, 12.5%, 25%, 37.5%, 50%, 62.5%, 75%, 87.5%, 100%)

		// Keyframe 1 (0%)
		tl.addLabel('keyframe1', 0);
		// Add your animation logic here
		tl.to(animationFrameContainer, { scale: 0.8, opacity: 1 });
		// Example: tl.to(headingElement, { opacity: 0, duration: 0 });

		// Keyframe 2 (12.5%)
		tl.addLabel('keyframe2', keyframeDuration);
		// Add your animation logic here
		tl.to(animationFrameElement1, {
			opacity: 0,
			duration: keyframeDuration,
			ease: 'bounce.out'
		});
		// Example: tl.to(headingElement, { opacity: 0.5, duration: keyframeDuration }, 'keyframe2');

		// Keyframe 3 (25%)
		tl.addLabel('keyframe3', keyframeDuration * 2);
		// Add your animation logic here
		tl.to(animationFrameElement2, {
			y: 250,
			duration: keyframeDuration,
			ease: 'power2.out'
		});
		tl.to(
			animationFrameTextElement2,
			{
				y: 150,
				duration: keyframeDuration,
				ease: 'power2.out'
			},
			'<'
		);

		// Keyframe 4 (37.5%)
		tl.addLabel('keyframe4', keyframeDuration * 3);
		// Add your animation logic here
		tl.to(animationFrameElement2, {
			y: 400,
			duration: keyframeDuration,
			ease: 'power2.out'
		});

		return () => {
			// Clean up - restore background before destroying
			backgroundChanger?.toggleWhiteMode(false);
			tl.kill();
			if (tl2) {
				tl2.kill();
			}
		};
	});
</script>

<section
	bind:this={sectionElement}
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-white container py-12 md:py-16"
>
	<div class="min-h-screen w-full flex flex-col justify-start items-center gap-4">
		{#if slice.primary.heading}
			<h2
				bind:this={headingElement}
				class="font-semibold font-auge text-center"
				style="font-size: clamp(1.75rem, 3vw + 1rem, 2.25rem); line-height: clamp(2.25rem, 4vw + 1.25rem, 3.25rem);"
			>
				{slice.primary.heading}
			</h2>
		{/if}
		{#if slice.primary.description}
			<p
				bind:this={descriptionElement}
				class="font-clash-variable font-medium uppercase underline decoration-solid decoration-[0.09em] underline-offset-[0.15em] leading-[32px] tracking-[0.08em] not-italic"
				style="
					leading-trim: both;
					text-edge: cap;
					text-decoration-skip-ink: auto;
					text-underline-position: from-font;
				"
			>
				{slice.primary.description}
			</p>
		{/if}
		{#if slice.primary.body_copy}
			<p
				bind:this={bodyCopyElement}
				class="text-center font-manrope font-medium text-[#666] max-w-[720px]"
				style="font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem); line-height: clamp(1.5rem, 2.5vw + 0.75rem, 1.75rem);"
			>
				{slice.primary.body_copy}
			</p>
		{/if}
		{#if slice.primary.animation_frame_1}
			<div class="w-full h-full relative flex items-start justify-center mt-[20vh] min-h-[50vh]">
				<div
					bind:this={animationFrameContainer}
					class="w-full h-full relative flex items-center justify-center"
				>
					<div
						bind:this={animationFrameElement1}
						class="absolute inset-0 flex items-center justify-center z-30"
					>
						<PrismicImage field={slice.primary.animation_frame_1} />
					</div>
					<div
						bind:this={animationFrameElement2}
						class="absolute inset-0 flex items-center justify-center z-20"
					>
						<PrismicImage field={slice.primary.animation_frame_2} />
					</div>
					<div
						bind:this={animationFrameTextElement1}
						class="absolute inset-0 flex items-center justify-center gap-2 z-10"
					>
						<span class="font-auge font-semibold" style="font-size: clamp(4rem, 12vw + 2rem, 8.75rem);">22M</span>
						<span
							class="text-[#333] font-manrope font-medium not-italic text-wrap whitespace-pre-line max-w-[80px]"
							style="font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem); line-height: clamp(1rem, 1.5vw + 0.5rem, 1.25rem);"
						>
							YouTube uploads daily
						</span>
					</div>
					<div
						bind:this={animationFrameTextElement2}
						class="absolute inset-0 flex items-center justify-center gap-2 z-10"
					>
						<span class="font-auge font-semibold" style="font-size: clamp(4rem, 12vw + 2rem, 8.75rem);">34M</span>
						<span
							class="text-[#333] font-manrope font-medium not-italic text-wrap whitespace-pre-line max-w-[80px]"
							style="font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem); line-height: clamp(1rem, 1.5vw + 0.5rem, 1.25rem);"
						>
							Tik Tok uploads daily</span
						>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- Second pinned section -->
<section
	bind:this={secondSectionElement}
	class="bg-black text-white container py-12 md:py-16 relative"
>
	<div class="min-h-screen w-full flex flex-col justify-start items-center gap-4">
		<!-- Add your second section content here -->
		<div
			bind:this={animationFrameElement3}
			class="absolute inset-0 flex items-start justify-center z-30"
		>
			<PrismicImage field={slice.primary.animation_frame_3} />
		</div>
	</div>
</section>
