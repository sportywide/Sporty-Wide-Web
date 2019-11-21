let sigCallback;

export function sigstop(callback) {
	if (!sigCallback) {
		registerClosingSignals();
	}

	sigCallback = callback;

	function registerClosingSignals() {
		const signals = [
			'SIGABRT',
			'SIGALRM',
			'SIGBUS',
			'SIGFPE',
			'SIGHUP',
			'SIGILL',
			'SIGINT',
			'SIGQUIT',
			'SIGSEGV',
			'SIGTERM',
			'SIGUSR1',
			'SIGUSR2',
			'SIGSYS',
			'SIGTRAP',
			'SIGVTALRM',
			'SIGXFSZ',
		];

		signals.forEach(signal => {
			process.on(signal as any, () => {
				if (sigCallback) {
					sigCallback(signal);
				}
			});
		});
	}
}
