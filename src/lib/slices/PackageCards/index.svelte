<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.PackagesSlice>;

	const { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="package-cards-section"
>
	<div class="package-cards-container">
		{#if slice.primary.packages && slice.primary.packages.length > 0}
			<div class="package-cards">
				{#each slice.primary.packages as packageItem}
					{@const packageLink = packageItem.package}
					{#if packageLink && 'data' in packageLink && packageLink.data?.packages && packageLink.data.packages.length > 0}
						{@const packageData = packageLink.data.packages[0]}
						{#if packageData}
							<div class="package-card">
								<div class="package-card-label">Starts at</div>
								<div class="package-card-price">
									{#if packageData.price}
										{packageData.price}
									{/if}
								</div>
								<div class="package-card-duration">
									{#if packageData.duration_options}
										{packageData.duration_options}
									{:else}
										6mo & 12mo
									{/if}
								</div>
							</div>
						{/if}
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.package-cards-section {
		background-color: #1a1a1a;
		padding: 3rem 1rem;
	}

	.package-cards-container {
		max-width: 1280px;
		margin: 0 auto;
	}

	.package-cards {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		align-items: stretch;
		flex-wrap: wrap;
	}

	.package-card {
		background-color: #e5e5e5;
		border-radius: 0.5rem;
		padding: 2rem 2.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		min-width: 200px;
		flex: 1 1 0;
		max-width: 300px;
	}

	.package-card-label {
		font-size: 0.875rem;
		color: #2a2a2a;
		margin-bottom: 0.5rem;
		text-align: center;
	}

	.package-card-price {
		font-size: 3rem;
		font-weight: 700;
		color: #1a1a1a;
		line-height: 1.2;
		margin: 0.5rem 0;
		text-align: center;
	}

	.package-card-duration {
		font-size: 0.875rem;
		color: #2a2a2a;
		margin-top: 0.5rem;
		text-align: center;
	}

	@media (max-width: 768px) {
		.package-cards-section {
			padding: 2rem 1rem;
		}

		.package-cards {
			flex-direction: column;
			align-items: center;
		}

		.package-card {
			width: 100%;
			max-width: 100%;
			min-width: auto;
		}

		.package-card-price {
			font-size: 2.5rem;
		}
	}

	@media (min-width: 769px) and (max-width: 1024px) {
		.package-card {
			padding: 1.75rem 2rem;
		}

		.package-card-price {
			font-size: 2.75rem;
		}
	}
</style>
