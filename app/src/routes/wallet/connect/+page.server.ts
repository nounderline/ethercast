import { verifyMessage } from 'viem';
import * as jose from 'jose';
import { redirect } from '@sveltejs/kit';
import { SESSION_JWT_SECRET } from '$env/static/private';

export const actions = {
	default: async (event) => {
		const payload = await event.request.formData();
		const sigSignature = payload.get('signature')!.toString() as any;
		const sigMessage = payload.get('message')!.toString().replaceAll('\r', '') as any;
		const sigAddress = payload.get('address')!.toString() as any;

		const valid = await verifyMessage({
			signature: sigSignature,
			address: sigAddress,
			message: sigMessage
		});

		if (!valid) {
			throw new Error('Invalid verification signature');
		}

		const jwt = await new jose.SignJWT({})
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('1w')
			.setSubject(sigAddress)
			.sign(new TextEncoder().encode(SESSION_JWT_SECRET!));

		event.cookies.set('session', jwt, { path: '/' });

		redirect(303, '/');
	}
};
