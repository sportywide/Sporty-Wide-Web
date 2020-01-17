import { Inject } from '@nestjs/common';
import { getSwRepositoryToken } from './providers/repository.module';

export const InjectSwRepository = (entity: Function, connection = 'default') =>
	Inject(getSwRepositoryToken(entity, connection));
