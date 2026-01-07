<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { PrismicImage } from '@prismicio/svelte';
	import { isFilled } from '@prismicio/client';

	type Props = {
		slice: Content.HeroSlice;
		onState1Mount?: (el: HTMLElement) => void;
		onState2Mount?: (el: HTMLElement) => void;
	};

	const { slice, onState1Mount, onState2Mount }: Props = $props();
	
	let state1El: HTMLElement;
	let state2El: HTMLElement;
	
	$effect(() => {
		if (state1El && onState1Mount) onState1Mount(state1El);
		if (state2El && onState2Mount) onState2Mount(state2El);
	});
</script>

<!-- State 1: Lincoln Quote with Pills (Top Section) -->
<div bind:this={state1El} class="max-h-[80vh] absolute inset-0 flex flex-col justify-center items-center" data-state="1">
	<div class="text-center max-w-5xl px-4">
		<div class="flex flex-col items-center gap-1 md:gap-2">
			<span class="inline-flex flex-wrap items-center justify-center formal-heading hero-text-line">
				<span data-animate>Lincoln</span>
				{#if slice.primary.pills?.[0]}
					{@const pill0 = slice.primary.pills[0]}
					{@const pill0HasVideo = isFilled.linkToMedia(pill0.pill_video)}
					{@const pill0HasImage = isFilled.image(pill0.pill_image)}
					{@const pill0VideoUrl = pill0HasVideo && 'url' in pill0.pill_video ? pill0.pill_video.url : null}
					<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(6rem,20vw+3rem,12rem)] rounded-full overflow-hidden shrink-0" data-animate>
						{#if pill0HasVideo && pill0VideoUrl}
							<video
								src={pill0VideoUrl}
								class="h-full w-full object-cover"
								autoplay
								loop
								muted
								playsinline
							></video>
						{:else if pill0HasImage}
							<PrismicImage
								field={pill0.pill_image}
								class="h-full w-full object-cover"
							/>
						{/if}
					</div>
				{/if}
				<span data-animate>wrote</span>
			</span>
			<span class="inline-flex flex-wrap items-center justify-center formal-heading-italic hero-text-line">
				<span data-animate>"I</span>
				<span data-animate>would've</span>
				<span data-animate>sent</span>
				<span class="hero-word-group" data-animate>a shorter</span>
				<span data-animate>letter</span>
			</span>
			<span class="inline-flex flex-wrap items-center justify-center formal-heading-italic hero-text-line">
				<span class="hero-word-group" data-animate>if I</span>
				<span data-animate>had</span>
				{#if slice.primary.pills?.[1]}
					{@const pill1 = slice.primary.pills[1]}
					{@const pill1HasVideo = isFilled.linkToMedia(pill1.pill_video)}
					{@const pill1HasImage = isFilled.image(pill1.pill_image)}
					{@const pill1VideoUrl = pill1HasVideo && 'url' in pill1.pill_video ? pill1.pill_video.url : null}
					<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(4rem,15vw+2rem,9.25rem)] rounded-full overflow-hidden shrink-0" data-animate>
						{#if pill1HasVideo && pill1VideoUrl}
							<video
								src={pill1VideoUrl}
								class="h-full w-full object-cover"
								autoplay
								loop
								muted
								playsinline
							></video>
						{:else if pill1HasImage}
							<PrismicImage
								field={pill1.pill_image}
								class="h-full w-full object-cover"
							/>
						{/if}
					</div>
				{/if}
				<span data-animate>more</span>
				<span data-animate>time"</span>
			</span>
		</div>
	</div>
</div>
<!-- State 2: Startup Founders with Pills (Bottom Section) -->
<div bind:this={state2El} class="max-h-[80vh] absolute inset-0 flex flex-col justify-center items-center" data-state="2">
	<div class="text-center max-w-5xl px-4">
		<div class="flex flex-col items-center gap-1 md:gap-2">
			<span class="inline-flex flex-wrap items-center justify-center formal-heading hero-text-line">
				<span data-animate>Startup</span>
				<span data-animate>Founders,</span>
				<span class="hero-word-group" data-animate>you already</span>
				<span data-animate>work</span>
				{#if slice.primary.pills?.[2]}
					{@const pill2 = slice.primary.pills[2]}
					{@const pill2HasVideo = isFilled.linkToMedia(pill2.pill_video)}
					{@const pill2HasImage = isFilled.image(pill2.pill_image)}
					{@const pill2VideoUrl = pill2HasVideo && 'url' in pill2.pill_video ? pill2.pill_video.url : null}
					<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(4rem,15vw+2rem,9.25rem)] rounded-full overflow-hidden shrink-0" data-animate>
						{#if pill2HasVideo && pill2VideoUrl}
							<video
								src={pill2VideoUrl}
								class="h-full w-full object-cover"
								autoplay
								loop
								muted
								playsinline
							></video>
						{:else if pill2HasImage}
							<PrismicImage
								field={pill2.pill_image}
								class="h-full w-full object-cover"
							/>
						{/if}
					</div>
				{/if}
				<span class="formal-heading-italic" data-animate>60+</span>
				<span class="formal-heading-italic" data-animate>hours</span>
			</span>
			<span class="inline-flex flex-wrap items-center justify-center formal-heading hero-text-line">
				{#if slice.primary.pills?.[3]}
					{@const pill3 = slice.primary.pills[3]}
					{@const pill3HasVideo = isFilled.linkToMedia(pill3.pill_video)}
					{@const pill3HasImage = isFilled.image(pill3.pill_image)}
					{@const pill3VideoUrl = pill3HasVideo && 'url' in pill3.pill_video ? pill3.pill_video.url : null}
					<div class="h-[clamp(3rem,8vw+1rem,4.5rem)] w-[clamp(4rem,15vw+2rem,9.25rem)] rounded-full overflow-hidden shrink-0" data-animate>
						{#if pill3HasVideo && pill3VideoUrl}
							<video
								src={pill3VideoUrl}
								class="h-full w-full object-cover"
								autoplay
								loop
								muted
								playsinline
							></video>
						{:else if pill3HasImage}
							<PrismicImage
								field={pill3.pill_image}
								class="h-full w-full object-cover"
							/>
						{/if}
					</div>
				{/if}
				<span data-animate>per</span>
				<span data-animate>week...</span>
			</span>
		</div>
	</div>
</div>

