export class Debounce {
	private readonly msSeconds: number;
	private timeout: any;
	constructor(msSeconds) {
		this.msSeconds = msSeconds;
		this.timeout = null;
	}

	run(func) {
		this.cancel();
		this.timeout = setTimeout(func, this.msSeconds);
	}

	cancel() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	get isRunning() {
		return !!this.timeout;
	}
}
