import { User } from '@schema/user/models/user.entity';

export const userProviders = [
	{
		provide: 'USER_REPOSITORY',
		useValue: User,
	},
];
