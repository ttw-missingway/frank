<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { PrismicImage } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);

	type Props = SliceComponentProps<Content.FounderLetterSlice>;

	const { slice }: Props = $props();

	let sectionEl: HTMLElement | undefined = $state();
	let leftCard: HTMLElement | undefined = $state();
	let rightCard: HTMLElement | undefined = $state();

	onMount(() => {
		if (!sectionEl || !leftCard || !rightCard) return;

		gsap.set(leftCard, { x: -80, opacity: 0 });
		gsap.set(rightCard, { x: 80, opacity: 0 });

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionEl,
				start: 'top 85%',
				end: 'bottom 15%',
				scrub: 1.2
			}
		});

		// 0–25% scroll: fly in; 25–50%: hold; 50–75%: fly out; 75–100%: hold
		tl.to([leftCard, rightCard], {
			x: 0,
			opacity: 1,
			duration: 0.5,
			ease: 'power2.out'
		}, 0)
			.to(leftCard, {
				x: -80,
				opacity: 0,
				duration: 0.5,
				ease: 'power2.in'
			}, 1)
			.to(rightCard, {
				x: 80,
				opacity: 0,
				duration: 0.5,
				ease: 'power2.in'
			}, 1);

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => {
				if (trigger.vars.trigger === sectionEl) trigger.kill();
			});
		};
	});
</script>

<section
	bind:this={sectionEl}
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-white container"
>
	<div class="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 w-full max-w-[1400px] mx-auto">
		<div
			bind:this={leftCard}
			class="flex flex-col justify-start items-start p-10 bg-[#2a2a2a] rounded-bl-2xl rounded-tr-2xl"
		>
			<div class="flex items-start gap-6 md:gap-8 lg:gap-10 w-full mb-6 md:mb-8 lg:mb-10">
				{#if slice.primary.avatar?.url}
					<div
						class="w-[100px] h-[100px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px] shrink-0 rounded-full overflow-hidden relative"
					>
						<PrismicImage field={slice.primary.avatar} class="w-full h-full object-cover" />
					</div>
				{/if}

				<div class="flex-1 flex flex-col gap-1">
					{#if slice.primary.heading}
						<h2 class="m-0 text-center font-auge font-semibold tracking-[0.72px] text-[#FFFFE6] whitespace-nowrap" style="font-size: clamp(1.75rem, 3vw + 1rem, 2.25rem); line-height: clamp(2rem, 3.5vw + 1rem, 3rem);">{slice.primary.heading}</h2>
					{/if}

					{#if slice.primary.description}
						<p
							class="text-sm md:text-[0.9375rem] lg:text-base text-[#e5e5e5] leading-6 font-normal m-0 font-manrope"
						>
							{slice.primary.description}
						</p>
					{/if}
				</div>
			</div>

			{#if (slice.primary as any).bio_text}
				<p
					class="text-[#D9D9D9] font-inter font-normal not-italic w-full m-0"
					style="font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem); line-height: clamp(1.5rem, 3vw + 0.75rem, 2.25rem);"
				>
					{(slice.primary as any).bio_text}
				</p>
			{/if}
		</div>

		<div
			bind:this={rightCard}
			class="flex items-center justify-start p-10 bg-[#9baa6f] rounded-bl-2xl rounded-tr-2xl"
		>
			{#if slice.primary.letter_text}
				<p
					class="founder-letter-text w-full text-[#1e1e1e] font-manrope m-0"
					style="font-size: clamp(1.5rem, 2.5vw + 0.75rem, 2rem); line-height: clamp(2rem, 3.5vw + 1.25rem, 3.25rem);"
				>
					{slice.primary.letter_text}
				</p>
			{/if}
		</div>
	</div>
</section>
