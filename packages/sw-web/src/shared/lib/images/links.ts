import { md5 } from '@shared/lib/utils/crypto';

export function gravatar(email) {
	return `https://www.gravatar.com/avatar/${md5(email)}?d=identicon`;
}

export function fifaImage(image) {
	return `https://www.fifaindex.com${image}`;
}
