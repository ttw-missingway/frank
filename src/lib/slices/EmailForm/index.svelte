<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	gsap.registerPlugin(ScrollTrigger);

	type Props = SliceComponentProps<Content.EmailFormSlice>;

	const { slice }: Props = $props();

	let email = $state('');
	let selectedPathways = $state<string[]>([]);

	const pathways = ['SCALE', 'DIFFERENTIATE', 'REPOSITION', 'ATTRACT'];

	// Element refs for animation
	let topButton: HTMLElement | undefined = $state();
	let checkmarkContainer: HTMLElement | undefined = $state();
	let checkmarkItem1: HTMLElement | undefined = $state();
	let checkmarkItem2: HTMLElement | undefined = $state();
	let heading: HTMLElement | undefined = $state();
	let pathwayButtons: HTMLElement[] = $state([]);
	let emailInput: HTMLElement | undefined = $state();
	let submitButton: HTMLElement | undefined = $state();

	function togglePathway(pathway: string) {
		if (selectedPathways.includes(pathway)) {
			selectedPathways = selectedPathways.filter((p) => p !== pathway);
		} else {
			selectedPathways = [...selectedPathways, pathway];
		}
	}

	function handleSubmit() {
		// Handle form submission
		console.log('Email submitted:', email);
		console.log('Selected pathways:', selectedPathways);
	}

	onMount(() => {
		// Animate top button
		if (topButton) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: topButton,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (topButton) {
							gsap.set(topButton, { opacity: 0, y: -20 });
						}
					}
				}
			});
			tl.fromTo(
				topButton,
				{ opacity: 0, y: -20 },
				{ opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
			);
		}

		// Animate checkmark items with stagger
		if (checkmarkItem1 && checkmarkItem2) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: checkmarkContainer,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (checkmarkItem1 && checkmarkItem2) {
							gsap.set([checkmarkItem1, checkmarkItem2], { opacity: 0, x: -20 });
						}
					}
				}
			});
			tl.fromTo(
				[checkmarkItem1, checkmarkItem2],
				{ opacity: 0, x: -20 },
				{ opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', stagger: 0.2 }
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

		// Animate pathway buttons with stagger
		if (pathwayButtons.length > 0 && pathwayButtons.every(btn => btn)) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: heading,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						const validButtons = pathwayButtons.filter(btn => btn) as HTMLElement[];
						if (validButtons.length > 0) {
							gsap.set(validButtons, { opacity: 0, scale: 0.8 });
						}
					}
				}
			});
			tl.fromTo(
				pathwayButtons.filter(btn => btn) as HTMLElement[],
				{ opacity: 0, scale: 0.8 },
				{ opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.1 }
			);
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
							gsap.set(emailInput, { opacity: 0, y: 20 });
						}
					}
				}
			});
			tl.fromTo(
				emailInput,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
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
	});
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black min-h-screen flex flex-col justify-center items-center px-6 md:px-8 py-20 md:py-32"
	style="color: #FFFFE6;"
>
	<div class="w-full max-w-4xl bg-zinc-900 rounded-3xl p-8 md:p-12 flex flex-col items-center gap-8" style="box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.12);">
		<!-- Top Input/Button -->
		<div bind:this={topButton} class="px-6 py-3 bg-yellow-50 rounded-3xl inline-flex justify-center items-center gap-4">
			<div
				class="text-center justify-start text-zinc-800 text-sm font-semibold font-['Manrope'] leading-7 tracking-tight"
			>
				Choose the path(s) & enter your email
			</div>
		</div>

		<!-- Checkmark Items -->
		<div bind:this={checkmarkContainer} class="inline-flex justify-center items-start gap-10">
			<div bind:this={checkmarkItem1} class="flex justify-center items-center gap-4">
				<img src="/icons/CheckIcon.svg" alt="Checkmark" class="w-6 h-6" />
				<div
					class="text-center justify-start text-sm font-semibold font-['Manrope'] leading-7 tracking-tight"
					style="color: #FFFFE6;"
				>
					We will respond within 12 hours
				</div>
			</div>
			<div bind:this={checkmarkItem2} class="flex justify-center items-center gap-4">
				<img src="/icons/CheckIcon.svg" alt="Checkmark" class="w-6 h-6" />
				<div
					class="text-center justify-start text-sm font-semibold font-['Manrope'] leading-7 tracking-tight"
					style="color: #FFFFE6;"
				>
					We will sign an NDA if requested
				</div>
			</div>
		</div>

		<!-- Heading with Inline Pathway Cards -->
		<h2
			bind:this={heading}
			class="text-3xl md:text-4xl lg:text-5xl font-normal text-center leading-tight flex flex-wrap items-center justify-center gap-2 md:gap-3"
			style="font-family: 'Auge Trial', sans-serif;"
		>
			<span>Ready to</span>
			<div
				class="self-stretch inline-flex justify-center items-center gap-4 flex-wrap content-center"
			>
				{#each pathways as pathway, index}
					<button
						bind:this={pathwayButtons[index]}
						type="button"
						onclick={() => togglePathway(pathway)}
						class=" text-base md:text-lg font-normal eyebrow-text
							{selectedPathways.includes(pathway) ? 'bg-[#8BD475] text-black' : 'bg-transparent'}"
						style="border-width: 1px;"
					>
						{pathway}
					</button>
				{/each}
			</div>
			<span>with your business?</span>
		</h2>

		<!-- Email Input -->
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="w-full flex flex-col items-center gap-6 px-8"
		>
			<input
				bind:this={emailInput}
				id="email"
				type="email"
				class="w-full text-zinc-500 text-3xl font-light font-['Venus+'] leading-[64px] tracking-wider text-center border-b-2 border-zinc-500 focus:outline-none placeholder:text-zinc-500 placeholder:text-center"
				placeholder="Email"
				required
				bind:value={email}
				name="email"
				autocomplete="email"
				style="background: none;"
			/>

			<!-- Submit Button -->
			<button
				bind:this={submitButton}
				type="submit"
				class="self-stretch px-6 py-3 bg-[#8BD475] rounded-[40px] outline outline-1 outline-offset-[-1px] outline-[#8BD475] inline-flex justify-center items-center gap-8"
			>
				<div
					class="justify-start text-neutral-950 text-3xl font-medium font-clash uppercase leading-8 tracking-widest"
				>
					book a call
				</div>
				<img src="/icons/Arrow.svg" alt="Arrow" class="w-4 h-4" />
			</button>
		</form>
	</div>
</section>
