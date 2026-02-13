<script lang="ts">
	import Button from './Button.svelte';
	import FullscreenNav from './FullscreenNav.svelte';
	import Logo from './Logo.svelte';
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
	class="w-full fixed top-0 left-0 right-0 z-50"
>
	<div class="flex justify-between items-center py-6 md:py-8 lg:py-10 container">
		<!-- Logo -->
		<Logo logo={settings?.data?.logo} />

		<!-- Hamburger menu button -->
		<Button
			on:click={openNav}
			class="hover:opacity-80 transition-opacity focus:outline-none p-2 cursor-pointer"
			aria-label="Open menu"
			type="button"
			hoverEffect={false}
		>
			<img src="/icons/Nav.svg" alt="Menu" class="w-6 h-6 md:w-7 md:h-7" />
		</Button>
	</div>
</header>

<FullscreenNav isOpen={isNavOpen} {settings} onClose={closeNav} />