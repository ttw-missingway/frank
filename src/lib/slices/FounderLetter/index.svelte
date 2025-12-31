<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { PrismicImage } from '@prismicio/svelte';
	import HighlightText from '$lib/components/HighlightText.svelte';

	type Props = SliceComponentProps<Content.FounderLetterSlice>;

	const { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="bg-black text-white py-12 px-6 md:py-16 md:px-12"
>
	<div class="founder-letter-container">
		<div class="left-section">
			{#if slice.primary.avatar?.url}
				<div class="avatar-wrapper">
					<PrismicImage
						field={slice.primary.avatar}
					/>
				</div>
			{/if}
			
			<div class="profile-info">
				{#if slice.primary.heading}
					<h2 class="heading">{slice.primary.heading}</h2>
				{/if}
				
				{#if slice.primary.description}
					<p class="role">{slice.primary.description}</p>
				{/if}
			</div>
		</div>
		
		<div class="right-section">
			{#if slice.primary.letter_text}
				<HighlightText
					text={slice.primary.letter_text}
					baseColor="#4a5a3f"
					highlightColor="#ffffe6"
					fontSize="clamp(1rem, 2vw, 1.5rem)"
					lineHeight="1.8"
					className="founder-letter-text"
				/>
			{/if}
		</div>
	</div>
</section>

<style>
	.founder-letter-container {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
	}

	.left-section {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		padding: 2.5rem;
		background-color: #2a2a2a;
		border-radius: 24px;
	}

	.avatar-wrapper {
		width: 120px;
		height: 120px;
		margin-bottom: 1.5rem;
		border-radius: 50%;
		overflow: hidden;
		position: relative;
	}

	.avatar-wrapper :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.profile-info {
		width: 100%;
	}

	.heading {
		font-size: 1.5rem;
		font-weight: 600;
		color: white;
		margin-bottom: 0.25rem;
		line-height: 1.3;
		font-family: 'Manrope', sans-serif;
	}

	.role {
		font-size: 0.875rem;
		color: #9ca3af;
		line-height: 1.5;
		font-weight: normal;
		margin-bottom: 0;
		font-family: 'Manrope', sans-serif;
	}

	.right-section {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 3rem;
		background-color: #6b7a5f;
		border-radius: 24px;
		min-height: 400px;
	}

	:global(.founder-letter-text) {
		width: 100%;
	}

	@media (min-width: 768px) {
		.founder-letter-container {
			grid-template-columns: 1fr 1.5fr;
			gap: 2rem;
		}

		.avatar-wrapper {
			width: 150px;
			height: 150px;
			margin-bottom: 2rem;
		}

		.heading {
			font-size: 2rem;
			margin-bottom: 0.75rem;
		}

		.role {
			font-size: 0.9375rem;
		}

		.left-section,
		.right-section {
			padding: 3rem;
		}

		.right-section {
			min-height: 500px;
		}
	}

	@media (min-width: 1024px) {
		.founder-letter-container {
			gap: 2.5rem;
		}

		.avatar-wrapper {
			width: 180px;
			height: 180px;
			margin-bottom: 2.5rem;
		}

		.heading {
			font-size: 2.5rem;
			margin-bottom: 1rem;
		}

		.role {
			font-size: 1rem;
		}

		.left-section,
		.right-section {
			padding: 4rem;
		}

		.right-section {
			min-height: 600px;
		}
	}
</style>
