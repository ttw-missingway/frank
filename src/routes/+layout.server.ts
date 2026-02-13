import { createClient } from '$lib/prismicio';

// Disable prerender so Prismic content is fetched on each request (SSR).
// With prerender='auto', pages were built once at deploy time and never updated.
export const prerender = false;

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
