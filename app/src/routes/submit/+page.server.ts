import { createPublicClient, http, verifyMessage } from 'viem';
import { mainnet } from '@wagmi/core';
import { error } from '@sveltejs/kit';

export const actions = {
	default: async (event) => {
		const payload = await event.request.formData();

		const sigSignature = payload.get('sig_signature')!.toString() as any;
		const sigMessage = payload.get('sig_message')!.toString() as any;
		const sigAddress = payload.get('sig_address')!.toString() as any;

		const url = payload.get('url')!.toString();
		const description = payload.get('description')?.toString().trim();

		const ok = await verifyMessage({
			signature: sigSignature,
			address: sigAddress,
			message: sigMessage
		});

		const client = createPublicClient({
			chain: mainnet,
			transport: http()
		});
		const okOwnership = true;

		if (!okOwnership) {
			throw error(401, {
				message: 'Signer is not a curator'
			});
		}

		// create an entry

		return {
			success: true
		};
	}
};
