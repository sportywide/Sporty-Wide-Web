import { md5 } from '@shared/lib/utils/crypto';

export function gravatar(email) {
	return `https://www.gravatar.com/avatar/${md5(email)}?d=identicon`;
}

export function teamFifaImage(image) {
	return `https://sw-asset-bucket.s3-ap-southeast-2.amazonaws.com/teams${image}`;
}

export function playerFifaImage(image) {
	return `https://sw-asset-bucket.s3-ap-southeast-2.amazonaws.com/players${image}`;
}

export function fifaFlag(id) {
	return `https://sw-asset-bucket.s3-ap-southeast-2.amazonaws.com/nationality/static/FIFA20/images/flags/2/${id}.png`;
}
