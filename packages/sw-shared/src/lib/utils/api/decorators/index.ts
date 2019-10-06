import { wrapDecorator } from '@shared/lib/utils/functions';
import * as swagger from '@nestjs/swagger';

export const ApiModelProperty = wrapDecorator(swagger.ApiModelProperty);
