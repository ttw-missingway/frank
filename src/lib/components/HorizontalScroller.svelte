<script lang="ts">
	interface Props {
		overflowPadding?: number;
		perspective?: number;
		class?: string;
	}

	const {
		overflowPadding = 0,
		perspective = 1000,
		class: className = ''
	}: Props = $props();
</script>

<div class="horizontal-scroller" class:list={[className]} style="--overflow-padding: {overflowPadding}px; --perspective: {perspective}px;">
	<div class="horizontal-scroller-content">
		<slot />
	</div>
</div>

<style>
	.horizontal-scroller {
		width: 100%;
		overflow-x: auto;
		overflow-y: visible;
		scroll-snap-type: x mandatory;
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE and Edge */
		-webkit-overflow-scrolling: touch;
		scroll-behavior: smooth;
		cursor: grab;
		overscroll-behavior-x: contain;
		scroll-padding-left: 0;
		padding: var(--overflow-padding, 0) 0;
		margin: calc(var(--overflow-padding, 0) * -1) 0;
	}

	.horizontal-scroller:active {
		cursor: grabbing;
	}

	.horizontal-scroller::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}

	.horizontal-scroller-content {
		display: flex;
		gap: 1.5rem;
		padding: 0 1.5rem;
		will-change: transform;
		align-items: center;
		perspective: var(--perspective, 1000px);
	}

	@media (min-width: 768px) {
		.horizontal-scroller-content {
			gap: 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.horizontal-scroller-content {
			gap: 1.75rem;
		}
	}
</style>

