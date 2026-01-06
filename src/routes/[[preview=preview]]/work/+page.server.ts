import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies }) {
	const client = createClient({ fetch, cookies });

	const works = await client.getAllByType('work', {
		orderings: [
			{
				field: 'document.first_publication_date',
				direction: 'desc'
			}
		]
	});

	return {
		works
	};
}

