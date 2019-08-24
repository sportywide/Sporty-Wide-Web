import { isBrowser } from '@web/shared/lib/environment';

export function decodeBase64(encodedString) {
	if (isBrowser()) {
		return window.atob(encodedString);
	} else {
		return Buffer.from(encodedString, 'base64').toString('utf8');
	}
}

export function encodeBase64(string) {
	if (isBrowser()) {
		return window.atob(string);
	} else {
		return Buffer.from(string, 'utf8').toString('base64');
	}
}
