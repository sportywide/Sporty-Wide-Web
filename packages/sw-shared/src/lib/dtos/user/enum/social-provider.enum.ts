import { registerEnumType } from '@shared/lib/utils/api/graphql';

export enum SocialProvider {
	FACEBOOK = 'FACEBOOK',
	GOOGLE = 'GOOGLE',
}

registerEnumType(SocialProvider, {
	name: 'SocialProvider',
});
