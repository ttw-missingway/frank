<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { PrismicRichText, PrismicLink, type SliceComponentProps } from '@prismicio/svelte';
	import Button from '$lib/components/Button.svelte';

	type Props = SliceComponentProps<Content.CheckoutSlice>;

	const { slice }: Props = $props();

	// Parse date text to extract the date portion (e.g., "2 weeks from today is Jan 11" -> "2 weeks", "from today is", "Jan 11")
	function parseDateText(text: string | null | undefined) {
		if (!text) return { weeks: '', prefix: '', date: '' };
		
		// Try to match patterns like "2 weeks from today is Jan 11"
		const match = text.match(/^(\d+\s+weeks?)\s+(from today is)\s+(.+)$/i);
		if (match) {
			return {
				weeks: match[1],
				prefix: match[2],
				date: match[3]
			};
		}
		
		// Fallback: try to find a date-like pattern at the end
		const dateMatch = text.match(/(.+?)\s+([A-Z][a-z]{2}\s+\d{1,2}|[A-Z][a-z]+\s+\d{1,2})$/);
		if (dateMatch) {
			return {
				weeks: dateMatch[1].trim(),
				prefix: '',
				date: dateMatch[2]
			};
		}
		
		// If no pattern matches, return the whole text as weeks
		return {
			weeks: text,
			prefix: '',
			date: ''
		};
	}

	const dateParts = $derived(parseDateText(slice.primary.left_card_date_text));

	// Split right card bullet points into two columns
	function splitBulletPoints(bulletPoints: any[]) {
		if (!bulletPoints || bulletPoints.length === 0) return [[], []];
		const midpoint = Math.ceil(bulletPoints.length / 2);
		return [
			bulletPoints.slice(0, midpoint),
			bulletPoints.slice(midpoint)
		];
	}

	const rightBulletColumns = $derived(splitBulletPoints(slice.primary.right_card_bullet_points || []));
</script>

<section 
	data-slice-type={slice.slice_type} 
	data-slice-variation={slice.variation}
	class="bg-black text-[#FFFFE6] py-12 md:py-20 px-6 md:px-8"
>
	<div class="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
		<!-- Left Card -->
		<div class="bg-gray-200 text-black p-6 md:p-8 rounded-lg" style="background-color: #e5e5e5;">
			<!-- Date Section -->
			{#if slice.primary.left_card_date_text}
				<div class="mb-6">
					<div class="text-4xl md:text-5xl font-bold mb-1">
						{dateParts.weeks}
					</div>
					{#if dateParts.prefix}
						<div class="text-sm md:text-base mb-2">
							{dateParts.prefix}
						</div>
					{/if}
					{#if dateParts.date}
						<div class="text-4xl md:text-5xl font-bold underline">
							{dateParts.date}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Subtext -->
			{#if slice.primary.subtext}
				<p class="text-sm md:text-base italic text-black/80 mb-6">
					{slice.primary.subtext}
				</p>
			{/if}

			<!-- Bullet Points -->
			{#if slice.primary.left_card_bullet_points && slice.primary.left_card_bullet_points.length > 0}
				<ul class="space-y-3 text-sm md:text-base">
					{#each slice.primary.left_card_bullet_points as item}
						<li class="flex items-start gap-2">
							<span class="mt-1">•</span>
							<div class="flex-1">
								<PrismicRichText field={item.bullet_point} />
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Right Card -->
		<div class="text-black p-6 md:p-8 rounded-lg flex flex-col" style="background-color: #d4d0c8;">
			<!-- Title -->
			{#if slice.primary.right_card_title}
				<h2 class="text-3xl md:text-4xl font-bold mb-6">
					{slice.primary.right_card_title}
				</h2>
			{/if}

			<!-- Bullet Points - Two Columns -->
			{#if slice.primary.right_card_bullet_points && slice.primary.right_card_bullet_points.length > 0}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 flex-1">
					<div class="flex flex-col gap-3">
						{#each rightBulletColumns[0] as item}
							<div class="flex items-start gap-2">
								<span class="mt-1">•</span>
								<div class="flex-1 text-sm md:text-base">
									<PrismicRichText field={item.bullet_point} />
								</div>
							</div>
						{/each}
					</div>
					<div class="flex flex-col gap-3">
						{#each rightBulletColumns[1] as item}
							<div class="flex items-start gap-2">
								<span class="mt-1">•</span>
								<div class="flex-1 text-sm md:text-base">
									<PrismicRichText field={item.bullet_point} />
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Action Buttons -->
			<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-auto pt-4 border-t border-black/20">
				{#if slice.primary.contract_link}
					<PrismicLink 
						field={slice.primary.contract_link}
						class="text-blue-600 hover:text-blue-700 underline text-sm md:text-base"
					>
						View the Contract
					</PrismicLink>
				{/if}
				
				{#if slice.primary.docusign_button_text}
					<Button
						type="button"
						class="bg-[#FFFFE6] border-2 border-black text-black px-6 py-2 text-sm md:text-base font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
					>
						{slice.primary.docusign_button_text}
					</Button>
				{/if}
				
				{#if slice.primary.pay_button_text}
					<Button
						type="button"
						class="bg-blue-600 text-[#FFFFE6] px-6 py-2 text-sm md:text-base font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
					>
						{slice.primary.pay_button_text}
					</Button>
				{/if}
			</div>
		</div>
	</div>
</section>
