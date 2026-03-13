import { redirect } from '@sveltejs/kit';

const PRISMIC_PREVIEW_COOKIE = 'io.prismic.preview';

export async function GET({ url, cookies }) {
	// Clear the Prismic preview cookie so draft content is no longer shown
	cookies.delete(PRISMIC_PREVIEW_COOKIE, { path: '/' });

	// Redirect to returnTo if it's a relative path (avoid open redirect), otherwise home
	const returnTo = url.searchParams.get('returnTo') ?? '/';
	const safePath = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/';
	return redirect(302, safePath);
}
