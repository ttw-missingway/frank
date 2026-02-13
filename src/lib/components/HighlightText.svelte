<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	gsap.registerPlugin(ScrollTrigger);

	interface Props {
		text: string;
		mode?: 'light' | 'dark';
		baseColor?: string;
		highlightColor?: string;
		fontSize?: string;
		lineHeight?: string;
		fontFamily?: string;
		maxWidth?: string;
		className?: string;
		startTrigger?: string;
		endTrigger?: string;
		alignment?: 'left' | 'center' | 'right';
	}

	const {
		text,
		mode = 'dark',
		baseColor,
		highlightColor,
		fontSize = 'clamp(1.75rem, 3vw + 1rem, 2.25rem)', // Responsive: 28px to 36px
		lineHeight = 'clamp(2.25rem, 4vw + 1.25rem, 3.25rem)', // Responsive: 36px to 52px
		fontFamily = "'Manrope', sans-serif",
		maxWidth = '648px',
		className = '',
		startTrigger = 'top 70%',
		endTrigger = 'bottom 30%',
		alignment = 'left'
	}: Props = $props();

	// Set default colors based on mode if not explicitly provided
	const resolvedBaseColor = baseColor ?? (mode === 'light' ? '#ffffff' : '#595959');
	const resolvedHighlightColor = highlightColor ?? (mode === 'light' ? '#1e1e1e' : '#ffffe6');

	let textContainer: HTMLElement | undefined = $state();
	let scrollTriggerInstance: ScrollTrigger | null = null;
	let resizeObserver: ResizeObserver | null = null;

	// Get text alignment class for base and highlight layers
	function getTextAlignmentClass(align: string): string {
		switch (align?.toLowerCase()) {
			case 'center':
				return 'text-center';
			case 'right':
				return 'text-right';
			case 'left':
			default:
				return 'text-left';
		}
	}

	// Function to detect line breaks by measuring rendered text height
	function detectLinesFromRenderedText(element: HTMLElement, text: string): string[] {
		const computedStyle = getComputedStyle(element);
		const temp = document.createElement('div');
		temp.style.position = 'absolute';
		temp.style.visibility = 'hidden';
		temp.style.whiteSpace = 'pre-wrap';
		temp.style.width = computedStyle.width;
		temp.style.font = computedStyle.font;
		temp.style.lineHeight = computedStyle.lineHeight;
		temp.style.padding = computedStyle.padding;
		temp.style.margin = computedStyle.margin;
		temp.style.wordWrap = computedStyle.wordWrap;
		temp.style.overflowWrap = computedStyle.overflowWrap;
		document.body.appendChild(temp);

		const words = text.split(' ');
		const lines: string[] = [];
		let currentLine = '';
		const lineHeightValue = parseFloat(computedStyle.lineHeight) || 52;

		words.forEach((word, index) => {
			const previousLine = currentLine;
			const testLine = currentLine + (currentLine ? ' ' : '') + word;

			// Measure previous line height
			if (previousLine) {
				temp.textContent = previousLine;
				const prevHeight = temp.offsetHeight;

				// Measure test line height
				temp.textContent = testLine;
				const testHeight = temp.offsetHeight;

				// If height increased by more than half a line, we wrapped to a new line
				if (testHeight > prevHeight + lineHeightValue * 0.3) {
					lines.push(previousLine);
					currentLine = word;
				} else {
					currentLine = testLine;
				}
			} else {
				currentLine = word;
			}

			// Always push the last line
			if (index === words.length - 1) {
				lines.push(currentLine);
			}
		});

		document.body.removeChild(temp);
		return lines.length > 0 ? lines : [text];
	}

	onMount(() => {
		if (!textContainer || !text) return;

		// Wait for next tick to ensure element is fully rendered
		setTimeout(() => {
			const baseLayer = textContainer?.querySelector('span:first-child') as HTMLElement;
			const highlightLayer = textContainer?.querySelector('span:last-child') as HTMLElement;

			if (!baseLayer || !highlightLayer || !textContainer) return;

			// Use Range API to detect actual line breaks from rendered text
			const lines = detectLinesFromRenderedText(baseLayer, text);
			const totalLines = lines.length;

			if (totalLines === 0) return;

			// Create line elements for highlight layer
			highlightLayer.innerHTML = lines
				.map(
					(line: string, index: number) =>
						`<span class="block whitespace-pre-wrap will-change-[clip-path] translate-z-0" data-line-index="${index}">${line}${index < lines.length - 1 ? ' ' : ''}</span>`
				)
				.join('');

			// Function to position highlight layer to match base layer exactly
			const positionHighlightLayer = () => {
				if (!textContainer) return;
				const baseRect = baseLayer.getBoundingClientRect();
				const containerRect = textContainer.getBoundingClientRect();

				// Use padding edge as origin (CSS containing block for absolute is padding edge of positioned ancestor)
				const cs = getComputedStyle(textContainer);
				const borderLeft = parseFloat(cs.borderLeftWidth) || 0;
				const borderTop = parseFloat(cs.borderTopWidth) || 0;
				const originLeft = containerRect.left + borderLeft;
				const originTop = containerRect.top + borderTop;
				const offsetTop = baseRect.top - originTop;
				const offsetLeft = baseRect.left - originLeft;
				const width = baseRect.width;
				const height = baseRect.height;
				// Round to avoid subpixel misalignment across browsers
				const topPx = Math.round(offsetTop);
				const leftPx = Math.round(offsetLeft);
				const widthPx = Math.round(width);
				const heightPx = Math.round(height);

				// Position highlight layer to match base layer exactly
				gsap.set(highlightLayer, {
					top: `${topPx}px`,
					left: `${leftPx}px`,
					width: `${widthPx}px`,
					height: `${heightPx}px`,
					right: 'auto',
					bottom: 'auto'
				});
			};

			// Position after a brief delay to ensure rendering is complete
			setTimeout(() => {
				positionHighlightLayer();
			}, 10);

			// Set up resize observer to reposition on resize
			if (textContainer) {
				resizeObserver = new ResizeObserver(() => {
					positionHighlightLayer();
				});
				resizeObserver.observe(textContainer);
				resizeObserver.observe(baseLayer);
			}

			const lineElements = highlightLayer.querySelectorAll(
				'span[data-line-index]'
			) as NodeListOf<HTMLElement>;

			// Set initial clip-path for all lines (hidden from right, so left side is visible)
			lineElements.forEach((line) => {
				gsap.set(line, {
					clipPath: 'inset(0 100% 0 0)'
				});
			});

			// Create scroll-triggered animation
			scrollTriggerInstance = ScrollTrigger.create({
				trigger: textContainer,
				start: startTrigger,
				end: endTrigger,
				scrub: true,
				onUpdate: (self) => {
					const progress = self.progress;

					lineElements.forEach((line, index) => {
						// Calculate when this line should start and end revealing
						const lineStart = index / totalLines;
						const lineEnd = (index + 1) / totalLines;

						// Calculate this line's individual progress (0 to 1)
						let lineProgress = 0;
						if (progress >= lineEnd) {
							lineProgress = 1; // Fully revealed
						} else if (progress > lineStart) {
							lineProgress = (progress - lineStart) / (lineEnd - lineStart);
						}

						// Clip from right to reveal left-to-right: 100% means only left visible, 0% means fully visible
						const clipPercent = (1 - lineProgress) * 100;
						gsap.set(line, {
							clipPath: `inset(0 ${clipPercent}% 0 0)`
						});
					});
				}
			});
		}, 0);

		return () => {
			if (scrollTriggerInstance) {
				scrollTriggerInstance.kill();
				scrollTriggerInstance = null;
			}
			if (resizeObserver) {
				resizeObserver.disconnect();
				resizeObserver = null;
			}
		};
	});
</script>

<p
	bind:this={textContainer}
	class="relative block mx-auto px-4 sm:px-6 md:px-8 {className}"
	style="max-width: min({maxWidth}, 32ch, calc(100% - 2rem)); font-size: {fontSize}; line-height: {lineHeight}; font-family: {fontFamily};"
>
	<span class="block relative z-[1] antialiased {getTextAlignmentClass(alignment)}" style="color: {resolvedBaseColor}; mix-blend-mode: difference;">{text}</span>
	<span
		class="absolute z-[2] pointer-events-none antialiased block {getTextAlignmentClass(alignment)}"
		style="color: {resolvedHighlightColor};"
		>{text}</span
	>
</p>

