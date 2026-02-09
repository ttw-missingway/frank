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
	let cursorX = $state(0);
	let cursorY = $state(0);
	let isCursorVisible = $state(false);
	let activeClient: string | null = $state(null);

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
		onmouseenter={() => {
			isCursorVisible = true;
		}}
		onmouseleave={() => {
			isCursorVisible = false;
			activeClient = null;
			hoveredIndex = null;
		}}
		onmousemove={(event) => {
			const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
			cursorX = event.clientX - rect.left;
			cursorY = event.clientY - rect.top;
		}}
	>
		<div
			class="gallery-cursor"
			class:visible={isCursorVisible}
			class:expanded={!!activeClient}
			style={`left: ${cursorX}px; top: ${cursorY}px;`}
			aria-hidden="true"
		>
			{#if activeClient}
				<span class="cursor-label">{activeClient}</span>
			{/if}
		</div>
		{#each works as work, index}
			{@const featuredVideo = work.data.featured_video}
			{@const featuredImage = work.data.featured_image}
			{@const hasVideo = featuredVideo && isFilled.linkToMedia(featuredVideo)}
			{@const hasImage = featuredImage && isFilled.image(featuredImage)}
			{@const videoUrl = hasVideo && 'url' in featuredVideo ? featuredVideo.url : null}
			<a
				href={`/work/${work.uid}`}
				class="work-card mosaic-card group block bg-gray-300 rounded-md relative overflow-hidden hover:scale-[1.02] transition-transform duration-300"
				class:dimmed={hoveredIndex !== null && hoveredIndex !== index}
				onmouseover={() => {
					hoveredIndex = index;
					activeClient = work.data.client_name || null;
				}}
				onmouseout={() => {
					hoveredIndex = null;
					activeClient = null;
				}}
				onfocus={() => {
					hoveredIndex = index;
					activeClient = work.data.client_name || null;
				}}
				onblur={() => {
					hoveredIndex = null;
					activeClient = null;
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
		cursor: none;
	}

	.mosaic-grid *,
	.mosaic-card {
		cursor: none;
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

	.gallery-cursor {
		position: absolute;
		left: 0;
		top: 0;
		width: 16px;
		height: 16px;
		border-radius: 999px;
		background: #ffffff;
		transform: translate(-50%, -50%);
		opacity: 0;
		pointer-events: none;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		transition:
			height 200ms ease,
			opacity 150ms ease;
	}

	.gallery-cursor.visible {
		opacity: 1;
	}

	.gallery-cursor.expanded {
		height: 44px;
		border-radius: 999px;
		background: white;
		padding: 0 16px;
		width: max-content;
		animation: cursor-pop 260ms cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	@keyframes cursor-pop {
		0% {
			transform: translate(-50%, -50%) scaleX(0.85);
		}
		60% {
			transform: translate(-50%, -50%) scaleX(1.08);
		}
		100% {
			transform: translate(-50%, -50%) scaleX(1);
		}
	}

	.cursor-label {
		color: #0a0a0a;
		font-size: 0.8rem;
		font-family: var(--font-manrope, sans-serif);
		letter-spacing: 0.02em;
		white-space: nowrap;
		padding: 0 12px;
	}
</style>
