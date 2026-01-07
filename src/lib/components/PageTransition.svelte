<script lang="ts">
	import { gsap } from 'gsap';
	import { onNavigate } from '$app/navigation';

	let transitionOverlay: HTMLElement | undefined = $state();
	let isTransitioning = $state(false);

	// Handle page navigation - return promise to delay navigation until wipe-in completes
	onNavigate((navigation) => {
		// Only animate if navigating to a different route
		if (!navigation.to || navigation.to.url.pathname === navigation.from?.url.pathname) {
			return;
		}

		// Return a promise that delays navigation until wipe-in completes
		return new Promise<void>((resolve) => {
			if (!transitionOverlay || isTransitioning) {
				resolve();
				return;
			}

			isTransitioning = true;

			// Calculate the diagonal of the screen to ensure circle covers entire viewport
			const width = window.innerWidth;
			const height = window.innerHeight;
			const diagonal = Math.sqrt(width * width + height * height);
			const radius = diagonal / 2;

			// Clear any existing styles
			transitionOverlay.style.maskImage = 'none';
			transitionOverlay.style.webkitMaskImage = 'none';

			// Set initial state: small circle at center
			gsap.set(transitionOverlay, {
				clipPath: `circle(0% at 50% 50%)`,
				opacity: 1,
				visibility: 'visible'
			});

			// Animate to full screen (wipe in)
			gsap.to(transitionOverlay, {
				clipPath: `circle(${radius}px at 50% 50%)`,
				duration: 0.5,
				ease: 'power2.inOut',
				onComplete: () => {
					// Screen is now fully black - allow navigation to proceed
					resolve();
					
					// After navigation completes, start wipe out
					// Use a small delay to ensure navigation has started
					setTimeout(() => {
						wipeOut();
					}, 50);
				}
			});
		});
	});

	function wipeOut() {
		if (!transitionOverlay) return;

		// Calculate the diagonal for the full radius
		const width = window.innerWidth;
		const height = window.innerHeight;
		const diagonal = Math.sqrt(width * width + height * height);
		const maxRadius = diagonal / 2;

		// Switch to mask-based animation for wipe out (cutout effect)
		// Clear clipPath and use mask instead
		gsap.set(transitionOverlay, {
			clipPath: 'none'
		});

		// Create an object to animate the radius value
		const maskObj = { radius: 0 };

		// Set initial mask state (fully opaque)
		const initialMask = 'radial-gradient(circle, transparent 0px, transparent 0px, black 0px, black 100%)';
		transitionOverlay.style.maskImage = initialMask;
		transitionOverlay.style.webkitMaskImage = initialMask;

		// Animate the radius and update mask in real-time
		gsap.to(maskObj, {
			radius: maxRadius,
			duration: 0.45,
			ease: 'power2.inOut',
			onUpdate: () => {
				const r = maskObj.radius;
				const maskValue = `radial-gradient(circle, transparent 0px, transparent ${r}px, black ${r}px, black 100%)`;
				if (transitionOverlay) {
					transitionOverlay.style.maskImage = maskValue;
					transitionOverlay.style.webkitMaskImage = maskValue;
				}
			},
			onComplete: () => {
				// Reset state
				isTransitioning = false;
				if (transitionOverlay) {
					transitionOverlay.style.maskImage = 'none';
					transitionOverlay.style.webkitMaskImage = 'none';
					transitionOverlay.style.clipPath = 'none';
					transitionOverlay.style.opacity = '0';
					transitionOverlay.style.visibility = 'hidden';
				}
			}
		});
	}
</script>

<div
	bind:this={transitionOverlay}
	class="fixed inset-0 z-9999 bg-black pointer-events-none"
	style="opacity: 0; visibility: hidden;"
	aria-hidden="true"
></div>
