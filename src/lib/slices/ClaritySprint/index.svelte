<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';

	gsap.registerPlugin(ScrollTrigger);

	type Props = SliceComponentProps<Content.ClaritySprintSlice>;

	const { slice }: Props = $props();

	let email = $state('');

	function handleSubmit() {
		// Handle form submission
		console.log('Email submitted:', email);
	}

	// Split bullet points into two columns
	function splitBulletPoints(bulletPoints: any[]) {
		if (!bulletPoints || bulletPoints.length === 0) return [[], []];
		const midpoint = Math.ceil(bulletPoints.length / 2);
		return [bulletPoints.slice(0, midpoint), bulletPoints.slice(midpoint)];
	}

	const bulletColumns = $derived(splitBulletPoints(slice.primary.bullet_points || []));

	// Element refs for animation
	let leadInText: HTMLElement | undefined = $state();
	let guaranteesContainer: HTMLElement | undefined = $state();
	let guarantee1: HTMLElement | undefined = $state();
	let guarantee2: HTMLElement | undefined = $state();
	let guarantee3: HTMLElement | undefined = $state();
	let heading: HTMLElement | undefined = $state();
	let copy: HTMLElement | undefined = $state();
	let bulletPointsContainer: HTMLElement | undefined = $state();
	let emailInput: HTMLElement | undefined = $state();
	let submitButton: HTMLElement | undefined = $state();
	let disclaimer: HTMLElement | undefined = $state();

	onMount(() => {
		// Animate lead-in text
		if (leadInText) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: leadInText,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (leadInText) {
							gsap.set(leadInText, { opacity: 0, y: -20 });
						}
					}
				}
			});
			tl.fromTo(
				leadInText,
				{ opacity: 0, y: -20 },
				{ opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
			);
		}

		// Animate guarantees with stagger
		if (guarantee1 && guarantee2 && guarantee3) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: guaranteesContainer,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (guarantee1 && guarantee2 && guarantee3) {
							gsap.set([guarantee1, guarantee2, guarantee3], { opacity: 0, x: -20 });
						}
					}
				}
			});
			tl.fromTo(
				[guarantee1, guarantee2, guarantee3],
				{ opacity: 0, x: -20 },
				{ opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', stagger: 0.15 }
			);
		}

		// Animate heading
		if (heading) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: heading,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (heading) {
							gsap.set(heading, { opacity: 0, y: 20 });
						}
					}
				}
			});
			tl.fromTo(
				heading,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
			);
		}

		// Animate copy
		if (copy) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: copy,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (copy) {
							gsap.set(copy, { opacity: 0, y: 20 });
						}
					}
				}
			});
			tl.fromTo(
				copy,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
			);
		}

		// Animate bullet points with stagger
		if (bulletPointsContainer) {
			const bulletItemsElements = bulletPointsContainer.querySelectorAll('.bullet-item') as NodeListOf<HTMLElement>;
			if (bulletItemsElements.length > 0) {
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: bulletPointsContainer,
						start: 'top 80%',
						toggleActions: 'play reverse play reverse',
						onLeave: () => {
							gsap.set(Array.from(bulletItemsElements), { opacity: 0, x: -30 });
						}
					}
				});
				tl.fromTo(
					Array.from(bulletItemsElements),
					{ opacity: 0, x: -30 },
					{ opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 }
				);
			}
		}

		// Animate email input
		if (emailInput) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: emailInput,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (emailInput) {
							gsap.set(emailInput, { opacity: 0, x: -20 });
						}
					}
				}
			});
			tl.fromTo(
				emailInput,
				{ opacity: 0, x: -20 },
				{ opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
			);
		}

		// Animate submit button
		if (submitButton) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: submitButton,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (submitButton) {
							gsap.set(submitButton, { opacity: 0, scale: 0.9 });
						}
					}
				}
			});
			tl.fromTo(
				submitButton,
				{ opacity: 0, scale: 0.9 },
				{ opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
			);
		}

		// Animate disclaimer
		if (disclaimer) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: disclaimer,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (disclaimer) {
							gsap.set(disclaimer, { opacity: 0, y: 10 });
						}
					}
				}
			});
			tl.fromTo(
				disclaimer,
				{ opacity: 0, y: 10 },
				{ opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
			);
		}
	});
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-[#FFFFE6] min-h-screen flex flex-col justify-center items-center px-6 md:px-8 py-20 md:py-32"
>
	<div class="w-full max-w-4xl flex flex-col items-center gap-8 md:gap-12">
		<!-- Lead-in Text (Philosophical Statement) -->
		{#if slice.primary.lead_in_text}
			<p
				bind:this={leadInText}
				class="text-[#CFF602] text-base font-normal font-clash-variable underline uppercase leading-8 tracking-wider"
			>
				{slice.primary.lead_in_text}
			</p>
		{/if}

		<!-- Three Guarantees -->
		<div bind:this={guaranteesContainer} class="flex flex-wrap justify-start md:justify-center items-center gap-6 md:gap-10 w-full">
			<div bind:this={guarantee1} class="flex items-center gap-2">
				<img src="/icons/CheckIcon.svg" alt="Checkmark" class="w-5 h-5" />
				<span class="text-sm md:text-base font-manrope text-[#D1C9C1]"
					>We will respond within 12 business hours</span
				>
			</div>
			<div bind:this={guarantee2} class="flex items-center gap-2">
				<img src="/icons/CheckIcon.svg" alt="Checkmark" class="w-5 h-5" />
				<span class="text-sm md:text-base font-manrope text-[#D1C9C1]"
					>We will sign an NDA if requested</span
				>
			</div>
			<div bind:this={guarantee3} class="flex items-center gap-2">
				<img src="/icons/CheckIcon.svg" alt="Checkmark" class="w-5 h-5" />
				<span class="text-sm md:text-base font-manrope text-[#D1C9C1]">Value in 2 weeks</span>
			</div>
		</div>

		<!-- Heading (Main Title) -->
		{#if slice.primary.heading}
			<h1
				bind:this={heading}
				class="text-5xl md:text-6xl lg:text-7xl font-normal text-center leading-tight text-[#FFFFE6]"
				style="font-family: 'Auge Trial', sans-serif;"
			>
				{slice.primary.heading}
			</h1>
		{/if}

		<!-- Copy (Value Proposition) -->
		{#if slice.primary.copy}
			<p
				bind:this={copy}
				class="text-[#D1C9C1] text-base font-normal font-['Manrope'] underline leading-7 tracking-tight text-center max-w-3xl"
			>
				{slice.primary.copy}
			</p>
		{/if}

		<!-- Bullet Points - Two Columns -->
		{#if slice.primary.bullet_points && slice.primary.bullet_points.length > 0}
			<div bind:this={bulletPointsContainer} class="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-4 justify-items-start">
				<div class="flex flex-col gap-3">
					{#each bulletColumns[0] as item}
						{#if item.bullet_point}
							<div class="bullet-item flex items-start gap-3 pb-3 border-b border-[#FFFFE6]/20 last:border-b-0 last:pb-0">
								<img src="/icons/Check.svg" alt="Checkmark" class="w-5 h-5" />
								<span class="text-[#FFFFE6] text-2xl font-light font-auge leading-8 tracking-wide">{item.bullet_point}</span>
							</div>
						{/if}
					{/each}
				</div>
				<div class="flex flex-col gap-3">
					{#each bulletColumns[1] as item}
						{#if item.bullet_point}
							<div class="bullet-item flex items-start gap-3 pb-3 border-b border-[#FFFFE6]/20 last:border-b-0 last:pb-0">
								<img src="/icons/Check.svg" alt="Checkmark" class="w-5 h-5" />
								<span class="text-[#FFFFE6] text-2xl font-light font-auge leading-8 tracking-wide">{item.bullet_point}</span>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

		<!-- Email Input and Button -->
		{#if slice.variation === 'paymentPage'}
			<div class="w-full flex justify-center px-8">
				<Button
					bind:element={submitButton}
					href="/checkout"
					class="flex flex-row items-center justify-center px-8 py-3 border border-[#CFF602] rounded-[40px] bg-transparent gap-2 whitespace-nowrap"
				>
					<div
						class="justify-start text-[#CFF602] text-2xl font-normal font-clash-variable uppercase leading-8 tracking-wider"
					>
						{slice.primary.button_text || 'book a call'}
					</div>
					<img src="/icons/Arrow-Green.svg" alt="Arrow" class="w-4 h-4" />
				</Button>
			</div>
		{:else}
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="w-full flex flex-col md:flex-row items-stretch md:items-center gap-6 px-8"
			>
				<input
					bind:this={emailInput}
					type="email"
					bind:value={email}
					placeholder={slice.primary.email_placeholder_text || 'Email'}
					class="flex-1 text-zinc-500 text-3xl font-light font-venus leading-[64px] tracking-wider text-center md:text-center border-b-2 border-zinc-500 focus:outline-none placeholder:text-zinc-500 placeholder:text-center min-w-0 w-full"
					style="background: none;"
					required
					name="email"
					autocomplete="email"
				/>
				<Button
					bind:element={submitButton}
					type="submit"
					class="flex-1 w-full md:min-w-0 flex flex-row items-center justify-center px-6 py-3 border border-[#CFF602] rounded-[40px] bg-transparent gap-2 whitespace-nowrap"
				>
					<div
						class="justify-start text-[#CFF602] text-2xl font-normal font-clash-variable uppercase leading-8 tracking-wider"
					>
						{slice.primary.button_text || 'book a call'}
					</div>
					<img src="/icons/Arrow-Green.svg" alt="Arrow" class="w-4 h-4" />
				</Button>
			</form>
		{/if}

		<!-- Disclaimer -->
		{#if slice.primary.disclaimer_text}
			<p bind:this={disclaimer} class="text-xs md:text-sm text-center text-[#FFFFE6]/70 mt-4 font-manrope">
				{slice.primary.disclaimer_text}
			</p>
		{/if}
	</div>
</section>
