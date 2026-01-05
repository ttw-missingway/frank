import { asText } from '@prismicio/client';

import { createClient } from '$lib/prismicio';

export async function load({ params, fetch, cookies }) {
	const client = createClient({ fetch, cookies });

	const work = await client.getByUID('work', params.uid);

	return {
		work,
		title: work.data.title || work.data.client_name,
		meta_description: work.data.description,
		meta_title: work.data.title || work.data.client_name,
		meta_image: work.data.featured_image?.url
	};
}

export async function entries() {
	const client = createClient();

	const works = await client.getAllByType('work');

	return works.map((work) => {
		return { uid: work.uid };
	});
}

