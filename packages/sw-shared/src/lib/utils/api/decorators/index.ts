import { noop } from '@shared/lib/utils/functions';

export function ApiModelProperty(...args) {
	const { ApiModelProperty: SwaggerApiModelProperty } = require('@nestjs/swagger');

	if (!SwaggerApiModelProperty) {
		return noop;
	}

	return SwaggerApiModelProperty(...args);
}
