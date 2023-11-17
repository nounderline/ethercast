import { SESSION_JWT_SECRET } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';
import * as jose from 'jose';

const SessionCookieKey = 'session';

export async function processAuthRequestEvent(
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) {
	const jwt = event.cookies.get(SessionCookieKey);

	if (jwt) {
		const verif = await jose
			.jwtVerify(jwt, new TextEncoder().encode(SESSION_JWT_SECRET!))
			.catch((err) => {
				if (err instanceof jose.errors.JWSSignatureVerificationFailed) {
					return null;
				}

				throw err;
			});

		const sub = verif?.payload.sub as `0x${string}`;

		if (sub) {
			event.locals.wallet = {
				address: sub
			};
		} else {
			console.debug('Invalid session token. Deleting a cookie.');

			event.cookies.delete(SessionCookieKey);
		}
	}
}
