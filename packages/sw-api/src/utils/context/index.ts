import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { safeGet } from '@shared/lib/utils/object/get';
import { GqlExecutionContext } from '@nestjs/graphql';

export function isGraphql(context: ArgumentsHost) {
	const arg = context.getArgByIndex(2);
	return safeGet(() => arg._extensionStack.constructor.name) === 'GraphQLExtensionStack';
}

export function getRequest(context: ArgumentsHost) {
	if (isGraphql(context)) {
		const ctx = GqlExecutionContext.create(context as ExecutionContext);
		return ctx.getContext().req;
	} else {
		return context.switchToHttp().getRequest();
	}
}

export function getResponse(context: ArgumentsHost) {
	if (isGraphql(context)) {
		const ctx = GqlExecutionContext.create(context as ExecutionContext);
		return ctx.getContext().res;
	} else {
		return context.switchToHttp().getResponse();
	}
}
