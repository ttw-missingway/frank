<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);

	let footerElement: HTMLElement;
	let brandName: HTMLElement;
	let navLinks: HTMLElement;
	let contactInfo: HTMLElement;
	let footerImage: HTMLElement;
	let divider: HTMLElement;
	let finePrint: HTMLElement;
	let bottomQuote: HTMLElement;

	onMount(() => {
		if (!footerElement) return;

		// Animate brand name
		if (brandName) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: brandName,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (brandName) {
							gsap.set(brandName, { opacity: 0, x: -50 });
						}
					}
				}
			});
			tl.fromTo(
				brandName,
				{ opacity: 0, x: -50 },
				{ opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
			);
		}

		// Animate navigation links with stagger
		if (navLinks) {
			const links = navLinks.querySelectorAll('a');
			if (links.length > 0) {
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: navLinks,
						start: 'top 80%',
						toggleActions: 'play reverse play reverse',
						onLeave: () => {
							gsap.set(links, { opacity: 0, x: 50 });
						}
					}
				});
				tl.fromTo(
					links,
					{ opacity: 0, x: 50 },
					{ opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15 }
				);
			}
		}

		// Animate contact information
		if (contactInfo) {
			const contactItems = contactInfo.querySelectorAll('div');
			if (contactItems.length > 0) {
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: contactInfo,
						start: 'top 80%',
						toggleActions: 'play reverse play reverse',
						onLeave: () => {
							gsap.set(contactItems, { opacity: 0, y: 30 });
						}
					}
				});
				tl.fromTo(
					contactItems,
					{ opacity: 0, y: 30 },
					{ opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.2 }
				);
			}
		}

		// Animate footer image
		if (footerImage) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: footerImage,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (footerImage) {
							gsap.set(footerImage, { opacity: 0, scale: 0.9, x: 50 });
						}
					}
				}
			});
			tl.fromTo(
				footerImage,
				{ opacity: 0, scale: 0.9, x: 50 },
				{ opacity: 1, scale: 1, x: 0, duration: 1, ease: 'power3.out' }
			);
		}

		// Animate divider
		if (divider) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: divider,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						if (divider) {
							gsap.set(divider, { scaleX: 0 });
						}
					}
				}
			});
			tl.fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' });
		}

		// Animate fine print and bottom quote
		if (finePrint && bottomQuote) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: finePrint,
					start: 'top 80%',
					toggleActions: 'play reverse play reverse',
					onLeave: () => {
						gsap.set([finePrint, bottomQuote], { opacity: 0, y: 20 });
					}
				}
			});
			tl.fromTo(
				[finePrint, bottomQuote],
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.2 }
			);
		}

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => {
				if (
					trigger.vars.trigger === footerElement ||
					trigger.vars.trigger === brandName ||
					trigger.vars.trigger === navLinks ||
					trigger.vars.trigger === contactInfo ||
					trigger.vars.trigger === footerImage ||
					trigger.vars.trigger === divider ||
					trigger.vars.trigger === finePrint
				) {
					trigger.kill();
				}
			});
		};
	});
</script>

<footer bind:this={footerElement} class="bg-black text-white relative container">
	<div class="flex flex-row justify-between items-center pb-8 relative">
		<!-- Brand Name -->
		<h1
			bind:this={brandName}
			class="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal m-0 text-white leading-tight"
			style="font-family: 'Auge Trial', sans-serif;"
		>
			FRANK
		</h1>
		<!-- <script
			type="module"
			src="https://unpkg.com/@splinetool/viewer@1.12.28/build/spline-viewer.js"
		></script>
		<div class="absolute top-0 left-0 w-full h-full z-10">
			<spline-viewer url="https://prod.spline.design/xFB2ATaP2CqvgFgV/scene.splinecode"
			></spline-viewer>
		</div> -->

		<div bind:this={navLinks} class="flex flex-row items-center gap-16">
			<a
				class="formal-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal m-0 text-white leading-tight hover:text-[#CFF602] transition-colors duration-600"
				href="https://www.facebook.com/frankyou.com"
			>
				Work
			</a>
			<a
				class="formal-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal m-0 text-white leading-tight hover:text-[#CFF602] transition-colors duration-600"
				href="https://www.instagram.com/frankyou.com"
			>
				Pathways
			</a>
			<a
				class="formal-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal m-0 text-white leading-tight hover:text-[#CFF602] transition-colors duration-600"
				href="https://www.linkedin.com/company/frankyou.com"
			>
				Studio
			</a>
		</div>
	</div>

	<div class="flex flex-row w-full justify-between gap-[100px]">
		<!-- Left Section: Text Content -->
		<div class="flex items-start justify-start">
			<div class="flex flex-col gap-8 w-full">
				<!-- Contact Information -->
				<div bind:this={contactInfo} class="flex flex-col gap-6">
					<div class="flex flex-col gap-2">
						<p
							class="text-base font-normal text-white m-0 leading-normal"
							style="font-family: 'Venus+', sans-serif;"
						>
							New Business
						</p>
						<a
							href="mailto:business@frankyou.com"
							class="text-base font-normal text-white underline transition-opacity duration-200 hover:opacity-80"
							style="font-family: 'Venus+', sans-serif;">business@frankyou.com</a
						>
					</div>

					<div class="flex flex-col gap-2">
						<p
							class="text-base font-normal text-white m-0 leading-normal"
							style="font-family: 'Venus+', sans-serif;"
						>
							Other Inquiries
						</p>
						<a
							href="mailto:hello@frankyou.com"
							class="text-base font-normal text-white underline transition-opacity duration-200 hover:opacity-80"
							style="font-family: 'Venus+', sans-serif;">hello@frankyou.com</a
						>
					</div>
				</div>
			</div>
		</div>

		<!-- Right Section: Image Placeholder -->
		<div bind:this={footerImage} class="self-stretch max-h-140 rounded-[20px] overflow-hidden">
			<img src="/images/footer.jpg" alt="Footer" class="w-full h-full object-cover" />
		</div>
	</div>

	<div bind:this={divider} class="h-px w-full bg-[#333] mt-8 mb-4"></div>
	<div class="w-full flex flex-row justify-between items-center">
		<!-- Fine Print -->
		<p
			bind:this={finePrint}
			class="text-xs font-normal text-[#858585] m-0 mt-auto leading-normal"
			style="font-family: 'Manrope', sans-serif;"
		>
			All the fine print.
		</p>
		<p
			bind:this={bottomQuote}
			class="text-xs font-normal text-[#858585] m-0 leading-normal"
			style="font-family: 'Manrope', sans-serif;"
		>
			We can't be in two places at once.
		</p>
	</div>
</footer>
