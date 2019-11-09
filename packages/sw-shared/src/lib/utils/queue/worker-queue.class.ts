import '@shared/lib/shim/promise.ts';
const SLEEP_TIME = 500;
const pThrottle = require('p-throttle');

export type WorkerOptions = {
	maximumWorkers?: number;
	worker: Function;
	logger?: any;
};

export class WorkerQueue {
	private availableWorkers: any[];
	private readonly workerCreator: Function;
	private readonly maximumWorkers: number;
	private workerCount: number;
	private readonly logger?: any;

	constructor({ maximumWorkers = 10, worker, logger }: WorkerOptions) {
		this.availableWorkers = [];
		this.workerCreator = worker;
		this.maximumWorkers = maximumWorkers;
		this.workerCount = 0;
		this.logger = logger;
	}

	async init(initialWorkers) {
		this.availableWorkers = await Promise.all(Array.from({ length: initialWorkers }).map(() => this.addWorker()));
	}

	submit(jobFunc: Function, jobData: any[], { limiter, interval }: { limiter?: number; interval?: number } = {}) {
		const numJobs = jobData.length;
		let alreadyProcessed = 0;
		let processFunction = jobFunc;
		if (limiter && interval) {
			processFunction = pThrottle(jobFunc as any, limiter, interval);
		}

		return new Promise(resolve => {
			const checkFinished = () => {
				return alreadyProcessed >= numJobs;
			};
			const poll = async () => {
				const isFinished = checkFinished();
				if (isFinished) {
					resolve();
					return;
				}

				if (!jobData.length) {
					return;
				}

				await this.maybeCreateWorker();
				if (this.hasAvailableWorker()) {
					const progress = this.processJob({ data: jobData.shift(), process: processFunction });

					progress.finally(() => {
						alreadyProcessed++;
						this.log('debug', `Finished ${alreadyProcessed}/${numJobs}`);
						poll();
					});

					if (jobData.length) {
						poll();
					}
				} else {
					setTimeout(poll, SLEEP_TIME);
				}
			};

			this.log('debug', `Processing ${numJobs} jobs`);
			poll();
		});
	}

	async maybeCreateWorker() {
		if (this.hasAvailableWorker() || this.workerCount >= this.maximumWorkers) {
			return;
		}
		await this.addWorker();
	}

	hasAvailableWorker() {
		return this.availableWorkers.length > 0;
	}

	private async processJob({ data, process }) {
		if (!this.hasAvailableWorker()) {
			return;
		}
		const worker = this.availableWorkers.shift();

		try {
			await process(worker, data);
		} catch (e) {
			this.log('error', 'Failed to process job', data, e);
		} finally {
			this.availableWorkers.push(worker);
		}
	}

	private async addWorker() {
		const worker = await this.workerCreator();
		this.availableWorkers.push(worker);
		this.workerCount++;
		return worker;
	}

	private log(type, ...args) {
		if (!this.logger) {
			return;
		}
		this.logger[type](...args);
	}
}
