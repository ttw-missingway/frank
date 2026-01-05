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
		font-size: 0.875rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #858585;
	}

	.outcome-card {
		background-color: #ffffff;
		border-radius: 0.5rem;
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		width: 220px;
		height: 280px;
		flex-shrink: 0;
		color: #000000;
		overflow: hidden;
	}

	.outcome-card-icon {
		font-size: 7rem;
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
		flex: 0 0 33.333%;
		min-height: 0;
	}

	.outcome-card-title {
		font-family: 'Auge Trial', sans-serif;
		font-size: 1.25rem;
		font-weight: 400;
		line-height: 1.3;
		color: #000000;
		margin: 0;
		flex-shrink: 0;
	}

	.outcome-card-description {
		font-family: 'Manrope', sans-serif;
		font-size: 0.875rem;
		font-weight: 400;
		line-height: 1.5;
		color: #000000;
		margin: 0;
		opacity: 0.7;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
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
			height: 330px;
			padding: 1.5rem 2rem;
		}

		.outcome-card-icon {
			font-size: 8rem;
		}

		.outcome-card-title {
			font-size: 1.375rem;
		}

		.outcome-card-description {
			font-size: 0.9375rem;
			-webkit-line-clamp: 5;
			line-clamp: 5;
		}
	}

	@media (min-width: 1024px) {
		.outcome-cards-section {
			padding: 5rem 0;
		}

		.outcome-card {
			width: 300px;
			height: 380px;
			padding: 1.75rem 2.25rem;
		}

		.outcome-card-icon {
			font-size: 9rem;
		}

		.outcome-card-title {
			font-size: 1.5rem;
		}

		.outcome-card-description {
			font-size: 1rem;
			-webkit-line-clamp: 6;
			line-clamp: 6;
		}
	}
</style>
