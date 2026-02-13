<script lang="ts">
	import { PrismicImage } from '@prismicio/svelte';
	import { PrismicLink } from '@prismicio/svelte';
	import type { ImageFieldImage, LinkField, EmbedField, LinkToMediaField } from '@prismicio/client';
	import { isFilled } from '@prismicio/client';
	import { gsap } from 'gsap';

	interface Props {
		image?: ImageFieldImage | null;
		video?: EmbedField | LinkToMediaField | null;
		link?: LinkField | string | null;
		class?: string;
		aspectRatio?: string;
		width?: string;
		maxWidth?: string;
		minHeight?: string;
		onHoverChange?: (isHovering: boolean) => void;
	}

	const {
		image,
		video,
		link,
		class: className = '',
		aspectRatio = '3 / 4',
		width = '60vw',
		maxWidth = '280px',
		minHeight = '370px',
		onHoverChange
	}: Props = $props();

	// Compute video and image states
	const hasVideo = $derived(video && (isFilled.linkToMedia(video) || isFilled.embed(video)));
	const hasImage = $derived(isFilled.image(image));
	const videoUrl = $derived(hasVideo && isFilled.linkToMedia(video) && 'url' in video ? video.url : null);
	const embedVideo = $derived(hasVideo && isFilled.embed(video) ? video : null);
	const linkHref = $derived(typeof link === 'string' ? link : null);
	const linkField = $derived(typeof link !== 'string' ? link : null);

	let cardElement: HTMLElement | undefined = $state();

	function handleMouseEnter() {
		if (!cardElement) return;

		gsap.killTweensOf(cardElement);

		// Lift card up slightly
		gsap.to(cardElement, {
			y: -12,
			duration: 0.6,
			ease: 'power2.out'
		});

		onHoverChange?.(true);
	}

	function handleMouseLeave() {
		if (!cardElement) return;
		gsap.killTweensOf(cardElement);

		// Reset card rotation and position
		gsap.to(cardElement, {
			rotationX: 0,
			rotationY: 0,
			scale: 1,
			z: 0,
			y: 0,
			duration: 0.6,
			ease: 'power2.out'
		});

		onHoverChange?.(false);
	}

	function handleMouseMove(event: MouseEvent) {
		if (!cardElement) return;

		const rect = cardElement.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		
		// Calculate center of card
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		
		// Calculate rotation based on mouse position (max 8 degrees)
		const rotateY = ((x - centerX) / centerX) * 8;
		const rotateX = ((centerY - y) / centerY) * 8;
		
		// Animate the 3D transform for the card
		gsap.to(cardElement, {
			rotationX: rotateX,
			rotationY: rotateY,
			scale: 1.02,
			z: 20, // Push card forward in 3D space
			y: -12, // Lift card up vertically
			duration: 0.3,
			ease: 'power1.out',
			transformPerspective: 1000
		});
	}
</script>

<div
	class="tilt-card"
	class:list={[className]}
	bind:this={cardElement}
	role="presentation"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onmousemove={handleMouseMove}
	style="--aspect-ratio: {aspectRatio}; --width: {width}; --max-width: {maxWidth}; --min-height: {minHeight};"
>
	{#if link}
		{#if linkHref}
			<a href={linkHref} class="block h-full relative z-10">
				{#if hasVideo && videoUrl}
					<video
						src={videoUrl}
						class="w-full h-full object-cover rounded-2xl"
						autoplay
						loop
						muted
						playsinline
					></video>
				{:else if hasVideo && embedVideo}
					<div class="w-full h-full bg-gray-300 rounded-2xl flex items-center justify-center">
						<!-- Embed video placeholder -->
					</div>
				{:else if hasImage}
					<PrismicImage
						field={image}
						class="w-full h-full object-cover rounded-2xl"
					/>
				{:else}
					<div class="w-full h-full bg-gray-300 rounded-2xl"></div>
				{/if}
			</a>
		{:else if linkField}
			<PrismicLink field={linkField} class="block h-full relative z-10">
				{#if hasVideo && videoUrl}
					<video
						src={videoUrl}
						class="w-full h-full object-cover rounded-2xl"
						autoplay
						loop
						muted
						playsinline
					></video>
				{:else if hasVideo && embedVideo}
					<div class="w-full h-full bg-gray-300 rounded-2xl flex items-center justify-center">
						<!-- Embed video placeholder -->
					</div>
				{:else if hasImage}
					<PrismicImage
						field={image}
						class="w-full h-full object-cover rounded-2xl"
					/>
				{:else}
					<div class="w-full h-full bg-gray-300 rounded-2xl"></div>
				{/if}
			</PrismicLink>
		{/if}
	{:else if hasVideo && videoUrl}
		<video
			src={videoUrl}
			class="w-full h-full object-cover rounded-2xl relative z-10"
			autoplay
			loop
			muted
			playsinline
		></video>
	{:else if hasVideo && embedVideo}
		<div class="w-full h-full bg-gray-300 rounded-2xl flex items-center justify-center relative z-10">
			<!-- Embed video placeholder -->
		</div>
	{:else if hasImage}
		<PrismicImage
			field={image}
			class="w-full h-full object-cover rounded-2xl relative z-10"
		/>
	{:else}
		<div class="w-full h-full bg-gray-300 rounded-2xl relative z-10"></div>
	{/if}
</div>

<style>
	.tilt-card {
		flex: 0 0 auto;
		width: var(--width, 60vw);
		max-width: var(--max-width, 280px);
		aspect-ratio: var(--aspect-ratio, 3 / 4);
		height: auto;
		min-height: var(--min-height, 370px);
		scroll-snap-align: start;
		scroll-snap-stop: always;
		position: relative;
		transform-style: preserve-3d;
		border-radius: 1rem;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.tilt-card {
			width: 35vw;
			max-width: 300px;
			min-height: 400px;
		}
	}

	@media (min-width: 1024px) {
		.tilt-card {
			width: 22vw;
			max-width: 320px;
			min-height: 425px;
		}
	}
</style>

