<script>
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/state';
	import { repositoryName } from '$lib/prismicio';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';

	let { children, data } = $props();

</script>

<svelte:head>
	<title>{page.data.title}</title>
	<script async defer src="https://static.cdn.prismic.io/prismic.js?new=true&repo=frank"></script>
	{#if page.data.meta_description}
		<meta name="description" content={page.data.meta_description} />
	{/if}
	{#if page.data.meta_title}
		<meta name="og:title" content={page.data.meta_title} />
	{/if}
	{#if page.data.meta_image}
		<meta name="og:image" content={page.data.meta_image} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>

<PageTransition />
<main class="bg-black text-[#FFFFE6] relative">
	<Header settings={data.settings} />
	{@render children()}
	<Footer settings={data.settings} />
</main>
<PrismicPreview {repositoryName} />
