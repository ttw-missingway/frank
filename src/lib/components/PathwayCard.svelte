<script lang="ts">
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';

	interface Props {
		number: number;
		title: string;
		subtitle?: string;
		beforeText?: string;
		afterText?: string;
		hovered?: boolean;
		onHoverChange?: (hovered: boolean) => void;
	}

	const {
		number,
		title,
		subtitle,
		beforeText,
		afterText,
		hovered = false,
		onHoverChange
	}: Props = $props();

	let cardItem: HTMLElement | undefined = $state();
	let arrow: HTMLElement | undefined = $state();
	let numberElement: HTMLElement | undefined = $state();
	let titleElement: HTMLElement | undefined = $state();
	let subtitleElement: HTMLElement | undefined = $state();
	let descriptionElement: HTMLElement | undefined = $state();

	// GSAP animations for pathway hover states
	function handleHover() {
		if (!cardItem) return;

		// Kill any running animations
		gsap.killTweensOf([cardItem, arrow, numberElement, titleElement, subtitleElement, descriptionElement]);

		// Animate background color
		gsap.to(cardItem, {
			backgroundColor: '#8BD475',
			padding: '1.5rem',
			margin: '0 -1.5rem',
			duration: 0.3,
			ease: 'power2.out'
		});

		// Animate text colors to black
		if (numberElement) {
			gsap.to(numberElement, { color: '#000000', duration: 0.3, ease: 'power2.out' });
		}
		if (titleElement) {
			gsap.to(titleElement, { color: '#000000', duration: 0.3, ease: 'power2.out' });
		}
		if (subtitleElement) {
			gsap.to(subtitleElement, { color: '#000000', duration: 0.3, ease: 'power2.out' });
		}
		if (descriptionElement) {
			gsap.to(descriptionElement, { color: '#000000', duration: 0.3, ease: 'power2.out' });
		}

		// Animate arrow slide-in from left
		if (arrow) {
			gsap.to(arrow, {
				opacity: 1,
				x: 0,
				color: '#000000',
				duration: 0.4,
				ease: 'power2.out'
			});
		}
	}

	function handleLeave() {
		if (!cardItem) return;

		// Kill any running animations
		gsap.killTweensOf([cardItem, arrow, numberElement, titleElement, subtitleElement, descriptionElement]);

		// Animate background color back
		gsap.to(cardItem, {
			backgroundColor: 'transparent',
			padding: '1.5rem 0',
			margin: '0',
			duration: 1.5,
			ease: 'power3.out'
		});

		// Animate text colors back to grey
		if (numberElement) {
			gsap.to(numberElement, { color: '#858585', duration: 0.3, ease: 'power2.out' });
		}
		if (titleElement) {
			gsap.to(titleElement, { color: '#858585', duration: 0.3, ease: 'power2.out' });
		}
		if (subtitleElement) {
			gsap.to(subtitleElement, { color: '#858585', duration: 0.3, ease: 'power2.out' });
		}
		if (descriptionElement) {
			gsap.to(descriptionElement, { color: '#858585', duration: 0.3, ease: 'power2.out' });
		}

		// Animate arrow slide-out to left
		if (arrow) {
			gsap.to(arrow, {
				opacity: 0,
				x: -64,
				color: '#858585',
				duration: 0.4,
				ease: 'power2.out'
			});
		}
	}

	// Initialize arrow position
	function initializeArrow() {
		if (arrow) {
			gsap.set(arrow, {
				opacity: 0,
				x: -64,
				color: '#858585'
			});
		}
	}

	// Watch for hover state changes
	$effect(() => {
		if (hovered) {
			handleHover();
		} else {
			handleLeave();
		}
	});

	onMount(() => {
		setTimeout(() => {
			initializeArrow();
		}, 100);
	});

	function handleMouseEnter() {
		onHoverChange?.(true);
	}

	function handleMouseLeave() {
		onHoverChange?.(false);
	}
</script>

<div
	bind:this={cardItem}
	class="relative py-6 rounded-xl bg-transparent cursor-pointer"
	role="button"
	tabindex="0"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
>
	<div class="flex items-center gap-8 relative md:gap-12">
		<div class="flex items-start gap-3 shrink-0 md:gap-4 w-[280px] md:w-[320px]">
			<span
				bind:this={numberElement}
				class="text-[#858585] text-base leading-[1.2] md:text-xl"
				style="font-family: 'Venus+', sans-serif;"
			>
				{number}
			</span>
			<div class="flex flex-col gap-1">
				<h3
					bind:this={titleElement}
					class="text-[#858585] text-3xl font-normal leading-[1.2] m-0 md:text-[2.5rem]"
					style="font-family: 'Auge Trial', sans-serif;"
				>
					{title}
				</h3>
				{#if subtitle}
					<p
						bind:this={subtitleElement}
						class="text-[#858585] text-sm font-normal uppercase tracking-[0.05em] leading-[1.4] m-0 opacity-90"
						style="font-family: 'ClashDisplay Variable', sans-serif;"
					>
						{subtitle}
					</p>
				{/if}
			</div>
		</div>
		{#if beforeText}
			<p
				bind:this={descriptionElement}
				class="text-[#858585] text-base font-normal leading-normal m-0"
				style="font-family: 'Manrope', sans-serif;"
			>
				{beforeText}
			</p>
		{/if}
		<div bind:this={arrow} class="shrink-0 ml-auto">
			<svg
				width="48"
				height="48"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M5 12H19M19 12L12 5M19 12L12 19"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
	</div>
</div>

