<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	gsap.registerPlugin(ScrollTrigger);

	interface Props {
		text: string;
		baseColor?: string;
		highlightColor?: string;
		fontSize?: string;
		lineHeight?: string;
		fontFamily?: string;
		maxWidth?: string;
		className?: string;
		startTrigger?: string;
		endTrigger?: string;
	}

	const {
		text,
		baseColor = '#595959',
		highlightColor = '#ffffe6',
		fontSize = '36px',
		lineHeight = '52px',
		fontFamily = "'Manrope', sans-serif",
		maxWidth = '648px',
		className = '',
		startTrigger = 'top 70%',
		endTrigger = 'bottom 30%'
	}: Props = $props();

	let textContainer: HTMLElement | undefined = $state();
	let scrollTriggerInstance: ScrollTrigger | null = null;

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
		};
	});
</script>

<p
	bind:this={textContainer}
	class="relative block mx-auto px-4 sm:px-6 md:px-8 {className}"
	style="max-width: min({maxWidth}, 32ch, calc(100% - 2rem)); font-size: {fontSize}; line-height: {lineHeight}; font-family: {fontFamily};"
>
	<span class="block relative z-[1] antialiased" style="color: {baseColor}; mix-blend-mode: difference;">{text}</span>
	<span
		class="absolute top-0 left-0 w-full z-[2] pointer-events-none antialiased"
		style="color: {highlightColor};"
		>{text}</span
	>
</p>

