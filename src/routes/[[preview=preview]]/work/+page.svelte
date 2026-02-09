<script lang="ts">
	import type { PageProps } from './$types';
	import WorkGallery from '$lib/components/WorkGallery.svelte';

	const { data }: PageProps = $props();
</script>

<div class="container px-6 md:px-12 py-12 md:py-16 mt-[224px]">
	<h1 class="text-white text-4xl md:text-5xl lg:text-6xl font-normal mb-12">
		Work
	</h1>

	<WorkGallery works={data.works} />
</div>
