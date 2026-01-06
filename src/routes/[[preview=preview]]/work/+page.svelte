<script lang="ts">
	import type { PageProps } from './$types';
	import { PrismicImage } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);

	const { data }: PageProps = $props();

	let galleryElement: HTMLElement | undefined = $state();

	onMount(() => {
		if (!galleryElement) return;

		// Animate gallery items on scroll
		const items = galleryElement.querySelectorAll('.work-card');
		
		items.forEach((item, index) => {
			gsap.fromTo(
				item,
				{
					opacity: 0,
					y: 30
				},
				{
					opacity: 1,
					y: 0,
					duration: 0.6,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: item,
						start: 'top 85%',
						toggleActions: 'play none none none'
					},
					delay: index * 0.1
				}
			);
		});

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => {
				const triggerElement = trigger.vars.trigger;
				if (
					galleryElement &&
					triggerElement &&
					typeof triggerElement !== 'string' &&
					'parentElement' in triggerElement &&
					triggerElement.parentElement === galleryElement
				) {
					trigger.kill();
				}
			});
		};
	});
</script>

<div class="container px-6 md:px-12 py-12 md:py-16">
	<h1 class="text-white text-4xl md:text-5xl lg:text-6xl font-normal mb-12">
		Work
	</h1>

	{#if data.works && data.works.length > 0}
		<div bind:this={galleryElement} class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
			{#each data.works as work, index}
				<a
					href="/work/{work.uid}"
					class="work-card group block bg-gray-300 rounded-lg relative overflow-hidden aspect-3/4 hover:scale-[1.02] transition-transform duration-300"
				>
					{#if work.data.featured_image}
						<PrismicImage
							field={work.data.featured_image}
							class="w-full h-full object-cover"
						/>
					{:else}
						<div class="w-full h-full flex items-center justify-center bg-gray-800">
							<span class="text-gray-500 text-sm">No image</span>
						</div>
					{/if}
					
					<!-- Overlay with title on hover -->
					<div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
						<div class="text-center px-4">
							{#if work.data.title}
								<h3 class="text-white text-xl md:text-2xl font-auge mb-2">
									{work.data.title}
								</h3>
							{/if}
							{#if work.data.client_name}
								<p class="text-gray-300 text-sm md:text-base font-manrope">
									{work.data.client_name}
								</p>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<p class="text-gray-400 text-center py-12">No work items found.</p>
	{/if}
</div>
