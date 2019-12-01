import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { parse } from 'date-fns';
@Injectable()
export class ParseDatePipe implements PipeTransform<string> {
	async transform(value: string): Promise<Date> {
		try {
			return parse(value, 'yyyy-MM-dd', new Date());
		} catch (e) {
			throw new BadRequestException('Validation failed (date string is expected)');
		}
	}
}
