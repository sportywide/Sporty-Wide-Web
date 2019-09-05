const path = require('path');

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
	get project() {
		return {
			root: path.resolve(__dirname, '..', '..', '..', '..'),
		};
	},
};
module.exports = paths;
