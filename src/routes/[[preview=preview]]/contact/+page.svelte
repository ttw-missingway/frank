<script lang="ts">
	import ContactForm from '$lib/components/ContactForm.svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	$: formResult = $page.form;
	$: isSuccess = formResult?.success === true;
</script>

<svelte:head>
	<title>Contact Us</title>
</svelte:head>

<div class="contact-page">
	<h1>Contact Us</h1>
	<p>Send us a message and we'll get back to you as soon as possible.</p>

	{#if isSuccess}
		<div class="success-message">
			<p>✓ Thank you for your message! We'll get back to you soon.</p>
		</div>
	{/if}

	<ContactForm form={formResult?.form || null} />
</div>

<style>
	.contact-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	.contact-page > p {
		margin-bottom: 2rem;
		color: #666;
	}

	.success-message {
		margin-bottom: 2rem;
		padding: 1rem;
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
		border-radius: 4px;
	}

	.success-message p {
		margin: 0;
	}
</style>


