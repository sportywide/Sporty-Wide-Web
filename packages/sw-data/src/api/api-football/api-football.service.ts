import https from 'https';
import { Provider } from 'nconf';
import { DATA_CONFIG } from '@core/config/config.constants';
import axios, { AxiosInstance } from 'axios';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class ApiFootballService {
	private _v2Instances: AxiosInstance[];
	private apiKeyCounter = 0;
	private apiKeys: string[];

	constructor(@Inject(DATA_CONFIG) private readonly dataConfig: Provider) {
		this.apiKeys = dataConfig.get('rapidapi:api_key');
		this._v2Instances = this.apiKeys.map(key =>
			axios.create({
				baseURL: 'https://api-football-v1.p.rapidapi.com/v2',
				headers: {
					'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
					'x-rapidapi-key': key,
				},
				httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			})
		);
	}
	v2() {
		return this._v2Instances[this.apiKeyCounter++ % this.apiKeys.length];
	}
}
