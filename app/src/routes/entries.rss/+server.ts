import { PUBLIC_BASE_GOERLI_ALCHEMY_API_KEY, PUBLIC_POSTER_CONTRACT } from '$env/static/public';
import { EthercastPosterABI } from '$lib/ethercast.js';
import { Feed } from 'feed';
import { createPublicClient, http } from 'viem';
import { baseGoerli } from 'viem/chains';

function getContractEvents() {
	const client = createPublicClient({
		chain: baseGoerli,
		transport: http(`https://base-goerli.g.alchemy.com/v2/${PUBLIC_BASE_GOERLI_ALCHEMY_API_KEY}`)
	});

	return client
		.getContractEvents({
			address: PUBLIC_POSTER_CONTRACT,
			abi: EthercastPosterABI,
			fromBlock: '0xBF2FD7',
			event: 'NewPost'
		})
		.then((r) => {
			return r.map((event) => {
				return {
					address: event.args.user,
					content: event.args.content,
					blockNumber: event.blockNumber
				};
			});
		});
}

export async function GET(event) {
	const entriesUrl = new URL('entries', event.request.url).toString();
	const feed = new Feed({
		title: 'Ethercast',
		id: event.request.url,
		link: event.request.url,
		description: 'Recent casts from the ether',
		language: 'en',
		copyright: 'Public'
	});

	const events = await getContractEvents();

	events.reverse();

	const originDate = new Date('2023-11-18 00:00:00');
	const originBlock = 12560000n;

	events.forEach((event) => {
		feed.addItem({
			guid: `${event.address}@${event.blockNumber}`,
			title: event.content,
			author: [{ name: event.address, email: event.address }],
			link: '#',
			date: new Date(originDate.getTime() + Number(originBlock + (event.blockNumber || 0)) * 1000)
		});
	});

	return new Response(feed.rss2(), {
		headers: {
			'content-type': 'application/rss+xml; charset=UTF-8'
		}
	});
}
