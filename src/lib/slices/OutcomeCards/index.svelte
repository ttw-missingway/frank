<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import HorizontalScroller from '$lib/components/HorizontalScroller.svelte';

	type Props = SliceComponentProps<Content.OutcomeCardsSlice>;

	const { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="outcome-cards-section container px-6 md:px-12"
>
	{#if slice.primary.label}
		<div class="outcome-cards-label">{slice.primary.label}</div>
	{/if}

	{#if slice.primary.outcome_cards && slice.primary.outcome_cards.length > 0}
		<HorizontalScroller>
			{#each slice.primary.outcome_cards as card}
				<div class="outcome-card">
					{#if card.upper_left_graphic}
						<div class="outcome-card-icon">{card.upper_left_graphic}</div>
					{/if}
					<div class="outcome-card-content">
						{#if card.heading}
							<h3 class="outcome-card-title">{card.heading}</h3>
						{/if}
						{#if card.description}
							<p class="outcome-card-description">{card.description}</p>
						{/if}
					</div>
				</div>
			{/each}
		</HorizontalScroller>
	{/if}
</section>

<style>
	.outcome-cards-section {
		padding: 3rem 0;
		background-color: transparent;
	}

	.outcome-cards-label {
		margin-bottom: 2rem;
		font-family: 'ClashDisplay Variable', sans-serif;
		font-size: clamp(0.75rem, 1vw + 0.5rem, 0.875rem); /* Responsive: 12px to 14px */
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #858585;
	}

	.outcome-card {
		background-color: #FFFFE6;
		border-radius: 0.5rem;
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		width: 220px;
		height: 300px;
		flex-shrink: 0;
		color: #000000;
		overflow: hidden;
	}

	.outcome-card-icon {
		font-size: clamp(3rem, 6vw + 1.5rem, 4.75rem); /* Responsive: 48px to 76px */
		line-height: 1;
		color: #000000;
		font-family: 'Venus+', sans-serif;
		font-weight: normal;
		letter-spacing: -0.02em;
		flex-shrink: 0;
	}

	.outcome-card-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: auto;
		flex: 0 0 48%;
		min-height: 0;
	}

	.outcome-card-title {
		font-family: 'Auge Trial', sans-serif;
		font-size: clamp(1rem, 1.5vw + 0.75rem, 1.25rem); /* Responsive: 16px to 20px */
		font-weight: 400;
		line-height: 1.3;
		color: #000000;
		margin: 0;
		flex-shrink: 0;
	}

	.outcome-card-description {
		font-family: 'Manrope', sans-serif;
		font-size: clamp(0.75rem, 1vw + 0.5rem, 0.875rem); /* Responsive: 12px to 14px */
		font-weight: 400;
		line-height: 1.5;
		color: #000000;
		margin: 0;
		opacity: 0.7;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 5;
		line-clamp: 5;
		-webkit-box-orient: vertical;
		flex: 1;
		min-height: 0;
	}

	@media (min-width: 768px) {
		.outcome-cards-section {
			padding: 4rem 0;
		}

		.outcome-cards-label {
			margin-bottom: 2.5rem;
		}

		.outcome-card {
			width: 260px;
			height: 360px;
			padding: 1.5rem 2rem;
		}

		.outcome-card-icon {
			font-size: clamp(3.5rem, 6.5vw + 1.75rem, 5.25rem); /* Responsive: 56px to 84px */
		}

		.outcome-card-title {
			font-size: clamp(1.125rem, 1.75vw + 0.875rem, 1.375rem); /* Responsive: 18px to 22px */
		}

		.outcome-card-description {
			font-size: clamp(0.8125rem, 1.125vw + 0.5625rem, 0.9375rem); /* Responsive: 13px to 15px */
			-webkit-line-clamp: 6;
			line-clamp: 6;
		}
	}

	@media (min-width: 1024px) {
		.outcome-cards-section {
			padding: 5rem 0;
		}

		.outcome-card {
			width: 300px;
			height: 400px;
			padding: 1.75rem 2.25rem;
		}

		.outcome-card-icon {
			font-size: clamp(4rem, 7vw + 2rem, 5.75rem); /* Responsive: 64px to 92px */
		}

		.outcome-card-title {
			font-size: clamp(1.25rem, 2vw + 1rem, 1.5rem); /* Responsive: 20px to 24px */
		}

		.outcome-card-description {
			font-size: clamp(0.875rem, 1.25vw + 0.625rem, 1rem); /* Responsive: 14px to 16px */
			-webkit-line-clamp: 7;
			line-clamp: 7;
		}
	}
</style>
