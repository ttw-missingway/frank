<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { gsap } from 'gsap';

	type ButtonType = 'button' | 'submit' | 'reset';
	type ButtonElement = HTMLButtonElement | HTMLAnchorElement;

	type Props = Record<string, any> & {
		href?: string;
		type?: ButtonType;
		disabled?: boolean;
		hoverEffect?: boolean;
		class?: string;
	};

	const dispatch = createEventDispatcher<{ click: MouseEvent }>();

	let {
		href,
		type = 'button',
		disabled = false,
		hoverEffect = true,
		class: className = '',
		element = $bindable<ButtonElement | undefined>(),
		...rest
	}: Props = $props();

	let shine = $state<HTMLSpanElement | null>(null);

	onMount(() => {
		if (!hoverEffect || !element || !shine) return;

		const elementEl = element;
		const shineEl = shine;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		gsap.set(shineEl, { opacity: 0, scale: 0.9, xPercent: -50, yPercent: -50 });

		const moveX = gsap.quickTo(shineEl, 'x', { duration: 0.4, ease: 'power3.out' });
		const moveY = gsap.quickTo(shineEl, 'y', { duration: 0.4, ease: 'power3.out' });

		const onEnter = () => {
			if (prefersReducedMotion) return;
			gsap.to(shineEl, { opacity: 0.6, scale: 1, duration: 0.35, ease: 'power2.out' });
			gsap.to(elementEl, { scale: 1.03, y: -1, duration: 0.35, ease: 'power3.out' });
		};

		const onLeave = () => {
			if (prefersReducedMotion) return;
			gsap.to(shineEl, { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.out' });
			gsap.to(elementEl, { scale: 1, y: 0, duration: 0.3, ease: 'power3.out' });
		};

		const onMove = (event: PointerEvent) => {
			if (prefersReducedMotion) return;
			const bounds = elementEl.getBoundingClientRect();
			const x = event.clientX - bounds.left;
			const y = event.clientY - bounds.top;
			moveX(x);
			moveY(y);
		};

		elementEl.addEventListener('pointerenter', onEnter);
		elementEl.addEventListener('pointerleave', onLeave);
		elementEl.addEventListener('pointermove', onMove);

		onDestroy(() => {
			elementEl.removeEventListener('pointerenter', onEnter);
			elementEl.removeEventListener('pointerleave', onLeave);
			elementEl.removeEventListener('pointermove', onMove);
		});
	});
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	bind:this={element}
	class={`frank-button cursor-pointer ${className}`}
	href={href}
	type={href ? undefined : type}
	disabled={href ? undefined : disabled}
	aria-disabled={href && disabled ? 'true' : undefined}
	tabindex={href && disabled ? -1 : undefined}
	onclick={(event: MouseEvent) => dispatch('click', event)}
	{...rest}
>
	{#if hoverEffect}
		<span class="frank-button__shine" aria-hidden="true" bind:this={shine}></span>
	{/if}
	<span class="frank-button__content"><slot /></span>
</svelte:element>

<style>
	.frank-button {
		position: relative;
		overflow: hidden;
		isolation: isolate;
		transform: translateZ(0);
		will-change: transform;
		white-space: nowrap;
	}

	.frank-button__content {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		flex-wrap: nowrap;
		position: relative;
		z-index: 2;
		white-space: nowrap;
	}

	.frank-button__shine {
		position: absolute;
		top: 0;
		left: 0;
		width: 220px;
		height: 220px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0) 60%);
		filter: blur(12px);
		mix-blend-mode: screen;
		pointer-events: none;
		z-index: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.frank-button {
			transform: none;
		}
	}
</style>
