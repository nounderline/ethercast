import { Feed } from 'feed';

export async function GET(event) {
	const entriesUrl = new URL('entries', event.request.url).toString();
	const feed = new Feed({
		title: 'Folklore',
		id: event.request.url,
		link: event.request.url,
		description: 'Recent entries from Folklore',
		language: 'en',
		copyright: 'All rights reserved'
	});

	const entries = [];

	entries.forEach((entry) => {
		feed.addItem({
			guid: `${entriesUrl}#${entry.id}`,
			title: entry.description || entry.id!,
			author: [{ name: entry.contributor, email: entry.contributor }],
			link: entry.url,
			date: new Date(entry.created_at)
		});
	});

	return new Response(feed.rss2(), {
		headers: {
			'content-type': 'application/rss+xml; charset=UTF-8'
		}
	});
}
