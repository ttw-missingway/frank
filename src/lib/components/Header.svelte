<script lang="ts">
	import FullscreenNav from './FullscreenNav.svelte';
	import type { SettingsDocument } from '../../prismicio-types';

	interface Props {
		settings?: SettingsDocument | null;
	}

	const { settings = null }: Props = $props();

	let isNavOpen = $state(false);

	function openNav() {
		isNavOpen = true;
	}

	function closeNav() {
		isNavOpen = false;
	}
</script>

<header
	class="w-full flex justify-between items-center p-6 md:p-8 lg:p-10 fixed top-0 left-0 right-0 z-50 container"
>
	<!-- Logo placeholder -->
	<a href="/" class="flex items-center">
		<img src="/icons/Frank.svg" alt="Logo" class="w-full h-full object-cover" />
	</a>

	<!-- Hamburger menu button -->
	<button
		onclick={openNav}
		class="text-white hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded p-2"
		aria-label="Open menu"
		type="button"
	>
		<img src="/icons/Nav.svg" alt="Menu" class="w-6 h-6 md:w-7 md:h-7" />
	</button>
</header>

<FullscreenNav isOpen={isNavOpen} {settings} onClose={closeNav} />