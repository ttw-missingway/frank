<script lang="ts">
	import type { ImageField } from '@prismicio/client';
	import { PrismicImage } from '@prismicio/svelte';

	interface Props {
		href?: string;
		onClick?: () => void;
		class?: string;
		/** Logo image from Prismic settings. Falls back to static SVG when empty. */
		logo?: ImageField | null;
	}

	const { href = '/', onClick, class: className = '', logo = null }: Props = $props();
</script>

<a
	{href}
	onclick={onClick}
	class="flex items-center hover:opacity-80 transition-opacity {className}"
	aria-label="Go to homepage"
>
	{#if logo?.url}
		<PrismicImage
			field={logo}
			class="w-auto h-10 md:h-15 object-contain"
		/>
	{:else}
		<img
			src="/icons/Frank.svg"
			alt="FRANK"
			class="w-auto h-6 md:h-7 object-contain"
		/>
	{/if}
</a>

