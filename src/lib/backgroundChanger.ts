import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Options for the background changer
 */
export interface BackgroundChangerOptions {
	/** Duration for background color transitions (default: 1.2) */
	bgDuration?: number;
	/** Duration for text color transitions (default: 0.8) */
	textDuration?: number;
	/** GSAP easing function (default: 'power2.inOut') */
	ease?: string;
	/** ScrollTrigger start position (default: 'top 50%') */
	start?: string;
	/** ScrollTrigger end position (default: 'bottom 50%') */
	end?: string;
}

/**
 * Creates a background changer that transitions the site from black to white
 * when the trigger element reaches the specified scroll position.
 * 
 * @example
 * ```svelte
 * <script>
 *   import { onMount } from 'svelte';
 *   import { createBackgroundChanger } from '$lib/backgroundChanger';
 * 
 *   let sectionElement: HTMLElement;
 * 
 *   onMount(() => {
 *     if (!sectionElement) return;
 *     const changer = createBackgroundChanger(sectionElement);
 *     return () => changer?.destroy();
 *   });
 * </script>
 * 
 * <section bind:this={sectionElement}>
 *   <!-- Your content -->
 * </section>
 * ```
 */

export function createBackgroundChanger(
	triggerElement: HTMLElement,
	options: BackgroundChangerOptions = {}
) {
	const {
		bgDuration = 1.2,
		textDuration = 0.8,
		ease = 'power2.inOut',
		start = 'top 50%',
		end = 'bottom 50%'
	} = options;

	const html = document.documentElement;
	const body = document.body;
	const main = document.querySelector('main');

	if (!html || !body || !triggerElement) return null;

	// Store original colors for restoration
	const originalColors = new WeakMap<HTMLElement, string>();

	/**
	 * Checks if a color is black, white, or the special off-white color (#FFFFE6)
	 */
	const isBlackOrWhite = (color: string): boolean => {
		if (!color) return false;
		const normalized = color.toLowerCase().trim();
		// Check for black variations
		if (normalized === 'black' || normalized === '#000' || normalized === '#000000' || normalized === 'rgb(0, 0, 0)') {
			return true;
		}
		// Check for white variations
		if (normalized === 'white' || normalized === '#fff' || normalized === '#ffffff' || normalized === 'rgb(255, 255, 255)') {
			return true;
		}
		// Check for the special off-white color #FFFFE6
		if (normalized === '#fffe6' || normalized === '#ffffe6' || normalized === 'rgb(255, 255, 230)') {
			return true;
		}
		// Check RGB values
		const rgbMatch = normalized.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
		if (rgbMatch) {
			const r = parseInt(rgbMatch[1]);
			const g = parseInt(rgbMatch[2]);
			const b = parseInt(rgbMatch[3]);
			// Black
			if (r === 0 && g === 0 && b === 0) return true;
			// White
			if (r === 255 && g === 255 && b === 255) return true;
			// Special off-white #FFFFE6 = rgb(255, 255, 230)
			if (r === 255 && g === 255 && b === 230) return true;
		}
		return false;
	};

	/**
	 * Checks if a color is black
	 */
	const isBlack = (color: string): boolean => {
		if (!color) return false;
		const normalized = color.toLowerCase().trim();
		if (normalized === 'black' || normalized === '#000' || normalized === '#000000' || normalized === 'rgb(0, 0, 0)') {
			return true;
		}
		const rgbMatch = normalized.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
		if (rgbMatch) {
			const r = parseInt(rgbMatch[1]);
			const g = parseInt(rgbMatch[2]);
			const b = parseInt(rgbMatch[3]);
			return r === 0 && g === 0 && b === 0;
		}
		return false;
	};

	/**
	 * Checks if a color is white or the special off-white (#FFFFE6)
	 */
	const isWhite = (color: string): boolean => {
		if (!color) return false;
		const normalized = color.toLowerCase().trim();
		if (normalized === 'white' || normalized === '#fff' || normalized === '#ffffff' || normalized === 'rgb(255, 255, 255)') {
			return true;
		}
		if (normalized === '#fffe6' || normalized === '#ffffe6' || normalized === 'rgb(255, 255, 230)') {
			return true;
		}
		const rgbMatch = normalized.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
		if (rgbMatch) {
			const r = parseInt(rgbMatch[1]);
			const g = parseInt(rgbMatch[2]);
			const b = parseInt(rgbMatch[3]);
			// White
			if (r === 255 && g === 255 && b === 255) return true;
			// Special off-white #FFFFE6 = rgb(255, 255, 230)
			if (r === 255 && g === 255 && b === 230) return true;
		}
		return false;
	};

	/**
	 * Gets all text elements and filters to only black/white text
	 */
	const getBlackOrWhiteTextElements = (): HTMLElement[] => {
		const allTextElements = document.querySelectorAll<HTMLElement>(
			'.text-white, [class*="text-white"], .text-gray-400, .formal-heading, .body-copy, .small-copy, header, header *, footer, footer *, main *, section *'
		);
		const filtered: HTMLElement[] = [];
		allTextElements.forEach((el) => {
			const computedColor = window.getComputedStyle(el).color;
			if (isBlackOrWhite(computedColor)) {
				filtered.push(el);
			}
		});
		return filtered;
	};

	const toggleWhiteMode = (enable: boolean) => {
		if (enable) {
			// Change all backgrounds to white with smooth easing
			gsap.to([html, body, main], {
				backgroundColor: 'white',
				duration: bgDuration,
				ease: ease
			});
			const blackBgElements = document.querySelectorAll(
				'.bg-black, [class*="bg-black"], section'
			);
			gsap.to(blackBgElements, {
				backgroundColor: 'white',
				duration: bgDuration,
				ease: ease
			});

			// Get all text elements and filter to only black/white text
			const textElements = getBlackOrWhiteTextElements();
			textElements.forEach((el) => {
				const computedColor = window.getComputedStyle(el).color;
				// Store original color if not already stored
				if (!originalColors.has(el)) {
					originalColors.set(el, computedColor);
				}
				
				if (isBlack(computedColor)) {
					// Change black text to white
					gsap.to(el, {
						color: 'white',
						duration: textDuration,
						ease: ease
					});
				} else if (isWhite(computedColor)) {
					// Change white/off-white text to black
					gsap.to(el, {
						color: 'black',
						duration: textDuration,
						ease: ease
					});
				}
				// Colored text is ignored and stays the same
			});

			// Change header images (logo and hamburger) to black using filter
			const headerImages = document.querySelectorAll('header img');
			gsap.to(headerImages, {
				filter: 'brightness(0)',
				duration: textDuration,
				ease: ease
			});
		} else {
			// Reset backgrounds with smooth fade back
			gsap.to([html, body, main], {
				backgroundColor: 'black',
				duration: bgDuration,
				ease: ease
			});
			const blackBgElements = document.querySelectorAll(
				'.bg-black, [class*="bg-black"], section'
			);
			gsap.to(blackBgElements, {
				backgroundColor: 'black',
				duration: bgDuration,
				ease: ease,
				onComplete: () => {
					gsap.set(blackBgElements, { clearProps: 'backgroundColor' });
				}
			});

			// Get all text elements and filter to only black/white text
			const textElements = getBlackOrWhiteTextElements();
			textElements.forEach((el) => {
				const originalColor = originalColors.get(el);
				if (originalColor) {
					// Restore original color
					gsap.to(el, {
						color: originalColor,
						duration: textDuration,
						ease: ease,
						onComplete: () => {
							gsap.set(el, { clearProps: 'color' });
							originalColors.delete(el);
						}
					});
				} else {
					// If no original color stored, check current color and invert
					const computedColor = window.getComputedStyle(el).color;
					if (isBlack(computedColor)) {
						// Current is black, was originally white, restore to white
						gsap.to(el, {
							color: 'white',
							duration: textDuration,
							ease: ease,
							onComplete: () => {
								gsap.set(el, { clearProps: 'color' });
							}
						});
					} else if (isWhite(computedColor)) {
						// Current is white, was originally black, restore to black
						gsap.to(el, {
							color: 'black',
							duration: textDuration,
							ease: ease,
							onComplete: () => {
								gsap.set(el, { clearProps: 'color' });
							}
						});
					}
				}
				// Colored text is ignored and stays the same
			});

			// Reset header images back to original (remove filter)
			const headerImages = document.querySelectorAll('header img');
			// Use fromTo to ensure smooth animation from current brightness(0) to brightness(1)
			gsap.fromTo(
				headerImages,
				{ filter: 'brightness(0)' },
				{
					filter: 'brightness(1)',
					duration: textDuration,
					ease: ease,
					onComplete: () => {
						// Small delay to ensure smooth transition before clearing
						gsap.delayedCall(0.1, () => {
							gsap.set(headerImages, { clearProps: 'filter' });
						});
					}
				}
			);
		}
	};

	const scrollTrigger = ScrollTrigger.create({
		trigger: triggerElement,
		start,
		end,
		onEnter: () => {
			toggleWhiteMode(true);
		},
		onLeave: () => {
			toggleWhiteMode(false);
		},
		onEnterBack: () => {
			toggleWhiteMode(true);
		},
		onLeaveBack: () => {
			toggleWhiteMode(false);
		}
	});

	return {
		destroy: () => {
			scrollTrigger.kill();
		},
		toggleWhiteMode: (enable: boolean) => {
			toggleWhiteMode(enable);
		}
	};
}

