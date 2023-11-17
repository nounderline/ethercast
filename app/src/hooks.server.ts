import { processAuthRequestEvent } from './lib/auth.server';

export async function handle({ event, resolve }) {
	processAuthRequestEvent(event);

	return resolve(event);
}
