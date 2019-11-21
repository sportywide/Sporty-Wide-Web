module.exports = /******/ (function(modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/ var installedModules = {}; // The require function
	/******/
	/******/ /******/ function __webpack_require__(moduleId) {
		/******/
		/******/ // Check if module is in cache
		/******/ if (installedModules[moduleId]) {
			/******/ return installedModules[moduleId].exports;
			/******/
		} // Create a new module (and put it into the cache)
		/******/ /******/ var module = (installedModules[moduleId] = {
			/******/ i: moduleId,
			/******/ l: false,
			/******/ exports: {},
			/******/
		}); // Execute the module function
		/******/
		/******/ /******/ modules[moduleId].call(module.exports, module, module.exports, __webpack_require__); // Flag the module as loaded
		/******/
		/******/ /******/ module.l = true; // Return the exports of the module
		/******/
		/******/ /******/ return module.exports;
		/******/
	} // expose the modules object (__webpack_modules__)
	/******/
	/******/
	/******/ /******/ __webpack_require__.m = modules; // expose the module cache
	/******/
	/******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
	/******/
	/******/ /******/ __webpack_require__.d = function(exports, name, getter) {
		/******/ if (!__webpack_require__.o(exports, name)) {
			/******/ Object.defineProperty(exports, name, { enumerable: true, get: getter });
			/******/
		}
		/******/
	}; // define __esModule on exports
	/******/
	/******/ /******/ __webpack_require__.r = function(exports) {
		/******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
			/******/ Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
			/******/
		}
		/******/ Object.defineProperty(exports, '__esModule', { value: true });
		/******/
	}; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
	/******/
	/******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(value, mode) {
		/******/ if (mode & 1) value = __webpack_require__(value);
		/******/ if (mode & 8) return value;
		/******/ if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
		/******/ var ns = Object.create(null);
		/******/ __webpack_require__.r(ns);
		/******/ Object.defineProperty(ns, 'default', { enumerable: true, value: value });
		/******/ if (mode & 2 && typeof value != 'string')
			for (var key in value)
				__webpack_require__.d(
					ns,
					key,
					function(key) {
						return value[key];
					}.bind(null, key)
				);
		/******/ return ns;
		/******/
	}; // getDefaultExport function for compatibility with non-harmony modules
	/******/
	/******/ /******/ __webpack_require__.n = function(module) {
		/******/ var getter =
			module && module.__esModule
				? /******/ function getDefault() {
						return module['default'];
				  }
				: /******/ function getModuleExports() {
						return module;
				  };
		/******/ __webpack_require__.d(getter, 'a', getter);
		/******/ return getter;
		/******/
	}; // Object.prototype.hasOwnProperty.call
	/******/
	/******/ /******/ __webpack_require__.o = function(object, property) {
		return Object.prototype.hasOwnProperty.call(object, property);
	}; // __webpack_public_path__
	/******/
	/******/ /******/ __webpack_require__.p = ''; // Load entry module and return exports
	/******/
	/******/
	/******/ /******/ return __webpack_require__((__webpack_require__.s = './packages/sw-web/gulpfile.ts'));
	/******/
})(
	/************************************************************************/
	/******/ {
		/***/ './helpers/gulp.ts':
			/*!*************************!*\
  !*** ./helpers/gulp.ts ***!
  \*************************/
			/*! no static exports found */
			/***/ function(module, exports, __webpack_require__) {
				'use strict';
				eval(
					'\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.GenericWebpackTasks = void 0;\n\nvar _gulpclass = __webpack_require__(/*! gulpclass */ "gulpclass");\n\nvar _process = __webpack_require__(/*! @root/helpers/process */ "./helpers/process.ts");\n\nvar _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2;\n\nfunction _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if (\'value\' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }\n\n__webpack_require__(/*! reflect-metadata */ "reflect-metadata");\n\nlet GenericWebpackTasks = (_dec = (0, _gulpclass.Gulpclass)(), _dec2 = (0, _gulpclass.Task)(\'clean\'), _dec3 = Reflect.metadata("design:paramtypes", []), _dec4 = (0, _gulpclass.Task)(\'dev:webpack\'), _dec5 = Reflect.metadata("design:paramtypes", []), _dec6 = (0, _gulpclass.Task)(\'build:webpack\'), _dec7 = Reflect.metadata("design:paramtypes", []), _dec(_class = (_class2 = class GenericWebpackTasks {\n  clean() {\n    return (0, _process.spawn)(\'rm -rf dist\');\n  }\n\n  buildDev() {\n    return (0, _process.spawn)(\'webpack --color --env=development\');\n  }\n\n  webpackBuild() {\n    return (0, _process.spawn)(\'webpack --color --env=production\');\n  }\n\n}, (_applyDecoratedDescriptor(_class2.prototype, "clean", [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "clean"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "buildDev", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "buildDev"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "webpackBuild", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "webpackBuild"), _class2.prototype)), _class2)) || _class);\nexports.GenericWebpackTasks = GenericWebpackTasks;\n\n//# sourceURL=webpack:///./helpers/gulp.ts?'
				);

				/***/
			},

		/***/ './helpers/process.ts':
			/*!****************************!*\
  !*** ./helpers/process.ts ***!
  \****************************/
			/*! no static exports found */
			/***/ function(module, exports, __webpack_require__) {
				'use strict';
				eval(
					"\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.execSync = execSync;\nexports.exec = exec;\nexports.spawnSync = spawnSync;\nexports.spawn = spawn;\n\nvar _child_process = _interopRequireDefault(__webpack_require__(/*! child_process */ \"child_process\"));\n\nvar _path = _interopRequireDefault(__webpack_require__(/*! path */ \"path\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction execSync(command, options = {}) {\n  console.info('Executing command synchronously', command);\n  return _child_process.default.execSync(command, { ...getDefaultOptions(),\n    ...options\n  });\n}\n\nfunction exec(command, options = {}) {\n  console.info('Executing command', command);\n  return new Promise((resolve, reject) => {\n    const execOptions = { ...getDefaultOptions(),\n      ...options\n    };\n\n    _child_process.default.exec(command, execOptions, (error, stdout, stderr) => {\n      if (error) {\n        return reject(error);\n      }\n\n      resolve(stdout ? stdout : stderr);\n    });\n  });\n}\n\nfunction spawnSync(command, options = {}) {\n  const crossSpawn = __webpack_require__(/*! cross-spawn */ \"cross-spawn\");\n\n  console.info('Spawning command', command);\n  const spawnOptions = { ...getDefaultOptions(),\n    ...options\n  };\n  const child = crossSpawn.sync(command, spawnOptions);\n\n  if (child.error) {\n    throw new Error('Failed to spawn the command ' + child.error.message);\n  }\n\n  return child.stdout || child.stderr;\n}\n\nfunction spawn(command, options = {}) {\n  const crossSpawn = __webpack_require__(/*! cross-spawn */ \"cross-spawn\");\n\n  console.info('Spawning command', command);\n  return new Promise((resolve, reject) => {\n    const spawnOptions = { ...getDefaultOptions(),\n      ...options\n    };\n    const child = crossSpawn(command, spawnOptions);\n    child.on('close', function (code) {\n      resolve(code);\n    });\n    child.on('error', function (err) {\n      reject(err);\n    });\n  });\n}\n\nfunction getDefaultOptions() {\n  const findup = __webpack_require__(/*! find-up */ \"find-up\");\n\n  return {\n    stdio: 'inherit',\n    encoding: 'utf-8',\n    shell: true,\n    env: { ...(process.env || {}),\n      PATH: _path.default.resolve(findup.sync('node_modules', {\n        type: 'directory'\n      }), '.bin') + _path.default.delimiter + process.env.PATH\n    }\n  };\n}\n\n//# sourceURL=webpack:///./helpers/process.ts?"
				);

				/***/
			},

		/***/ './packages/sw-web/gulpfile.ts':
			/*!*************************************!*\
  !*** ./packages/sw-web/gulpfile.ts ***!
  \*************************************/
			/*! no static exports found */
			/***/ function(module, exports, __webpack_require__) {
				'use strict';
				eval(
					'\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.Gulpfile = void 0;\n\nvar _gulpclass = __webpack_require__(/*! gulpclass */ "gulpclass");\n\nvar _gulp = __webpack_require__(/*! @root/helpers/gulp */ "./helpers/gulp.ts");\n\nvar _process = __webpack_require__(/*! @root/helpers/process */ "./helpers/process.ts");\n\nvar _gulp2 = _interopRequireDefault(__webpack_require__(/*! gulp */ "gulp"));\n\nvar _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _class, _class2;\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if (\'value\' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }\n\n__webpack_require__(/*! reflect-metadata */ "reflect-metadata");\n\n__webpack_require__(/*! tsconfig-paths/register */ "tsconfig-paths/register");\n\nlet Gulpfile = (_dec = (0, _gulpclass.Gulpclass)(), _dec2 = (0, _gulpclass.SequenceTask)(\'dev\'), _dec3 = Reflect.metadata("design:paramtypes", []), _dec4 = (0, _gulpclass.Task)(\'dev:start\'), _dec5 = Reflect.metadata("design:paramtypes", []), _dec6 = (0, _gulpclass.Task)(\'dev:codegen\'), _dec7 = Reflect.metadata("design:paramtypes", []), _dec8 = (0, _gulpclass.SequenceTask)(\'build\'), _dec9 = Reflect.metadata("design:paramtypes", []), _dec10 = (0, _gulpclass.SequenceTask)(\'build:next\'), _dec11 = Reflect.metadata("design:paramtypes", []), _dec12 = (0, _gulpclass.Task)(\'clean:next\'), _dec13 = Reflect.metadata("design:paramtypes", []), _dec14 = (0, _gulpclass.Task)(\'build:next-webpack\'), _dec15 = Reflect.metadata("design:paramtypes", []), _dec16 = (0, _gulpclass.Task)(\'build:analyze\'), _dec17 = Reflect.metadata("design:paramtypes", []), _dec18 = (0, _gulpclass.Task)(\'build:analyze-browser\'), _dec19 = Reflect.metadata("design:paramtypes", []), _dec20 = (0, _gulpclass.Task)(\'build:analyze-server\'), _dec21 = Reflect.metadata("design:paramtypes", []), _dec22 = (0, _gulpclass.Task)(\'build:codegen\'), _dec23 = Reflect.metadata("design:paramtypes", []), _dec24 = (0, _gulpclass.Task)(\'start\'), _dec25 = Reflect.metadata("design:paramtypes", []), _dec(_class = (_class2 = class Gulpfile extends _gulp.GenericWebpackTasks {\n  /** Dev tasks **/\n  dev() {\n    return [\'clean\', _gulp2.default.parallel(\'dev:codegen\', \'dev:webpack\', \'dev:start\')];\n  }\n\n  startDev() {\n    return (0, _process.spawn)(\'wait-on dist/main.js && node dist/main.js\');\n  }\n\n  devCodegen() {\n    return (0, _process.spawn)(\'graphql-codegen --config codegen.yml --watch\');\n  }\n  /** Build tasks **/\n\n\n  build() {\n    return [\'clean\', \'build:codegen\', _gulp2.default.parallel(\'build:webpack\', \'build:next\')];\n  }\n\n  buildNext() {\n    return [\'clean:next\', \'build:next-webpack\'];\n  }\n\n  cleanNext() {\n    return (0, _process.spawn)(\'rm -rf next-build\');\n  }\n\n  buildNextWebpack() {\n    return (0, _process.spawn)(\'next build ./src\');\n  }\n\n  analyze() {\n    process.env.BUNDLE_ANALYZE = \'both\';\n    return (0, _process.spawn)(\'next build ./src\');\n  }\n\n  analyzeBrowser() {\n    process.env.BUNDLE_ANALYZE = \'browser\';\n    return (0, _process.spawn)(\'next build ./src\');\n  }\n\n  analyzeServer() {\n    process.env.BUNDLE_ANALYZE = \'server\';\n    return (0, _process.spawn)(\'next build ./src\');\n  }\n\n  buildCodegen() {\n    return (0, _process.spawn)(\'graphql-codegen --config codegen.yml\');\n  }\n\n  startServer() {\n    return (0, _process.spawn)(\'node dist/main.js\');\n  }\n\n}, (_applyDecoratedDescriptor(_class2.prototype, "dev", [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "dev"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "startDev", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "startDev"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "devCodegen", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "devCodegen"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "build", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "build"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "buildNext", [_dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "buildNext"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "cleanNext", [_dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "cleanNext"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "buildNextWebpack", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "buildNextWebpack"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "analyze", [_dec16, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "analyze"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "analyzeBrowser", [_dec18, _dec19], Object.getOwnPropertyDescriptor(_class2.prototype, "analyzeBrowser"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "analyzeServer", [_dec20, _dec21], Object.getOwnPropertyDescriptor(_class2.prototype, "analyzeServer"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "buildCodegen", [_dec22, _dec23], Object.getOwnPropertyDescriptor(_class2.prototype, "buildCodegen"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "startServer", [_dec24, _dec25], Object.getOwnPropertyDescriptor(_class2.prototype, "startServer"), _class2.prototype)), _class2)) || _class);\nexports.Gulpfile = Gulpfile;\n\n//# sourceURL=webpack:///./packages/sw-web/gulpfile.ts?'
				);

				/***/
			},

		/***/ child_process:
			/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval(
					'module.exports = require("child_process");\n\n//# sourceURL=webpack:///external_%22child_process%22?'
				);

				/***/
			},

		/***/ 'cross-spawn':
			/*!******************************!*\
  !*** external "cross-spawn" ***!
  \******************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval(
					'module.exports = require("cross-spawn");\n\n//# sourceURL=webpack:///external_%22cross-spawn%22?'
				);

				/***/
			},

		/***/ 'find-up':
			/*!**************************!*\
  !*** external "find-up" ***!
  \**************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval('module.exports = require("find-up");\n\n//# sourceURL=webpack:///external_%22find-up%22?');

				/***/
			},

		/***/ gulp:
			/*!***********************!*\
  !*** external "gulp" ***!
  \***********************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval('module.exports = require("gulp");\n\n//# sourceURL=webpack:///external_%22gulp%22?');

				/***/
			},

		/***/ gulpclass:
			/*!****************************!*\
  !*** external "gulpclass" ***!
  \****************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval('module.exports = require("gulpclass");\n\n//# sourceURL=webpack:///external_%22gulpclass%22?');

				/***/
			},

		/***/ path:
			/*!***********************!*\
  !*** external "path" ***!
  \***********************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval('module.exports = require("path");\n\n//# sourceURL=webpack:///external_%22path%22?');

				/***/
			},

		/***/ 'reflect-metadata':
			/*!***********************************!*\
  !*** external "reflect-metadata" ***!
  \***********************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval(
					'module.exports = require("reflect-metadata");\n\n//# sourceURL=webpack:///external_%22reflect-metadata%22?'
				);

				/***/
			},

		/***/ 'tsconfig-paths/register':
			/*!******************************************!*\
  !*** external "tsconfig-paths/register" ***!
  \******************************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval(
					'module.exports = require("tsconfig-paths/register");\n\n//# sourceURL=webpack:///external_%22tsconfig-paths/register%22?'
				);

				/***/
			},

		/******/
	}
);
