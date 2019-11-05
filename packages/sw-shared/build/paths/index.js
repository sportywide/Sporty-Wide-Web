const path = require('path');
const findUp = require('find-up');

const paths = {
	get web() {
		return {
			root: path.resolve(paths.project.root, 'packages', 'sw-web'),
			get src() {
				return path.resolve(this.root, 'src');
			},
			get dist() {
				return path.resolve(this.root, 'dist');
			},
			get clientPolyfill() {
				return path.resolve(this.root, 'src', 'client-polyfill.js');
			},
			get serverPolyfill() {
				return path.resolve(this.root, 'src', 'server-polyfill.js');
			},
		};
	},
	get shared() {
		return {
			root: path.resolve(paths.project.root, 'packages', 'sw-shared'),
			get build() {
				return path.resolve(this.root, 'build');
			},
			get webpack() {
				return path.resolve(this.root, 'build', 'webpack');
			},
			get src() {
				return path.resolve(this.root, 'src');
			},
		};
	},
	get schema() {
		return {
			root: path.resolve(paths.project.root, 'packages', 'sw-schema'),
			get src() {
				return path.resolve(this.root, 'src');
			},
		};
	},
	get core() {
		return {
			root: path.resolve(paths.project.root, 'packages', 'sw-core'),
			get src() {
				return path.resolve(this.root, 'src');
			},
		};
	},
	get data() {
		return {
			root: path.resolve(paths.project.root, 'packages', 'sw-data'),
			get src() {
				return path.resolve(this.root, 'src');
			},
			get scripts() {
				return path.resolve(this.root, 'src', 'scripts');
			},
			get dist() {
				return path.resolve(this.root, 'dist');
			},
		};
	},
	get api() {
		return {
			root: path.resolve(paths.project.root, 'packages', 'sw-api'),
			get src() {
				return path.resolve(this.root, 'src');
			},
			get dist() {
				return path.resolve(this.root, 'dist');
			},
		};
	},
	get email() {
		return {
			root: path.resolve(paths.project.root, 'packages', 'sw-email'),
			get src() {
				return path.resolve(this.root, 'src');
			},
			get dist() {
				return path.resolve(this.root, 'dist');
			},
			get styles() {
				return path.resolve(this.root, 'src', 'styles');
			},
		};
	},
	get scheduling() {
		return {
			root: path.resolve(paths.project.root, 'packages', 'sw-scheduling'),
			get src() {
				return path.resolve(this.root, 'src');
			},
			get dist() {
				return path.resolve(this.root, 'dist');
			},
		};
	},
	get project() {
		return {
			root: path.dirname(findUp.sync('package-lock.json')),
		};
	},
};
module.exports = paths;
