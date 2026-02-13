<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);

	type Props = SliceComponentProps<Content.SeeMoreWorkSlice>;

	const { slice }: Props = $props();

	let linkSection: HTMLElement | undefined = $state();
	let linkElement: HTMLElement | undefined = $state();

	onMount(() => {
		if (!linkSection || !linkElement) return;

		// Set initial state
		gsap.set(linkElement, {
			opacity: 0,
			y: 20
		});

		// Create scroll-triggered animation
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: linkSection,
				start: 'top 80%',
				toggleActions: 'play reset play reset'
			}
		});

		// Animate link in
		tl.to(linkElement, {
			opacity: 1,
			y: 0,
			duration: 0.8,
			ease: 'power2.out'
		});

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => {
				if (trigger.vars.trigger === linkSection) {
					trigger.kill();
				}
			});
		};
	});
</script>

<section
	bind:this={linkSection}
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="w-full py-16 md:py-24 px-6 md:px-12"
>
	<div class="flex justify-center">
		<a
			bind:this={linkElement}
			href="/work"
			class="text-[#FFFFE6] font-manrope text-lg md:text-xl font-medium relative inline-block pb-2 transition-opacity duration-300 hover:opacity-80"
		>
			See more work
			<span
				class="absolute bottom-0 left-0 w-full h-px bg-[#FFFFE6]"
				style="background-color: #FFFFE6;"
			></span>
		</a>
	</div>
</section>
