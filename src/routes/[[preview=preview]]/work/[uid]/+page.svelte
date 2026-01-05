<script lang="ts">
	import { SliceZone } from '@prismicio/svelte';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	import { components } from '$lib/slices';

	gsap.registerPlugin(ScrollTrigger);

	const { data }: PageProps = $props();

	let titleElement: HTMLElement;
	let titleText = $derived(data.work.data.title || '');

	// Split title into characters, preserving spaces
	const titleChars = $derived(
		titleText.split('').map((char, index) => ({
			char: char === ' ' ? '\u00A0' : char, // Non-breaking space for spaces
			id: index
		}))
	);

	onMount(() => {
		if (!titleElement) return;

		const charElements = titleElement.querySelectorAll('.char');
		if (charElements.length === 0) return;

		// Set initial state for all characters
		gsap.set(charElements, {
			opacity: 0,
			y: 20
		});

		// Create scroll-triggered animation
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: titleElement,
				start: 'top 80%',
				toggleActions: 'play reset play reset' // Reset when leaving viewport so it can replay
			}
		});

		// Animate each character with a stagger
		tl.to(charElements, {
			opacity: 1,
			y: 0,
			duration: 0.5,
			ease: 'power2.out',
			stagger: 0.08 // Longer delay between characters
		});

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => {
				if (trigger.vars.trigger === titleElement) {
					trigger.kill();
				}
			});
		};
	});
</script>

<div class="container px-6 md:px-12 flex flex-col items-center justify-center mt-[224px]">
	<h1
		bind:this={titleElement}
		class="text-[#FFFFE6] text-center font-auge text-[64px] font-semibold leading-[80px] tracking-[0.64px] not-italic"
	>
		{#each titleChars as { char, id } (id)}
			<span class="char inline-block">{char}</span>
		{/each}
	</h1>
	<p class="text-[#A2A2A2] text-center font-manrope text-[12px] font-normal not-italic leading-[32px] tracking-[0.72px] [leading-trim:both] [text-edge:cap]">
		{data.work.data.description}
	</p>
</div>
<SliceZone slices={data.work.data.slices} {components} />
