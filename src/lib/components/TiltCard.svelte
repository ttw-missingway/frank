<script lang="ts">
	import { PrismicImage } from '@prismicio/svelte';
	import { PrismicLink } from '@prismicio/svelte';
	import type { ImageFieldImage, LinkField, EmbedField } from '@prismicio/client';
	import { gsap } from 'gsap';

	interface Props {
		image?: ImageFieldImage | null;
		video?: EmbedField | null;
		link?: LinkField | null;
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

	let cardElement: HTMLElement | undefined = $state();
	let outlinePath: SVGPathElement | undefined = $state();
	let outlineSvg: SVGSVGElement | undefined = $state();

	// Create rounded rectangle path starting from bottom right corner
	function createRoundedRectPath(width: number, height: number, radius: number): string {
		const r = Math.min(radius, width / 2, height / 2);
		// Start from bottom right, trace clockwise: bottom right -> right -> top right -> top -> top left -> left -> bottom left -> bottom -> back to start
		return `M ${width - r},${height} A ${r},${r} 0 0 1 ${width},${height - r} L ${width},${r} A ${r},${r} 0 0 1 ${width - r},0 L ${r},0 A ${r},${r} 0 0 1 0,${r} L 0,${height - r} A ${r},${r} 0 0 1 ${r},${height} L ${width - r},${height} Z`;
	}

	// Update path when card dimensions change
	function updateOutlinePath() {
		if (!cardElement || !outlinePath || !outlineSvg) return;
		
		const rect = cardElement.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		// Border radius is 1rem (16px)
		const radius = 16;
		
		// Update viewBox to match actual dimensions
		outlineSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
		
		// Create path with proper rounded corners
		const pathData = createRoundedRectPath(width, height, radius);
		outlinePath.setAttribute('d', pathData);
	}

	// Initialize and update path when elements are ready
	$effect(() => {
		if (cardElement && outlinePath && outlineSvg) {
			updateOutlinePath();
			
			// Update on resize
			if (typeof window !== 'undefined') {
				const resizeObserver = new ResizeObserver(() => {
					updateOutlinePath();
				});
				resizeObserver.observe(cardElement);
				
				return () => {
					resizeObserver.disconnect();
				};
			}
		}
	});

	function handleMouseEnter() {
		if (!cardElement || !outlinePath) return;
		
		// Ensure path is updated before animating
		updateOutlinePath();
		
		gsap.killTweensOf(cardElement);
		gsap.killTweensOf(outlinePath);
		
		// Lift card up slightly
		gsap.to(cardElement, {
			y: -12,
			duration: 0.6,
			ease: 'power2.out'
		});
		
		// Animate the outline stroke
		const pathLength = outlinePath.getTotalLength();
		gsap.set(outlinePath, {
			strokeDasharray: pathLength,
			strokeDashoffset: pathLength,
			opacity: 0.5
		});
		
		gsap.to(outlinePath, {
			strokeDashoffset: 0,
			duration: 0.8,
			ease: 'power2.out'
		});
		
		onHoverChange?.(true);
	}

	function handleMouseLeave() {
		if (!cardElement || !outlinePath) return;
		gsap.killTweensOf(cardElement);
		gsap.killTweensOf(outlinePath);
		
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
		
		// Hide the outline
		const pathLength = outlinePath.getTotalLength();
		gsap.to(outlinePath, {
			strokeDashoffset: pathLength,
			opacity: 0,
			duration: 0.4,
			ease: 'power2.in'
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
		<PrismicLink field={link} class="block h-full relative z-10">
			{#if image}
				<PrismicImage
					field={image}
					class="w-full h-full object-cover rounded-2xl"
				/>
			{:else if video}
				<div class="w-full h-full bg-gray-300 rounded-2xl flex items-center justify-center">
					<!-- Video placeholder or embed could go here -->
				</div>
			{:else}
				<div class="w-full h-full bg-gray-300 rounded-2xl"></div>
			{/if}
		</PrismicLink>
	{:else if image}
		<PrismicImage
			field={image}
			class="w-full h-full object-cover rounded-2xl relative z-10"
		/>
	{:else if video}
		<div class="w-full h-full bg-gray-300 rounded-2xl flex items-center justify-center relative z-10">
			<!-- Video placeholder or embed could go here -->
		</div>
	{:else}
		<div class="w-full h-full bg-gray-300 rounded-2xl relative z-10"></div>
	{/if}
	
	<!-- SVG outline overlay -->
	<svg
		bind:this={outlineSvg}
		class="outline-overlay"
		width="100%"
		height="100%"
		preserveAspectRatio="none"
	>
		<path
			bind:this={outlinePath}
			class="outline-path"
			fill="none"
			stroke="green"
			stroke-width="2"
			vector-effect="non-scaling-stroke"
		/>
	</svg>
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

	.outline-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 20;
	}

	.outline-path {
		opacity: 0;
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

