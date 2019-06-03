const path = require('path');

const paths = {
	get web() {
		return {
			root: path.resolve(paths.project.root, 'sw-web'),
			get src() {
				return path.resolve(this.root, 'src');
			},
			get nodeModules() {
				return path.resolve(this.root, 'node_modules');
			},
			get bin() {
				return path.resolve(this.root, 'node_modules', '.bin');
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
			get nodeModules() {
				return path.resolve(this.root, 'node_modules');
			},
			get bin() {
				return path.resolve(this.root, 'node_modules', '.bin');
			},
		};
	},
	get schema() {
		return {
			root: path.resolve(paths.project.root, 'packages', 'sw-schema'),
			get src() {
				return path.resolve(this.root, 'src');
			},
			get nodeModules() {
				return path.resolve(this.root, 'node_modules');
			},
			get bin() {
				return path.resolve(this.root, 'node_modules', '.bin');
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
			get nodeModules() {
				return path.resolve(this.root, 'node_modules');
			},
			get bin() {
				return path.resolve(this.root, 'node_modules', '.bin');
			},
		};
	},
	get project() {
		return {
			root: path.resolve(__dirname, '..', '..', '..', '..'),
			get nodeModules() {
				return path.resolve(this.root, 'node_modules');
			},
			get bin() {
				return path.resolve(this.root, 'node_modules', '.bin');
			},
		};
	},
};
module.exports = paths;
