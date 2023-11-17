import { redirect } from '@sveltejs/kit';

// it so that it gets served as a static asset in production
export const prerender = true;

export function load() {
	throw redirect(302, '/submit');
}
