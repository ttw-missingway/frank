<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
	let animationFrameTextElement3: HTMLElement;
	let animationFrameTextElement4: HTMLElement;
	let secondSectionElement: HTMLElement;

	onMount(() => {
		if (!animationFrameContainer) return;

		// Initial states to preserve layout while enabling animation
		if (animationFrameElement1) {
			gsap.set(animationFrameElement1, {
				scale: 0.8,
				transformOrigin: 'center center',
				opacity: 1
			});
		}
		if (animationFrameElement2) {
			gsap.set(animationFrameElement2, { opacity: 0 });
		}
		if (animationFrameTextElement1) {
			gsap.set(animationFrameTextElement1, { y: 60, opacity: 0 });
		}
		if (animationFrameTextElement2) {
			gsap.set(animationFrameTextElement2, { y: 60, opacity: 0 });
		}
		if (animationFrameElement3) {
			gsap.set(animationFrameElement3, {
				scale: 1,
				opacity: 1,
				transformOrigin: 'center center'
			});
		}

		// Phase 1: Frame 1 grows while text scrolls off, then swap to frame 2 and reveal text
		const tlFrames12 = gsap.timeline({
			scrollTrigger: {
				trigger: animationFrameContainer,
				start: 'center center',
				end: '+=250%',
				scrub: true,
				pin: animationFrameContainer,
				pinSpacing: true
			}
		});

		tlFrames12
			.to(animationFrameElement1, { scale: 1, duration: 1 }, 0)
			.to([headingElement, descriptionElement], { y: -200, opacity: 0, duration: 1 }, 0)
			.to(animationFrameElement1, { opacity: 0, duration: 0.2 }, 1)
			.to(animationFrameElement2, { opacity: 1, duration: 0.2 }, 1)
			.to(animationFrameTextElement1, { y: -250, opacity: 1, duration: 0.6 }, 1.4)
			.to(animationFrameTextElement2, { y: -250, opacity: 1, duration: 0.6 }, 2.4)
			.to(animationFrameTextElement1, { y: -400, opacity: 1, duration: 0.6 }, 2.4);

		// Phase 2: Frame 3 pins on handoff and grows
		let tlFrame3: gsap.core.Timeline | null = null;
		if (animationFrameElement3 && secondSectionElement) {
			tlFrame3 = gsap.timeline({
				scrollTrigger: {
					trigger: secondSectionElement,
					start: 'center center',
					end: '+=250%',
					scrub: true,
					pin: animationFrameElement3,
					pinSpacing: true
				}
			});

			tlFrame3
				.to(animationFrameElement3, { scale: 1.2, duration: 1 }, 0)
				.to(animationFrameTextElement3, { y: -200, opacity: 1, duration: 0.6 }, 1.4)
				.to(animationFrameTextElement4, { y: 200, opacity: 1, duration: 0.6 }, 2.4);
		}

		return () => {
			tlFrames12.kill();
			if (tlFrame3) {
				tlFrame3.kill();
			}
		};
	});
</script>

<section
	bind:this={sectionElement}
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-[#FFFFE6] container py-12 md:py-16"
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
			<div
				class="w-full h-full relative flex items-start justify-center min-h-[50vh] overflow-visible"
			>
				<div
					bind:this={animationFrameContainer}
					class="w-full h-full flex items-start justify-center overflow-visible"
				>
					<div bind:this={animationFrameElement1} class="flex items-center justify-center z-30">
						<PrismicImage field={slice.primary.animation_frame_1} />
					</div>
					<div
						bind:this={animationFrameElement2}
						class="absolute inset-0 flex items-center justify-center z-20"
					>
						<PrismicImage field={slice.primary.animation_frame_2} class="block mx-auto" />
					</div>
					<div
						bind:this={animationFrameTextElement1}
						class="absolute inset-0 flex items-center justify-center gap-2 z-10"
					>
						<span
							class="text-[#FFFFE6] font-auge font-semibold"
							style="font-size: clamp(4rem, 12vw + 2rem, 8.75rem);">22M</span
						>
						<span
							class="text-[#FFFFE6] font-manrope font-medium not-italic text-wrap whitespace-pre-line max-w-[80px]"
							style="font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem); line-height: clamp(1rem, 1.5vw + 0.5rem, 1.25rem);"
						>
							YouTube uploads daily
						</span>
					</div>
					<div
						bind:this={animationFrameTextElement2}
						class="absolute inset-0 flex items-center justify-center gap-2 z-10"
					>
						<span
							class="text-[#FFFFE6] font-auge font-semibold"
							style="font-size: clamp(4rem, 12vw + 2rem, 8.75rem);">34M</span
						>
						<span
							class="text-[#FFFFE6] font-manrope font-medium not-italic text-wrap whitespace-pre-line max-w-[80px]"
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
<section bind:this={secondSectionElement} class=" text-[#FFFFE6] container relative mb-[20vh]">
	<div class="w-full flex flex-col justify-center items-center gap-4">
		<!-- Add your second section content here -->
		<div bind:this={animationFrameElement3} class="flex items-start justify-center z-30">
			<PrismicImage class="z-30" field={slice.primary.animation_frame_3} />
			<div
				bind:this={animationFrameTextElement3}
				class="absolute inset-0 flex flex-col items-start justify-center z-10 pl-[var(--stat-block-padding,1.5rem)]"
			>
				<span
					class="text-[#FFFFE6] font-manrope font-medium not-italic leading-tight"
					style="font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem);"
				>
					Domains registered daily
				</span>
				<span
					class="text-[#FFFFE6] font-auge font-semibold leading-none"
					style="font-size: clamp(4rem, 12vw + 2rem, 8.75rem);">200K+</span
				>
			</div>
			<div
				bind:this={animationFrameTextElement4}
				class="absolute inset-0 flex items-center justify-center gap-2 z-10"
			>
				<span
					class="text-[#FFFFE6] font-auge font-semibold"
					style="font-size: clamp(4rem, 12vw + 2rem, 8.75rem);">2400</span
				>
				<span
					class="text-[#FFFFE6] font-manrope font-medium not-italic text-wrap whitespace-pre-line max-w-[80px]"
					style="font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem); line-height: clamp(1rem, 1.5vw + 0.5rem, 1.25rem);"
				>
					Apps launched daily</span
				>
			</div>
		</div>
	</div>
</section>
