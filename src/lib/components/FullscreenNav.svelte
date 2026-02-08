<script lang="ts">
	import { PrismicLink } from '@prismicio/svelte';
	import Button from './Button.svelte';
	import Logo from './Logo.svelte';
	import type { SettingsDocument } from '../../prismicio-types';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	// @ts-ignore - SplitText import
	import { SplitText } from 'gsap/SplitText';
	// @ts-ignore - CustomEase import
	import { CustomEase } from 'gsap/CustomEase';

	gsap.registerPlugin(SplitText, CustomEase);

	interface Props {
		isOpen: boolean;
		settings: SettingsDocument | null;
		onClose: () => void;
	}

	const { isOpen, settings, onClose }: Props = $props();

	let navElement: HTMLElement | undefined = $state();
	let backgroundBlack: HTMLElement | undefined = $state();
	let topBar: HTMLElement | undefined = $state();
	let contentContainer: HTMLElement | undefined = $state();
	let emailInput: HTMLInputElement | undefined = $state();
	let emailValue = $state('');
	let isAnimating = $state(false);
	let currentRadius = $state(0);
	let navContainer: HTMLElement | undefined = $state();
	let splitTextInstances: SplitText[] = $state([]);
	let linkHoverSplitInstances: Map<HTMLElement, { words: SplitText, wordChars: SplitText[] }> = $state(new Map());
	let kineticTypeContainer: HTMLElement | undefined = $state();
	let typeLines: HTMLElement[] = $state([]);
	let customEase: gsap.EaseFunction | undefined = $state();
	let currentHoveredText = $state('');
	let hoverAnimationTimeline: gsap.core.Timeline | undefined = $state();
	let hasOpened = $state(false);
	
	// Keep component mounted during closing animation
	let shouldRender = $derived(isOpen || isAnimating || currentRadius > 0);

	// Prevent body scroll when nav is open and compensate for scrollbar width
	$effect(() => {
		if (isOpen) {
			// Get scrollbar width before hiding it
			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
			document.body.style.overflow = 'hidden';
			// Compensate for scrollbar width to prevent layout shift
			document.body.style.paddingRight = `${scrollbarWidth}px`;
		} else {
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
		}
	});

	// Handle opening animation
	$effect(() => {
		if (!backgroundBlack || !isOpen || hasOpened) return;

		hasOpened = true;
		isAnimating = false;
		// Reset kinetic animation state when opening
		forceResetKineticAnimation();
		// Reset font sizes on type lines
		if (typeLines.length > 0) {
			typeLines.forEach(line => {
				line.style.fontSize = '4rem';
			});
		}
		// Opening: calculate the diagonal of the screen to ensure circle covers entire viewport
		const width = window.innerWidth;
		const height = window.innerHeight;
		const diagonal = Math.sqrt(width * width + height * height);
		const radius = diagonal / 2;
		currentRadius = radius;

		// Set initial state: small circle at center for all elements
		const elementsToAnimate = [backgroundBlack];
		if (topBar) elementsToAnimate.push(topBar);
		if (contentContainer) elementsToAnimate.push(contentContainer);
		if (kineticTypeContainer) elementsToAnimate.push(kineticTypeContainer);

		// Clear any existing mask from closing animation on all elements
		elementsToAnimate.forEach(el => {
			el.style.maskImage = 'none';
			el.style.webkitMaskImage = 'none';
		});

		gsap.set(elementsToAnimate, {
			clipPath: `circle(0% at 50% 50%)`,
			scale: 1
		});

		// Hide text links initially during circle animation
		if (navContainer) {
			const navLinks = Array.from(navContainer.querySelectorAll('a')) as HTMLElement[];
			gsap.set(navLinks, {
				opacity: 0,
				visibility: 'hidden'
			});
		}

		// Animate to full screen - all elements together
		gsap.to(elementsToAnimate, {
			clipPath: `circle(${radius}px at 50% 50%)`,
			duration: 0.75,
			ease: 'power2.inOut',
			onComplete: () => {
				// Animate text typing in after nav is open with a delay for breathing room
				setTimeout(() => {
					animateTextIn();
				}, -100); // 100ms delay after circle animation completes
			}
		});
	});

	// Animate text typing in using SplitText
	function animateTextIn() {
		if (!navContainer) return;
		
		// Clean up any existing SplitText instances
		splitTextInstances.forEach(instance => {
			if (instance) instance.revert();
		});
		splitTextInstances = [];
		
		const navLinks = Array.from(navContainer.querySelectorAll('a')) as HTMLElement[];
		if (navLinks.length === 0) return;

		// Make links visible before splitting (clear opacity so children can be visible)
		gsap.set(navLinks, {
			opacity: 1,
			visibility: 'visible'
		});

		navLinks.forEach((link, linkIndex) => {
			// Create SplitText instance for this link
			const split = new SplitText(link, {
				type: 'chars',
				charsClass: 'char'
			});
			splitTextInstances.push(split);

			const chars = split.chars;
			if (!chars || chars.length === 0) return;

			// Set initial state for all characters
			gsap.set(chars, {
				opacity: 0,
				y: 20
			});

			// Animate characters appearing with stagger (typing effect)
			gsap.to(chars, {
				opacity: 1,
				y: 0,
				duration: 0.4,
				ease: 'power2.out',
				stagger: 0.03,
				delay: linkIndex * 0.15
			});
		});
	}

	// Handle closing animation with inverse mask (cutout effect)
	$effect(() => {
		if (!backgroundBlack || isOpen || currentRadius === 0 || isAnimating) return;

		// Closing: animate inverse mask (transparent circle expands, creating cutout)
		// Set isAnimating immediately to keep component mounted
		isAnimating = true;
		
		// Animate text floating away first
		animateTextOut();
		
		// Calculate the diagonal for the full radius
		const width = window.innerWidth;
		const height = window.innerHeight;
		const diagonal = Math.sqrt(width * width + height * height);
		const maxRadius = diagonal / 2;
		
		// Collect all elements to animate with mask
		const elementsToMask = [backgroundBlack];
		if (topBar) elementsToMask.push(topBar);
		if (contentContainer) elementsToMask.push(contentContainer);
		if (kineticTypeContainer) elementsToMask.push(kineticTypeContainer);
		
		// Kill any existing animations
		gsap.killTweensOf(elementsToMask);
		
		// Create an object to animate the radius value
		const maskObj = { radius: 0 };
		
		// Set initial mask state (fully opaque) for all elements
		const initialMask = 'radial-gradient(circle, transparent 0px, transparent 0px, black 0px, black 100%)';
		elementsToMask.forEach(el => {
			el.style.maskImage = initialMask;
			el.style.webkitMaskImage = initialMask;
		});
		
		// Animate the radius and update mask in real-time for all elements
		// Add delay to let text float away animation complete first
		gsap.to(maskObj, {
			radius: maxRadius,
			duration: 0.65,
			ease: 'power2.inOut',
			delay: 0.3, // Delay to let text float away animation breathe
			onUpdate: () => {
				const r = maskObj.radius;
				const maskValue = `radial-gradient(circle, transparent 0px, transparent ${r}px, black ${r}px, black 100%)`;
				elementsToMask.forEach(el => {
					el.style.maskImage = maskValue;
					el.style.webkitMaskImage = maskValue;
				});
			},
			onComplete: () => {
				isAnimating = false;
				currentRadius = 0;
				hasOpened = false; // Reset flag so nav can open again
				// Reset mask on all elements
				elementsToMask.forEach(el => {
					el.style.maskImage = 'none';
					el.style.webkitMaskImage = 'none';
				});
				// Clean up SplitText instances
				splitTextInstances.forEach(instance => {
					if (instance) instance.revert();
				});
				splitTextInstances = [];
				// Clean up kinetic animation state
				forceResetKineticAnimation();
				// Reset font sizes on type lines
				typeLines.forEach(line => {
					line.style.fontSize = '4rem';
				});
				// Clear link hover split instances
				linkHoverSplitInstances.forEach(({ words, wordChars }) => {
					words.revert();
					wordChars.forEach(charSplit => charSplit.revert());
				});
				linkHoverSplitInstances.clear();
				currentHoveredText = '';
			}
		});
	});

	// Animate text floating away
	function animateTextOut() {
		if (!navContainer || splitTextInstances.length === 0) return;

		splitTextInstances.forEach((split, linkIndex) => {
			if (!split || !split.chars) return;
			
			const chars = split.chars;
			
			// Animate each character floating away
			gsap.to(chars, {
				opacity: 0,
				y: -40,
				duration: 0.5,
				ease: 'power2.in',
				stagger: 0.02,
				delay: linkIndex * 0.05
			});
		});
	}

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

	// Reset kinetic animation to initial state
	function forceResetKineticAnimation() {
		if (hoverAnimationTimeline) {
			hoverAnimationTimeline.kill();
			hoverAnimationTimeline = undefined;
		}

		if (!kineticTypeContainer) return;

		gsap.killTweensOf([kineticTypeContainer, typeLines]);

		// Reset to initial state (start small)
		gsap.set(kineticTypeContainer, {
			display: 'grid',
			scale: 0.3,
			rotation: 0,
			opacity: 1,
			visibility: 'visible'
		});

		gsap.set(typeLines, {
			opacity: 0.015,
			x: '0%'
		});
	}

	// Initialize link hover split text (split by words, then chars)
	function initializeLinkHoverSplit(linkElement: HTMLElement) {
		if (linkHoverSplitInstances.has(linkElement)) return;
		
		// First split by words
		const wordSplit = new SplitText(linkElement, {
			type: 'words',
			wordsClass: 'nav-word'
		});
		
		const words = wordSplit.words;
		if (!words || words.length === 0) return;
		
		// Then split each word by chars
		const wordChars: SplitText[] = [];
		words.forEach((word) => {
			const charSplit = new SplitText(word as HTMLElement, {
				type: 'chars',
				charsClass: 'nav-char'
			});
			wordChars.push(charSplit);
		});
		
		linkHoverSplitInstances.set(linkElement, {
			words: wordSplit,
			wordChars: wordChars
		});
	}
	
	// Handle link hover - animate words to the right with letter stagger
	function handleLinkHoverAnimation(linkElement: HTMLElement) {
		if (!linkElement) return;
		
		// Initialize split if not already done
		initializeLinkHoverSplit(linkElement);
		
		const splitData = linkHoverSplitInstances.get(linkElement);
		if (!splitData) return;
		
		const { wordChars } = splitData;
		
		// Kill any existing animations on this link
		wordChars.forEach((charSplit) => {
			if (charSplit.chars) {
				gsap.killTweensOf(charSplit.chars);
			}
		});
		
		// Animate each word's characters with stagger
		wordChars.forEach((charSplit, wordIndex) => {
			const chars = charSplit.chars;
			if (!chars || chars.length === 0) return;
			
			// Push each word to the right, with letters staggering
			gsap.to(chars, {
				x: 30,
				duration: 0.6,
				ease: 'power2.out',
				stagger: 0.03, // Stagger by letter
				delay: wordIndex * 0.1 // Small delay between words
			});
		});
	}
	
	// Handle link leave - reset position
	function handleLinkLeaveAnimation(linkElement: HTMLElement) {
		if (!linkElement) return;
		
		const splitData = linkHoverSplitInstances.get(linkElement);
		if (!splitData) return;
		
		const { wordChars } = splitData;
		
		// Reset each word's characters
		wordChars.forEach((charSplit) => {
			const chars = charSplit.chars;
			if (!chars || chars.length === 0) return;
			
			gsap.to(chars, {
				x: 0,
				duration: 0.5,
				ease: 'power2.out',
				stagger: 0.02
			});
		});
	}
	
	// Calculate font size to ensure text fits on one line without wrapping
	function calculateFontSizeForText(text: string): number {
		const repeatedText = `${text.toUpperCase()} ${text.toUpperCase()} ${text.toUpperCase()}`;
		
		// Get font properties from the kinetic type container
		if (!kineticTypeContainer) return 4; // fallback
		
		const computedStyle = window.getComputedStyle(kineticTypeContainer);
		const fontFamily = computedStyle.fontFamily || 'Arial';
		const fontWeight = computedStyle.fontWeight || '900';
		
		// Create a temporary element to measure text width
		const measureEl = document.createElement('span');
		measureEl.style.position = 'absolute';
		measureEl.style.visibility = 'hidden';
		measureEl.style.whiteSpace = 'nowrap';
		measureEl.style.fontFamily = fontFamily;
		measureEl.style.fontWeight = fontWeight;
		measureEl.style.fontSize = '100px'; // Use 100px as base for measurement
		measureEl.textContent = repeatedText;
		document.body.appendChild(measureEl);
		
		const textWidthAt100px = measureEl.offsetWidth;
		document.body.removeChild(measureEl);
		
		// Calculate available width (accounting for rotation - use diagonal)
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const diagonal = Math.sqrt(viewportWidth * viewportWidth + viewportHeight * viewportHeight);
		const availableWidth = diagonal * 0.85; // Use 85% of diagonal to be safe
		
		// Calculate font size in rem: (availableWidth / textWidthAt100px) * 100, then convert px to rem
		const fontSizePx = (availableWidth / textWidthAt100px) * 100;
		const fontSizeRem = fontSizePx / 16; // Convert px to rem (assuming 16px base)
		
		// Clamp between reasonable values
		return Math.max(2, Math.min(8, fontSizeRem));
	}

	// Handle link hover - create kinetic typography effect matching CodePen
	function handleLinkHover(text: string, linkElement: HTMLElement) {
		// Animate the link text first
		handleLinkHoverAnimation(linkElement);
		
		if (!kineticTypeContainer || !isOpen || !customEase) return;
		
		// Reset any existing animation
		forceResetKineticAnimation();
		
		currentHoveredText = text;
		
		// Create repeated text: TEXT TEXT TEXT (all caps, matching CodePen)
		const repeatedText = `${text.toUpperCase()} ${text.toUpperCase()} ${text.toUpperCase()}`;
		
		// Calculate font size to prevent wrapping
		const fontSize = calculateFontSizeForText(text);
		
		// Set text content and font size on all type lines
		typeLines.forEach((line) => {
			line.textContent = repeatedText;
			line.style.fontSize = `${fontSize}rem`;
		});
		
		// Ensure container is visible
		kineticTypeContainer.style.display = 'grid';
		kineticTypeContainer.style.opacity = '1';
		kineticTypeContainer.style.visibility = 'visible';
		
		// Small delay to ensure DOM updates (matching CodePen)
		setTimeout(() => {
			if (!kineticTypeContainer || !customEase) return;
			
			const oddLines = typeLines.filter((_, i) => i % 2 === 0);
			const evenLines = typeLines.filter((_, i) => i % 2 === 1);
			
			// Create timeline matching CodePen exactly
			hoverAnimationTimeline = gsap.timeline({
				onComplete: () => {
					// Reset after animation
					forceResetKineticAnimation();
				}
			});
			
			// Phase 1: Scale and rotate (start small, end MUCH bigger)
			// Random rotation mostly vertical (-90° base with ±20° variation)
			const randomOffset = (Math.random() - 0.5) * 40; // -20 to +20 degrees
			const finalRotation = -90 + randomOffset;
			
			// Random scale between 3.5 and 5.5 (current max)
			const minScale = 3.5;
			const maxScale = 5.5;
			const randomScale = minScale + Math.random() * (maxScale - minScale);
			
			hoverAnimationTimeline.to(kineticTypeContainer, {
				duration: 1.4,
				ease: customEase,
				scale: randomScale,
				rotation: finalRotation
			});
			
			// Phase 2: Animate odd lines (right then left)
			hoverAnimationTimeline.to(
				oddLines,
				{
					keyframes: [
						{ x: '20%', duration: 1, ease: customEase },
						{ x: '-200%', duration: 1.5, ease: customEase }
					],
					stagger: 0.08
				},
				0 // Start at same time as scale/rotate
			);
			
			// Phase 3: Animate even lines (left then right)
			hoverAnimationTimeline.to(
				evenLines,
				{
					keyframes: [
						{ x: '-20%', duration: 1, ease: customEase },
						{ x: '200%', duration: 1.5, ease: customEase }
					],
					stagger: 0.08
				},
				0 // Start at same time as scale/rotate
			);
			
			// Phase 4: Opacity animation (fade in then out) - max opacity 0.5
			hoverAnimationTimeline.to(
				typeLines,
				{
					keyframes: [
						{ opacity: 0.5, duration: 1, ease: customEase },
						{ opacity: 0, duration: 1.5, ease: customEase }
					],
					stagger: 0.05
				},
				0 // Start at same time as scale/rotate
			);
		}, 20); // Small delay matching CodePen
	}
	
	function handleLinkLeave(linkElement?: HTMLElement) {
		// Reset link animation
		if (linkElement) {
			handleLinkLeaveAnimation(linkElement);
		}
		
		// Fade out kinetic animation
		if (!kineticTypeContainer || !hoverAnimationTimeline) {
			forceResetKineticAnimation();
			return;
		}
		
		// Kill the current animation
		if (hoverAnimationTimeline) {
			hoverAnimationTimeline.kill();
			hoverAnimationTimeline = undefined;
		}
		
		// Fade out timeline
		const fadeOutTimeline = gsap.timeline({
			onComplete: () => {
				forceResetKineticAnimation();
			}
		});
		
		fadeOutTimeline.to(kineticTypeContainer, {
			opacity: 0,
			scale: 0.8,
			duration: 0.5,
			ease: customEase || 'power2.out'
		});
		
		currentHoveredText = '';
	}

	// Initialize type lines when container is available
	function initializeTypeLines() {
		if (!kineticTypeContainer) return;
		
		// Check if lines already exist and are in the DOM
		const existingLines = kineticTypeContainer.querySelectorAll('.type-line');
		if (existingLines.length > 0 && typeLines.length > 0) {
			// Verify the lines in the array are still in the DOM
			const allValid = typeLines.every(line => line.isConnected);
			if (allValid) return;
		}
		
		// Clear any stale references
		typeLines = [];
		// Remove any existing lines from the container
		existingLines.forEach(line => line.remove());
		
		// Create multiple type-line elements (odd/even pattern)
		const numLines = 20; // Enough lines to cover screen when rotated
		for (let i = 0; i < numLines; i++) {
			const line = document.createElement('div');
			line.className = 'type-line';
			if (i % 2 === 0) {
				line.classList.add('odd');
			} else {
				line.classList.add('even');
			}
			line.style.opacity = '0.015';
			line.style.fontSize = '4rem'; // Initial font size, will be adjusted on hover
			kineticTypeContainer.appendChild(line);
			typeLines.push(line);
		}
	}
	
	// Watch for container availability
	$effect(() => {
		if (kineticTypeContainer) {
			// Create custom ease function matching CodePen (only once)
			if (!customEase) {
				try {
					customEase = CustomEase.create('customEase', '0.86, 0, 0.07, 1');
				} catch (e) {
					// Fallback to power2 if CustomEase fails
					customEase = 'power2.out' as any;
				}
			}
			initializeTypeLines();
		}
	});

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if shouldRender}
	<div
		bind:this={navElement}
		class="fixed inset-0 z-[100] flex flex-col "
		role="dialog"
		aria-modal="true"
		aria-label="Navigation menu"
	>
		<div
			bind:this={backgroundBlack}
			class="background-black absolute top-0 left-0 w-full h-full bg-black z-10 outline-1 outline-white"
		></div>

		<!-- Kinetic typography background layer (matching CodePen structure) -->
		<div
			bind:this={kineticTypeContainer}
			id="kinetic-type"
			class="absolute inset-0 z-[15] pointer-events-none font-auge text-white text-9xl font-black"
			style="display: grid; grid-template-columns: 1fr; gap: 0; place-items: center; transform-origin: center center; opacity: 1; visibility: visible;"
		>
			<!-- Type lines will be created dynamically in onMount -->
		</div>
		
		<style>
			:global(#kinetic-type) {
				z-index: 15 !important;
				display: grid !important;
				visibility: visible !important;
				opacity: 1;
				pointer-events: none;
			}
			
			:global(.type-line) {
				white-space: nowrap;
				overflow: hidden;
				/* Font size will be set dynamically via inline styles */
			}
			
			/* Navigation link hover animation styles */
			:global(.nav-word) {
				display: inline-block;
			}
			
			:global(.nav-char) {
				display: inline-block;
			}
		</style>

		<!-- Top bar with logo and close button - matches header structure exactly -->
		<div bind:this={topBar} class="fixed top-0 left-0 right-0 z-30">
			<div class="flex justify-between items-center py-6 md:py-8 lg:py-10 container">
				<!-- Logo -->
				<Logo onClick={onClose} class="cursor-pointer relative" />

				<!-- Close button -->
				<Button
					on:click={onClose}
					class="text-white hover:opacity-80 transition-opacity focus:outline-none p-2 relative cursor-pointer"
					aria-label="Close menu"
					type="button"
					hoverEffect={false}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="20" y1="4" x2="4" y2="20" />
						<line x1="4" y1="4" x2="20" y2="20" />
					</svg>
				</Button>
			</div>
		</div>

		<div bind:this={contentContainer} class="relative flex flex-col z-20 w-full h-full container">
			<!-- Main navigation links - positioned left and slightly above center -->
			<div class="flex-1 flex items-center px-6 md:px-8 lg:px-10 -mt-20">
				<nav bind:this={navContainer} class="flex flex-col gap-6 md:gap-8">
					{#if settings?.data.links && settings.data.links.length > 0}
						{#each settings.data.links as linkItem}
							{@const link = linkItem.link}
							{#if link}
								<PrismicLink
									field={link}
									onclick={onClose}
									onmouseenter={(e) => {
										const text = link.text || 'Link';
										const linkEl = e.currentTarget as HTMLElement;
										handleLinkHover(text, linkEl);
									}}
									onmouseleave={(e) => {
										handleLinkLeave(e.currentTarget as HTMLElement);
									}}
									class="text-[#FFFFE6] font-auge text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.1] block relative z-20"
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
					<Button
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
					</Button>
				</form>
			</div>
		</div>
	</div>
{/if}
