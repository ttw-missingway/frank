<script lang="ts">
	import type { RTLabelNode } from '@prismicio/client';
	import type { Snippet } from 'svelte';

	type Props = {
		node: RTLabelNode;
		children: Snippet;
	};

	let { node, children }: Props = $props();
</script>

{#if node.data.label === 'codespan'}
	<code>{@render children()}</code>
{:else if node.data.label === 'green'}
	<span class="label-green">{@render children()}</span>
{:else if node.data.label === 'lime'}
	<span class="label-lime">{@render children()}</span>
{:else}
	<span class={node.data.label}>{@render children()}</span>
{/if}

<style>
	.label-green {
		color: #8bd475;
	}
	.label-lime {
		color: #cff602;
	}
</style>
