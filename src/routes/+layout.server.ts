import { createClient } from '$lib/prismicio';

export const prerender = 'auto';

export async function load({ fetch, cookies }) {
	const client = createClient({ fetch, cookies });

	let settings = null;
	try {
		settings = await client.getSingle('settings');
	} catch (error) {
		// Settings document doesn't exist or isn't published yet
		// This is okay - the navigation will just show no links
		console.warn('Settings document not found:', error);
	}

	return {
		settings
	};
}
