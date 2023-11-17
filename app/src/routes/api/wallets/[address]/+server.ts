import { json } from '@sveltejs/kit';
import { checkFolkloreNFTMembership } from '$lib/folklore.server.js';

export async function GET(event) {
	const { address } = event.params;
	const isCurator = await checkFolkloreNFTMembership(address as any);

	return json({
		is_curator: isCurator
	});
}
