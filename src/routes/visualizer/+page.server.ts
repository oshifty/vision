import type { PageServerLoad } from './$types';
import makeFetchCookie from 'fetch-cookie';

async function fetchGLTFAsBase64(id: number) {
	const loginURL = 'https://gdtf-share.com/apis/login.php';
	const fixtureURL = `https://gdtf-share.com/apis/downloadFile.php?id=${id}`;

	const fetchCookie = makeFetchCookie(
		fetch,
		new makeFetchCookie.toughCookie.CookieJar(undefined, {
			allowSpecialUseDomain: true
		})
	);

	await fetchCookie(loginURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body: new URLSearchParams({
			username: 'bvz0bnurg82v',
			password: '8?%7GEp@j=KjgB4a'
		})
	});

	const requestGLTF = fetchCookie(fixtureURL).then(async (response) => {
		return {
			contentType: response.headers.get('Content-Type') || '',
			arrayBuffer: await response.arrayBuffer()
		};
	});

	return {
		contentType: (await requestGLTF).contentType,
		base64: Buffer.from((await requestGLTF).arrayBuffer).toString('base64')
	};
}

export const load = (async () => {
	const RobeMegaPointe = fetchGLTFAsBase64(41425);

	return {
		streamed: {
			base64: (await RobeMegaPointe).base64,
			contentType: (await RobeMegaPointe).contentType
		}
	};
}) satisfies PageServerLoad;
