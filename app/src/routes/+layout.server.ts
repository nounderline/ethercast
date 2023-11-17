import { env } from '$env/dynamic/private';

const buildHash = env.VERCEL_GIT_COMMIT_SHA || '13376969';

export async function load(event) {
	return {
		wallet: event.locals.wallet,
		build: {
			hash: buildHash
		}
	};
}
