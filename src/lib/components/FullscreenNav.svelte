<script lang="ts">
	import { PrismicLink } from '@prismicio/svelte';
	import type { SettingsDocument } from '../../prismicio-types';
	import { onMount } from 'svelte';

	interface Props {
		isOpen: boolean;
		settings: SettingsDocument | null;
		onClose: () => void;
	}

	const { isOpen, settings, onClose }: Props = $props();

	let navElement: HTMLElement | undefined = $state();
	let emailInput: HTMLInputElement | undefined = $state();
	let emailValue = $state('');

	// Prevent body scroll when nav is open
	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	function handleEmailSubmit(e: SubmitEvent) {
		e.preventDefault();
		// Handle email submission here if needed
		console.log('Email submitted:', emailValue);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			onClose();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if isOpen}
	<div
		bind:this={navElement}
		class="fixed inset-0 bg-black z-[100] flex flex-col"
		role="dialog"
		aria-modal="true"
		aria-label="Navigation menu"
	>
		<!-- Top bar with logo and close button -->
		<div class="w-full flex justify-between items-center p-6 md:p-8 lg:p-10">
			<!-- Logo -->
			<div class="flex items-center">
				<img src="/icons/Frank.svg" alt="FRANK" class="w-full h-full object-cover" />
			</div>

			<!-- Close button -->
			<button
				onclick={onClose}
				class="text-white hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded p-2"
				aria-label="Close menu"
				type="button"
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="text-white"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</div>

		<!-- Main navigation links - positioned left and slightly above center -->
		<div class="flex-1 flex items-center px-6 md:px-8 lg:px-10 -mt-20">
			<nav class="flex flex-col gap-6 md:gap-8">
				{#if settings?.data.links && settings.data.links.length > 0}
					{#each settings.data.links as linkItem}
						{@const link = linkItem.link}
						{#if link}
							<PrismicLink
								field={link}
								onclick={onClose}
								class="text-[#FFFFE6] font-venus-carrare text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.1] hover:opacity-80 transition-opacity block"
							>
								{link.text || 'Link'}
							</PrismicLink>
						{/if}
					{/each}
				{:else}
					<!-- Debug: Show if no links -->
					<div class="text-white/50 text-sm">No navigation links found in settings</div>
				{/if}
			</nav>
		</div>

		<!-- Email input at the bottom -->
		<div class="w-full px-6 md:px-8 lg:p-10 pb-6 md:pb-8 lg:pb-10">
			<form onsubmit={handleEmailSubmit} class="flex items-center gap-4 max-w-2xl mx-auto">
				<div class="flex-1 relative">
					<input
						bind:this={emailInput}
						bind:value={emailValue}
						type="email"
						placeholder="Your email"
						class="w-full bg-transparent border-0 border-b border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 transition-colors pb-2 text-base md:text-lg font-manrope"
						required
					/>
				</div>
				<button
					type="submit"
					class="text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded p-2 flex-shrink-0"
					aria-label="Submit email"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="5" y1="12" x2="19" y2="12"></line>
						<polyline points="12 5 19 12 12 19"></polyline>
					</svg>
				</button>
			</form>
		</div>
	</div>
{/if}

