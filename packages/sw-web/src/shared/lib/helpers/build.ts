declare const module: any;

export function isHotReload() {
	if (!module.hot) {
		return false;
	}

	return module.hot.status() !== 'idle';
}
