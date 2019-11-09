import './test-setup';
// here we set up a fake localStorage because jsdom doesn't support it
// https://github.com/tmpvar/jsdom/issues/1137
if (!window.localStorage) {
	// @ts-ignore
	window.localStorage = {};
	Object.assign(window.localStorage, {
		removeItem: function removeItem(key) {
			delete window.localStorage[key];
		}.bind(window.localStorage),
		setItem: function setItem(key, val) {
			window.localStorage[key] = String(val);
		}.bind(window.localStorage),
		getItem: function getItem(key) {
			return window.localStorage[key];
		}.bind(window.localStorage),
	});
}
