import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user && locals.session) {
		return redirect(302, '/');
	}
}
