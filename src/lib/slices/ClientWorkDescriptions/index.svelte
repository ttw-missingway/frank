<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.ClientWorkDescriptionsSlice>;

	const { slice }: Props = $props();

	// Convert number to superscript (starting from 3 as shown in screenshot)
	function getSuperscriptNumber(index: number): string {
		const superscriptMap: Record<number, string> = {
			0: '³',
			1: '⁴',
			2: '⁵',
			3: '⁶',
			4: '⁷',
			5: '⁸',
			6: '⁹'
		};
		return superscriptMap[index] || String.fromCharCode(0x2070 + index + 3);
	}
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-[#FFFFE6] py-12 md:py-16"
>
	<div class="container px-6 md:px-12">
		<h2 class="pathway-heading">Pathway</h2>
		
		{#if slice.primary.pathways && slice.primary.pathways.length > 0}
			<div class="pathway-entries">
				{#each slice.primary.pathways as pathwayItem, index}
					{@const workDoc = pathwayItem.pathways}
					{#if workDoc && 'data' in workDoc && workDoc.data?.pathways && workDoc.data.pathways.length > 0}
						{@const workPathwayItem = workDoc.data.pathways[0]}
						{#if workPathwayItem}
							{@const pathwayLink = workPathwayItem.pathway}
						{#if pathwayLink && 'data' in pathwayLink && pathwayLink.data?.pathway && pathwayLink.data.pathway.length > 0}
							{@const pathwayData = pathwayLink.data.pathway[0]}
							{#if pathwayData}
								<div class="pathway-entry" class:active={index === 0}>
									<div class="pathway-entry-content">
										<!-- Left Section: Number, Title, and Subtitle -->
										<div class="pathway-entry-left">
											<div class="pathway-number-title">
												<span class="pathway-number">{getSuperscriptNumber(index)}</span>
												{#if pathwayData.title}
													<h3 class="pathway-title">{pathwayData.title}</h3>
												{/if}
											</div>
											{#if pathwayData.subtitle}
												<p class="pathway-subtitle">{pathwayData.subtitle}</p>
											{/if}
										</div>

										<!-- Right Section: Two Description Columns -->
										<div class="pathway-entry-right">
											<div class="pathway-descriptions">
												{#if pathwayData.before_text}
													<p class="pathway-description">{pathwayData.before_text}</p>
												{/if}
												{#if pathwayData.after_text}
													<p class="pathway-description">{pathwayData.after_text}</p>
												{/if}
											</div>
										</div>
									</div>
									{#if index === 0}
										<div class="pathway-separator"></div>
									{/if}
								</div>
							{/if}
						{/if}
						{/if}
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.pathway-heading {
		font-size: 1.5rem;
		font-weight: 400;
		color: #FFFFE6;
		margin: 0 0 1.5rem 0;
	}

	.pathway-entries {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.pathway-entry {
		position: relative;
		padding: 1.5rem 0;
	}

	.pathway-entry.active {
		padding-bottom: 2rem;
	}

	.pathway-entry-content {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 3rem;
		align-items: start;
	}

	.pathway-entry-left {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 200px;
	}

	.pathway-number-title {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
	}

	.pathway-number {
		font-size: 1.5rem;
		font-weight: 400;
		color: #FFFFE6;
		line-height: 1;
	}

	.pathway-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #FFFFE6;
		margin: 0;
		line-height: 1.3;
	}

	.pathway-subtitle {
		font-size: 0.875rem;
		color: #a0a0a0;
		margin: 0;
		line-height: 1.4;
	}

	.pathway-entry-right {
		display: flex;
		align-items: start;
	}

	.pathway-descriptions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		width: 100%;
	}

	.pathway-description {
		font-size: 1rem;
		color: #FFFFE6;
		margin: 0;
		line-height: 1.6;
	}

	.pathway-separator {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background-color: #3b82f6;
		margin-top: 1rem;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.pathway-entry-content {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.pathway-entry-left {
			min-width: auto;
		}

		.pathway-descriptions {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.pathway-title {
			font-size: 1.25rem;
		}

		.pathway-number {
			font-size: 1.25rem;
		}
	}

	@media (min-width: 769px) and (max-width: 1024px) {
		.pathway-entry-content {
			gap: 2rem;
		}

		.pathway-descriptions {
			gap: 1.5rem;
		}
	}
</style>
