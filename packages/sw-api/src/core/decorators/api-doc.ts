import { waterfall } from '@shared/lib/utils/fp/combine';
import { HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const AuthorizedApiOperation = (metadata: {
	title: string;
	description?: string;
	operationId?: string;
	deprecated?: boolean;
}) =>
	waterfall(
		ApiOperation(metadata),
		ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User not authorized' })
	);
