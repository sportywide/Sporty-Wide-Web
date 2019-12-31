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
	/******/ /******/ return __webpack_require__((__webpack_require__.s = './gulpfile.ts'));
	/******/
})(
	/************************************************************************/
	/******/ {
		/***/ './gulpfile.ts':
			/*!*********************!*\
  !*** ./gulpfile.ts ***!
  \*********************/
			/*! no static exports found */
			/***/ function(module, exports, __webpack_require__) {
				'use strict';
				eval(
					"\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.Gulpfile = void 0;\n\nvar _gulpclass = __webpack_require__(/*! gulpclass */ \"gulpclass\");\n\nvar _process = __webpack_require__(/*! @root/helpers/process */ \"./helpers/process.ts\");\n\nvar _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _class, _class2;\n\nfunction _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }\n\n__webpack_require__(/*! reflect-metadata */ \"reflect-metadata\");\n\n__webpack_require__(/*! tsconfig-paths/register */ \"tsconfig-paths/register\");\n\nconst argv = __webpack_require__(/*! yargs */ \"yargs\").argv;\n\nlet Gulpfile = (_dec = (0, _gulpclass.Gulpclass)(), _dec2 = (0, _gulpclass.Task)('bootstrap'), _dec3 = Reflect.metadata(\"design:paramtypes\", []), _dec4 = (0, _gulpclass.Task)('cz'), _dec5 = Reflect.metadata(\"design:paramtypes\", []), _dec6 = (0, _gulpclass.Task)('dev:exec'), _dec7 = Reflect.metadata(\"design:paramtypes\", []), _dec8 = (0, _gulpclass.Task)('generate:migration'), _dec9 = Reflect.metadata(\"design:paramtypes\", []), _dec10 = (0, _gulpclass.Task)('test'), _dec11 = Reflect.metadata(\"design:paramtypes\", []), _dec12 = (0, _gulpclass.Task)('test:api'), _dec13 = Reflect.metadata(\"design:paramtypes\", []), _dec14 = (0, _gulpclass.Task)('typecheck'), _dec15 = Reflect.metadata(\"design:paramtypes\", []), _dec16 = (0, _gulpclass.Task)('ci:validate'), _dec17 = Reflect.metadata(\"design:paramtypes\", []), _dec(_class = (_class2 = class Gulpfile {\n  /** Generic tasks **/\n  bootstrap() {\n    if (argv.ci) {\n      return (0, _process.spawn)('npx lerna bootstrap -- --ci --no-optional && link-parent-bin');\n    } else if (argv.production) {\n      return (0, _process.spawn)('npx lerna bootstrap -- --production --no-optional && link-parent-bin -s true -d false -o false');\n    } else if (argv.packageLockOnly) {\n      return (0, _process.spawn)('npx lerna bootstrap -- --no-optional --package-lock-only');\n    } else if (argv.optional) {\n      return (0, _process.spawn)('npx lerna bootstrap && link-parent-bin');\n    } else {\n      return (0, _process.spawn)('npx lerna bootstrap -- --no-optional && link-parent-bin');\n    }\n  }\n\n  commit() {\n    return (0, _process.spawn)('git add . && git-cz');\n  }\n\n  exec() {\n    return (0, _process.spawn)(`npx lerna exec \"gulp dev:exec --entry ${argv.entry}\" --stream --scope ${argv.scope}`);\n  }\n\n  generateMigration() {\n    return (0, _process.spawn)('npx ts-node -T bin/migration.ts');\n  }\n  /** Test tasks **/\n\n\n  test() {\n    const args = ['--runInBand'];\n\n    if (argv.watch) {\n      args.push('--watch');\n    }\n\n    if (argv.coverage) {\n      args.push('--coverage');\n    }\n\n    if (argv.it) {\n      args.push('--testRegex=\\\\.it-spec\\\\.ts$');\n      args.push('--detectOpenHandles');\n    }\n\n    if (argv.e2e) {\n      args.push('--testRegex=\\\\.e2e-spec\\\\.ts$');\n    }\n\n    if (argv.full) {\n      args.push('--testRegex=\\\\.it-spec\\\\.tsx?$');\n      args.push('--testRegex=\\\\.e2e-spec\\\\.tsx?$');\n      args.push('--testRegex=\\\\.spec\\\\.tsx?$');\n      args.push('--detectOpenHandles');\n    }\n\n    for (const key of Object.keys(argv)) {\n      if (['watch', 'coverage', 'it', 'e2e', 'full', '$0', '_'].includes(key)) {\n        continue;\n      }\n\n      args.push(`--${key}`);\n\n      if (typeof argv[key] !== 'boolean') {\n        args.push(`\"${argv[key]}\"`);\n      }\n    }\n\n    return (0, _process.spawn)(`npx jest ${args.join(' ')}`);\n  }\n\n  apiTest() {\n    return (0, _process.spawn)('npx ts-node e2e/api/api-test.ts');\n  }\n\n  typeCheck() {\n    return (0, _process.spawn)('node --max-old-space-size=4096 node_modules/.bin/tsc --noEmit');\n  }\n  /** CI tasks **/\n\n\n  validateCi() {\n    return (0, _process.spawn)('cat .gitlab-ci.yml | curl --header \"Content-Type: application/json\" https://gitlab.com/api/v4/ci/lint --data @-');\n  }\n\n}, (_applyDecoratedDescriptor(_class2.prototype, \"bootstrap\", [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, \"bootstrap\"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, \"commit\", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, \"commit\"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, \"exec\", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, \"exec\"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, \"generateMigration\", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, \"generateMigration\"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, \"test\", [_dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, \"test\"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, \"apiTest\", [_dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, \"apiTest\"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, \"typeCheck\", [_dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, \"typeCheck\"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, \"validateCi\", [_dec16, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, \"validateCi\"), _class2.prototype)), _class2)) || _class);\nexports.Gulpfile = Gulpfile;\n\n//# sourceURL=webpack:///./gulpfile.ts?"
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

		/***/ yargs:
			/*!************************!*\
  !*** external "yargs" ***!
  \************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval('module.exports = require("yargs");\n\n//# sourceURL=webpack:///external_%22yargs%22?');

				/***/
			},

		/******/
	}
);
