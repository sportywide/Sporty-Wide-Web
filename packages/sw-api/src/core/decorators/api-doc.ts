import { waterfall } from '@shared/lib/utils/fp/combine';
import { ApiNotFoundResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ucfirst } from '@shared/lib/utils/string/conversion';

interface IOperationMetadata {
	title: string;
	description?: string;
	operationId?: string;
	deprecated?: boolean;
}

export const AuthorizedApiOperation = (metadata: IOperationMetadata) =>
	waterfall(ApiOperation(metadata), ApiUnauthorizedResponse({ description: 'User not authorized' }));

export const NotFoundResponse = (type: string) =>
	ApiNotFoundResponse({ description: `${ucfirst(type)} cannot be found` });
