import { redirect } from '@sveltejs/kit';

export function POST(event) {
	event.cookies.delete('session');

	throw redirect(303, '/');
}
