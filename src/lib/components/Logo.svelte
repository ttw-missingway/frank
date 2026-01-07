<script lang="ts">
	interface Props {
		href?: string;
		onClick?: () => void;
		class?: string;
	}

	const { href = '/', onClick, class: className = '' }: Props = $props();
</script>

<a
	{href}
	onclick={onClick}
	class="flex items-center hover:opacity-80 transition-opacity {className}"
	aria-label="Go to homepage"
>
	<img
		src="/icons/Frank.svg"
		alt="FRANK"
		class="w-auto h-6 md:h-7 object-contain"
	/>
</a>

