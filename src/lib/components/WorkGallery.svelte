<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { isFilled } from '@prismicio/client';
	import { PrismicImage } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);

	interface Props {
		works?: Content.WorkDocument[];
	}

	const { works = [] }: Props = $props();

	let galleryElement: HTMLElement | undefined = $state();
	let hoveredIndex: number | null = $state(null);

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

{#if works && works.length > 0}
	<div
		bind:this={galleryElement}
		class="mosaic-grid"
		role="presentation"
		onmouseleave={() => {
			hoveredIndex = null;
		}}
	>
		{#each works as work, index}
			{@const featuredVideo = work.data.featured_video}
			{@const featuredImage = work.data.featured_image}
			{@const hasVideo = featuredVideo && isFilled.linkToMedia(featuredVideo)}
			{@const hasImage = featuredImage && isFilled.image(featuredImage)}
			{@const videoUrl = hasVideo && 'url' in featuredVideo ? featuredVideo.url : null}
			{@const marqueeText = (work.data.title || work.data.client_name || 'View project').toString()}
			<a
				href={`/work/${work.uid}`}
				class="work-card mosaic-card group block bg-gray-300 rounded-md relative overflow-hidden hover:scale-[1.02] transition-transform duration-300"
				class:dimmed={hoveredIndex !== null && hoveredIndex !== index}
				class:marquee-visible={hoveredIndex === index}
				onmouseover={() => {
					hoveredIndex = index;
				}}
				onmouseout={() => {
					hoveredIndex = null;
				}}
				onfocus={() => {
					hoveredIndex = index;
				}}
				onblur={() => {
					hoveredIndex = null;
				}}
			>
				{#if hasVideo && videoUrl}
					<video
						src={videoUrl}
						class="w-full h-full object-cover"
						autoplay
						loop
						muted
						playsinline
					></video>
				{:else if hasImage}
					<PrismicImage
						field={featuredImage}
						class="w-full h-full object-cover"
					/>
				{:else}
					<div class="w-full h-full flex items-center justify-center bg-gray-800">
						<span class="text-gray-500 text-sm">No media</span>
					</div>
				{/if}

				<div class="dim-overlay" aria-hidden="true"></div>

				<div class="marquee-overlay" aria-hidden="true">
					<div class="marquee-track">
						<span class="marquee-inner">
							{#each Array(12) as _}
								<span class="marquee-content">{marqueeText} — </span>
							{/each}
						</span>
						<span class="marquee-inner">
							{#each Array(12) as _}
								<span class="marquee-content">{marqueeText} — </span>
							{/each}
						</span>
					</div>
				</div>
			</a>
		{/each}
	</div>
{:else}
	<p class="text-gray-400 text-center py-12">No work items found.</p>
{/if}

<style>
	.mosaic-grid {
		column-count: 1;
		column-gap: 12px;
		width: 100%;
		position: relative;
	}

	@media (min-width: 640px) {
		.mosaic-grid {
			column-count: 2;
			column-gap: 14px;
		}
	}

	.mosaic-card {
		display: inline-block;
		width: 100%;
		margin: 0 0 12px;
		break-inside: avoid;
		transition: transform 300ms ease;
	}

	.mosaic-card:nth-child(6n + 1) {
		aspect-ratio: 4 / 3;
	}

	.mosaic-card:nth-child(6n + 2) {
		aspect-ratio: 2 / 3;
	}

	.mosaic-card:nth-child(6n + 3) {
		aspect-ratio: 1 / 1;
	}

	.mosaic-card:nth-child(6n + 4) {
		aspect-ratio: 3 / 4;
	}

	.mosaic-card:nth-child(6n + 5) {
		aspect-ratio: 16 / 9;
	}

	@media (min-width: 640px) {
		.mosaic-card {
			margin-bottom: 14px;
		}
	}

	@media (min-width: 1024px) {
		.mosaic-card {
			margin-bottom: 16px;
		}
	}

	.mosaic-card.dimmed {
		opacity: 1;
	}

	.dim-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.45);
		opacity: 0;
		transition: opacity 200ms ease;
		pointer-events: none;
	}

	.mosaic-card.dimmed .dim-overlay {
		opacity: 1;
	}

	.marquee-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		overflow: hidden;
		opacity: 0;
		transition: opacity 300ms ease;
		pointer-events: none;
		transform: rotate(-5deg);
		/* Fade edges so text doesn’t hard-cut at card boundary */
		mask-image: linear-gradient(
			to right,
			transparent 0%,
			black 10%,
			black 90%,
			transparent 100%
		);
		mask-size: 100% 100%;
		mask-repeat: no-repeat;
		-webkit-mask-image: linear-gradient(
			to right,
			transparent 0%,
			black 10%,
			black 90%,
			transparent 100%
		);
		-webkit-mask-size: 100% 100%;
		-webkit-mask-repeat: no-repeat;
	}

	.mosaic-card.marquee-visible .marquee-overlay {
		opacity: 1;
	}

	.marquee-track {
		display: flex;
		flex-wrap: nowrap;
		white-space: nowrap;
		width: max-content;
		animation: marquee-scroll 25s linear infinite;
		will-change: transform;
	}

	.mosaic-card.marquee-visible .marquee-track {
		animation-play-state: running;
	}

	.marquee-inner {
		display: flex;
		flex-wrap: nowrap;
		flex-shrink: 0;
	}

	.marquee-content {
		flex-shrink: 0;
		white-space: nowrap;
		padding-right: 0.5em;
		font-size: clamp(1.5rem, 2vw, 4rem);
		font-weight: 800;
		color: white;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	@keyframes marquee-scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}
</style>
