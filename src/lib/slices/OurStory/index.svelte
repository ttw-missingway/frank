<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.OurStorySlice>;

	const { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-white"
>
	<div class="our-story-container">
		{#if slice.primary.body_copy}
			<div class="left-section">
				<p class="left-text">{slice.primary.body_copy}</p>
			</div>
		{/if}
		
		<div class="right-section">
			{#if slice.primary.heading}
				<h2 class="heading">{slice.primary.heading}</h2>
			{/if}
			{#if slice.primary.description}
				<p class="description">{slice.primary.description}</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.our-story-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: 100vh;
		width: 100%;
	}

	.left-section {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.left-text {
		font-size: 1.5rem;
		line-height: 1.5;
		text-align: center;
		font-weight: normal;
	}

	.right-section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		padding: 2rem;
		padding-top: 4rem;
	}

	.heading {
		font-size: 2.5rem;
		font-weight: normal;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	.description {
		font-size: 1rem;
		line-height: 1.6;
		font-weight: normal;
		max-width: 100%;
	}

	@media (min-width: 768px) {
		.left-text {
			font-size: 2rem;
		}

		.heading {
			font-size: 3.5rem;
		}

		.description {
			font-size: 1.125rem;
		}

		.left-section,
		.right-section {
			padding: 3rem;
		}

		.right-section {
			padding-top: 5rem;
		}
	}

	@media (min-width: 1024px) {
		.left-text {
			font-size: 2.5rem;
		}

		.heading {
			font-size: 4.5rem;
		}

		.description {
			font-size: 1.25rem;
		}

		.left-section,
		.right-section {
			padding: 4rem;
		}
	}
</style>
