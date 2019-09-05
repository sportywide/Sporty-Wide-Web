import { isBrowser } from '@web/shared/lib/environment';

export function decodeBase64(encodedString) {
	if (isBrowser()) {
		return decodeURIComponent(
			window
				.atob(encodedString)
				.split('')
				.map(function(c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);
	} else {
		return Buffer.from(encodedString, 'base64').toString('utf8');
	}
}

export function encodeBase64(string) {
	if (isBrowser()) {
		return btoa(
			encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
				return String.fromCharCode(Number('0x' + p1));
			})
		);
	} else {
		return Buffer.from(string, 'utf8').toString('base64');
	}
}
