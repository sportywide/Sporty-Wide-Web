import { Inject, Service } from 'typedi';
import { ApiService } from '@web/shared/lib/http/api.service';
import { map } from 'rxjs/operators';

@Service({ global: true })
export class UtilService {
	constructor(
		@Inject(type => ApiService)
		private readonly apiService: ApiService
	) {}

	validateUnique({ field, table, value }) {
		return this.apiService
			.api()
			.get(`/util/unique/${table}/${field}?value=${value}`)
			.pipe(map(({ data }) => data));
	}
}
