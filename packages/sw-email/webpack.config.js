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
	/******/ /******/ return __webpack_require__((__webpack_require__.s = './packages/sw-email/webpack.config.ts'));
	/******/
})(
	/************************************************************************/
	/******/ {
		/***/ './packages/sw-email/webpack.config.ts':
			/*!*********************************************!*\
  !*** ./packages/sw-email/webpack.config.ts ***!
  \*********************************************/
			/*! no static exports found */
			/***/ function(module, exports, __webpack_require__) {
				'use strict';
				eval(
					"\n\nvar _path = _interopRequireDefault(__webpack_require__(/*! path */ \"path\"));\n\nvar _config = __webpack_require__(/*! @build/webpack/node/config */ \"./packages/sw-shared/build/webpack/node/config.ts\");\n\nvar _config2 = __webpack_require__(/*! @build/webpack/styles/config */ \"./packages/sw-shared/build/webpack/styles/config.ts\");\n\nvar _paths = _interopRequireDefault(__webpack_require__(/*! @build/paths */ \"./packages/sw-shared/build/paths/index.js\"));\n\nvar _glob = _interopRequireDefault(__webpack_require__(/*! glob */ \"glob\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconst argv = __webpack_require__(/*! yargs */ \"yargs\").argv;\n\nmodule.exports = [(0, _config.makeConfig)({\n  entries: _path.default.resolve(_paths.default.email.src, 'main'),\n  output: _paths.default.email.dist,\n  env: argv.env,\n  alias: {\n    '@root': _paths.default.project.root,\n    '@shared': _paths.default.shared.src,\n    '@core': _paths.default.core.src,\n    '@email': _paths.default.email.src,\n    '@schema': _paths.default.schema.src\n  }\n}), (0, _config2.makeConfig)({\n  env: argv.env,\n  entries: getStylesEntries(),\n  output: _path.default.resolve(_paths.default.email.dist, 'styles')\n})];\n\nfunction getStylesEntries() {\n  return _glob.default.sync(_path.default.resolve(_paths.default.email.styles, 'entries', '**/*.scss')).reduce((currentEntries, entry) => {\n    const relPath = _path.default.relative(_path.default.resolve(_paths.default.email.styles, 'entries'), entry).split(_path.default.sep).join('.');\n\n    const entryName = relPath.replace(/\\.s[ca]ss$/, '');\n    return { ...currentEntries,\n      [entryName]: entry\n    };\n  }, {});\n}\n\n//# sourceURL=webpack:///./packages/sw-email/webpack.config.ts?"
				);

				/***/
			},

		/***/ './packages/sw-shared/build/paths/index.js':
			/*!*************************************************!*\
  !*** ./packages/sw-shared/build/paths/index.js ***!
  \*************************************************/
			/*! no static exports found */
			/***/ function(module, exports, __webpack_require__) {
				'use strict';
				eval(
					"\n\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst findUp = __webpack_require__(/*! find-up */ \"find-up\");\n\nconst paths = {\n  get web() {\n    return {\n      root: path.resolve(paths.project.root, 'packages', 'sw-web'),\n\n      get src() {\n        return path.resolve(this.root, 'src');\n      },\n\n      get dist() {\n        return path.resolve(this.root, 'dist');\n      },\n\n      get clientPolyfill() {\n        return path.resolve(this.root, 'src', 'client-polyfill.js');\n      },\n\n      get serverPolyfill() {\n        return path.resolve(this.root, 'src', 'server-polyfill.js');\n      }\n\n    };\n  },\n\n  get shared() {\n    return {\n      root: path.resolve(paths.project.root, 'packages', 'sw-shared'),\n\n      get build() {\n        return path.resolve(this.root, 'build');\n      },\n\n      get webpack() {\n        return path.resolve(this.root, 'build', 'webpack');\n      },\n\n      get src() {\n        return path.resolve(this.root, 'src');\n      }\n\n    };\n  },\n\n  get schema() {\n    return {\n      root: path.resolve(paths.project.root, 'packages', 'sw-schema'),\n\n      get src() {\n        return path.resolve(this.root, 'src');\n      }\n\n    };\n  },\n\n  get core() {\n    return {\n      root: path.resolve(paths.project.root, 'packages', 'sw-core'),\n\n      get src() {\n        return path.resolve(this.root, 'src');\n      }\n\n    };\n  },\n\n  get data() {\n    return {\n      root: path.resolve(paths.project.root, 'packages', 'sw-data'),\n\n      get src() {\n        return path.resolve(this.root, 'src');\n      },\n\n      get scripts() {\n        return path.resolve(this.root, 'src', 'scripts');\n      },\n\n      get dist() {\n        return path.resolve(this.root, 'dist');\n      }\n\n    };\n  },\n\n  get api() {\n    return {\n      root: path.resolve(paths.project.root, 'packages', 'sw-api'),\n\n      get src() {\n        return path.resolve(this.root, 'src');\n      },\n\n      get dist() {\n        return path.resolve(this.root, 'dist');\n      }\n\n    };\n  },\n\n  get email() {\n    return {\n      root: path.resolve(paths.project.root, 'packages', 'sw-email'),\n\n      get src() {\n        return path.resolve(this.root, 'src');\n      },\n\n      get dist() {\n        return path.resolve(this.root, 'dist');\n      },\n\n      get styles() {\n        return path.resolve(this.root, 'src', 'styles');\n      }\n\n    };\n  },\n\n  get project() {\n    return {\n      root: path.dirname(findUp.sync('package-lock.json'))\n    };\n  }\n\n};\nmodule.exports = paths;\n\n//# sourceURL=webpack:///./packages/sw-shared/build/paths/index.js?"
				);

				/***/
			},

		/***/ './packages/sw-shared/build/webpack/node/config.ts':
			/*!*********************************************************!*\
  !*** ./packages/sw-shared/build/webpack/node/config.ts ***!
  \*********************************************************/
			/*! no static exports found */
			/***/ function(module, exports, __webpack_require__) {
				'use strict';
				eval(
					"\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.makeConfig = makeConfig;\nexports.getNodeModules = getNodeModules;\n\nvar _path = _interopRequireDefault(__webpack_require__(/*! path */ \"path\"));\n\nvar _fs = _interopRequireDefault(__webpack_require__(/*! fs */ \"fs\"));\n\nvar _env = __webpack_require__(/*! @shared/lib/utils/env */ \"./packages/sw-shared/src/lib/utils/env/index.ts\");\n\nvar _webpackNodeExternals = _interopRequireDefault(__webpack_require__(/*! webpack-node-externals */ \"webpack-node-externals\"));\n\nvar _copyWebpackPlugin = _interopRequireDefault(__webpack_require__(/*! copy-webpack-plugin */ \"copy-webpack-plugin\"));\n\nvar _webpack = _interopRequireDefault(__webpack_require__(/*! webpack */ \"webpack\"));\n\nvar _webpack2 = __webpack_require__(/*! @webpack-blocks/webpack */ \"@webpack-blocks/webpack\");\n\nvar _paths = _interopRequireDefault(__webpack_require__(/*! @build/paths */ \"./packages/sw-shared/build/paths/index.js\"));\n\nvar _transpile = __webpack_require__(/*! ../plugins/transpile */ \"./packages/sw-shared/build/webpack/plugins/transpile.ts\");\n\nvar _core = __webpack_require__(/*! ../plugins/core */ \"./packages/sw-shared/build/webpack/plugins/core.ts\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction makeConfig({\n  env: environment = 'development',\n  entries,\n  output,\n  alias,\n  hot,\n  envFile,\n  watchMode\n}) {\n  watchMode = (0, _env.isDevelopment)(environment) ? watchMode === undefined ? true : watchMode : false;\n\n  const packageName = _path.default.basename(_path.default.dirname(output));\n\n  envFile = envFile || _path.default.resolve(_paths.default.project.root, 'packages', packageName, '.env');\n  return (0, _webpack2.createConfig)([(0, _webpack2.setOutput)(output), (0, _webpack2.setMode)((0, _env.isDevelopment)(environment) ? 'development' : 'production'), (0, _core.setEntry)(hot ? ['webpack/hot/poll?1000', entries] : entries), (0, _core.target)('node'), (0, _core.externals)([...getNodeModules()]), (0, _transpile.babelHelper)({\n    cwd: _path.default.resolve(_paths.default.shared.webpack, 'node', 'babel'),\n    cacheDirectory: true\n  }), (0, _webpack2.resolve)({\n    extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],\n    alias,\n    modules: ['node_modules']\n  }), (0, _webpack2.setEnv)({\n    NODE_ENV: environment\n  }), (0, _webpack2.env)('development', [watchMode ? (0, _core.watch)() : (0, _core.none)(), (0, _webpack2.sourceMaps)('inline-source-map'), hot ? (0, _webpack2.addPlugins)([new _webpack.default.HotModuleReplacementPlugin()]) : (0, _core.none)()]), (0, _webpack2.env)('production', [(0, _webpack2.sourceMaps)('source-map')]), (0, _webpack2.addPlugins)([new _webpack.default.BannerPlugin({\n    banner: 'require(\"source-map-support\").install();',\n    raw: true,\n    entryOnly: false\n  })]), (0, _webpack2.setOutput)({\n    filename: '[name].js',\n    path: output\n  }), (0, _webpack2.addPlugins)([_fs.default.existsSync(envFile) ? new _copyWebpackPlugin.default([{\n    from: envFile,\n    to: _path.default.resolve(output)\n  }], {\n    copyUnmodified: true\n  }) : null, new _copyWebpackPlugin.default([{\n    from: {\n      glob: '**/*',\n      dot: true\n    },\n    to: _path.default.resolve(output, 'assets'),\n    context: _path.default.resolve(_paths.default.project.root, 'packages', packageName, 'assets')\n  }], {\n    copyUnmodified: true\n  })].filter(plugin => plugin)), (0, _core.node)()]);\n}\n\nfunction getNodeModules() {\n  const projectRoot = _paths.default.project.root;\n\n  const packageFolder = _path.default.resolve(projectRoot, 'packages');\n\n  const excludeDirs = ['sw-web'];\n\n  const packageDirs = _fs.default.readdirSync(packageFolder).filter(dir => !excludeDirs.includes(dir) && _fs.default.statSync(_path.default.join(packageFolder, dir)).isDirectory()).map(dir => _path.default.resolve(packageFolder, dir));\n\n  return [_path.default.resolve(projectRoot, 'node_modules'), ...packageDirs.map(dir => _path.default.resolve(dir, 'node_modules'))].map(dir => (0, _webpackNodeExternals.default)({\n    whitelist: 'webpack/hot/poll?1000',\n    modulesDir: dir\n  }));\n}\n\n//# sourceURL=webpack:///./packages/sw-shared/build/webpack/node/config.ts?"
				);

				/***/
			},

		/***/ './packages/sw-shared/build/webpack/plugins/core.ts':
			/*!**********************************************************!*\
  !*** ./packages/sw-shared/build/webpack/plugins/core.ts ***!
  \**********************************************************/
			/*! no static exports found */
			/***/ function(module, exports, __webpack_require__) {
				'use strict';
				eval(
					'\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.target = target;\nexports.externals = externals;\nexports.none = none;\nexports.optimize = optimize;\nexports.watch = watch;\nexports.node = node;\nexports.setEntry = setEntry;\n\nfunction target(target) {\n  return (context, util) => util.merge({\n    target\n  });\n}\n\nfunction externals(externals) {\n  return (context, util) => util.merge({\n    externals\n  });\n}\n\nfunction none() {\n  return () => config => config;\n}\n\nfunction optimize(options) {\n  return (context, util) => util.merge({\n    optimization: options\n  });\n}\n\nfunction watch() {\n  return (context, util) => util.merge({\n    watch: true,\n    watchOptions: {\n      ignored: /node_modules/,\n      poll: 1000,\n      aggregateTimeout: 300\n    }\n  });\n}\n\nfunction node() {\n  return (context, util) => util.merge({\n    node: {\n      __dirname: false\n    }\n  });\n}\n\nfunction setEntry(entry) {\n  return (context, util) => util.merge({\n    entry\n  });\n}\n\n//# sourceURL=webpack:///./packages/sw-shared/build/webpack/plugins/core.ts?'
				);

				/***/
			},

		/***/ './packages/sw-shared/build/webpack/plugins/styles.ts':
			/*!************************************************************!*\
  !*** ./packages/sw-shared/build/webpack/plugins/styles.ts ***!
  \************************************************************/
			/*! no static exports found */
			/***/ function(module, exports, __webpack_require__) {
				'use strict';
				eval(
					"\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.extractCss = extractCss;\nexports.sass = sass;\nexports.postcss = postcss;\nexports.css = css;\nexports.cssModules = cssModules;\n\nvar _miniCssExtractPlugin = _interopRequireDefault(__webpack_require__(/*! mini-css-extract-plugin */ \"mini-css-extract-plugin\"));\n\nvar _omit = _interopRequireDefault(__webpack_require__(/*! lodash/omit */ \"lodash/omit\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction extractCss({\n  test = /\\.css$/,\n  ...options\n}) {\n  return (context, util) => util.merge({\n    module: {\n      rules: [{\n        test,\n        use: [{\n          loader: _miniCssExtractPlugin.default.loader\n        }],\n        ...context.match\n      }]\n    },\n    plugins: [new _miniCssExtractPlugin.default(options)]\n  });\n} //plugins copied and adapted from @webpack-blocks/styles, @webpack-blocks/postcss and @webpack-blocks/assets\n\n\nfunction sass(options = {}) {\n  return (context, util) => {\n    return util.addLoader({\n      test: /\\.(sass|scss)$/,\n      use: [{\n        loader: 'sass-loader',\n        options\n      }],\n      ...context.match\n    });\n  };\n}\n\nfunction postcss(options = {}) {\n  if (Array.isArray(options)) {\n    throw Error('Passing PostCSS plugins as a first argument is not supported anymore, use options.plugins instead');\n  }\n\n  return (context, util) => prevConfig => {\n    const ruleDef = {\n      test: /\\.css$/,\n      use: [{\n        loader: 'postcss-loader',\n        options\n      }],\n      ...context.match\n    };\n    return util.addLoader(ruleDef)(prevConfig);\n  };\n}\n\nfunction css(options = {}) {\n  const cssOptions = (0, _omit.default)(options, ['styleLoader']);\n  const loaders = [{\n    loader: 'css-loader',\n    options: cssOptions\n  }];\n\n  if (options.styleLoader !== false) {\n    loaders.unshift({\n      loader: 'style-loader',\n      options: options.styleLoader || {}\n    });\n  }\n\n  return (context, util) => util.addLoader({\n    test: /\\.css$/,\n    use: loaders,\n    ...context.match\n  });\n}\n\nfunction cssModules(options = {}) {\n  const defaultCssOptions = {\n    modules: true,\n    importLoaders: 1,\n    localIdentName: options.env === 'production' ? '[hash:base64:10]' : '[name]--[local]--[hash:base64:5]'\n  };\n  const cssOptions = Object.assign(defaultCssOptions, (0, _omit.default)(options, ['exclude', 'include', 'styleLoader', 'env']));\n  const loaders = [{\n    loader: 'css-loader',\n    options: cssOptions\n  }];\n\n  if (options.styleLoader !== false) {\n    loaders.unshift({\n      loader: 'style-loader',\n      options: options.styleLoader || {}\n    });\n  }\n\n  return (context, util) => util.addLoader({\n    test: /\\.css$/,\n    use: loaders,\n    ...context.match\n  });\n}\n\n//# sourceURL=webpack:///./packages/sw-shared/build/webpack/plugins/styles.ts?"
				);

				/***/
			},

		/***/ './packages/sw-shared/build/webpack/plugins/transpile.ts':
			/*!***************************************************************!*\
  !*** ./packages/sw-shared/build/webpack/plugins/transpile.ts ***!
  \***************************************************************/
			/*! no static exports found */
			/***/ function(module, exports, __webpack_require__) {
				'use strict';
				eval(
					'\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.babelHelper = babelHelper;\n\nfunction babelHelper(options = {}) {\n  return (context, {\n    merge\n  }) => merge({\n    module: {\n      rules: [Object.assign({\n        test: /\\.(js|ts)x?$/,\n        use: {\n          loader: \'babel-loader\',\n          options\n        },\n        exclude: /node_modules/\n      }, context.match)]\n    }\n  });\n}\n\n//# sourceURL=webpack:///./packages/sw-shared/build/webpack/plugins/transpile.ts?'
				);

				/***/
			},

		/***/ './packages/sw-shared/build/webpack/styles/config.ts':
			/*!***********************************************************!*\
  !*** ./packages/sw-shared/build/webpack/styles/config.ts ***!
  \***********************************************************/
			/*! no static exports found */
			/***/ function(module, exports, __webpack_require__) {
				'use strict';
				eval(
					"\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.makeConfig = makeConfig;\n\nvar _paths = _interopRequireDefault(__webpack_require__(/*! @build/paths */ \"./packages/sw-shared/build/paths/index.js\"));\n\nvar _env = __webpack_require__(/*! @shared/lib/utils/env */ \"./packages/sw-shared/src/lib/utils/env/index.ts\");\n\nvar _webpack = __webpack_require__(/*! @webpack-blocks/webpack */ \"@webpack-blocks/webpack\");\n\nvar _core = __webpack_require__(/*! @webpack-blocks/core */ \"@webpack-blocks/core\");\n\nvar _styles = __webpack_require__(/*! @build/webpack/plugins/styles */ \"./packages/sw-shared/build/webpack/plugins/styles.ts\");\n\nvar _core2 = __webpack_require__(/*! @build/webpack/plugins/core */ \"./packages/sw-shared/build/webpack/plugins/core.ts\");\n\nvar _webpackFixStyleOnlyEntries = _interopRequireDefault(__webpack_require__(/*! webpack-fix-style-only-entries */ \"webpack-fix-style-only-entries\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction makeConfig({\n  entries,\n  output,\n  env: environment\n}) {\n  return (0, _webpack.createConfig)([(0, _webpack.setOutput)(output), (0, _webpack.setMode)((0, _env.isDevelopment)(environment) ? 'development' : 'production'), (0, _core2.setEntry)(entries), (0, _webpack.env)('development', [(0, _core2.watch)()]), (0, _core.match)(['*.css', '!*node_modules*'], [(0, _styles.extractCss)({\n    filename: '[name].min.css'\n  }), (0, _styles.css)({\n    styleLoader: false,\n    sourceMap: (0, _env.isDevelopment)(environment)\n  }), (0, _styles.postcss)({\n    config: {\n      path: _paths.default.project.root\n    },\n    sourceMap: (0, _env.isDevelopment)(environment)\n  })]), (0, _core.match)(['*.scss', '!*node_modules*'], [(0, _styles.extractCss)({\n    filename: '[name].min.css'\n  }), (0, _styles.css)({\n    styleLoader: false,\n    sourceMap: (0, _env.isDevelopment)(environment)\n  }), (0, _styles.postcss)({\n    config: {\n      path: _paths.default.project.root\n    },\n    sourceMap: (0, _env.isDevelopment)(environment)\n  }), (0, _styles.sass)({\n    sourceMap: (0, _env.isDevelopment)(environment)\n  })]), (0, _webpack.setOutput)({\n    path: output,\n    filename: '[name].js'\n  }), (0, _webpack.addPlugins)([new _webpackFixStyleOnlyEntries.default()])]);\n}\n\n//# sourceURL=webpack:///./packages/sw-shared/build/webpack/styles/config.ts?"
				);

				/***/
			},

		/***/ './packages/sw-shared/src/lib/utils/env/index.ts':
			/*!*******************************************************!*\
  !*** ./packages/sw-shared/src/lib/utils/env/index.ts ***!
  \*******************************************************/
			/*! no static exports found */
			/***/ function(module, exports, __webpack_require__) {
				'use strict';
				eval(
					"\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isProduction = isProduction;\nexports.isDevelopment = isDevelopment;\nexports.isTesting = isTesting;\n\nfunction isProduction(env = process.env.NODE_ENV) {\n  return env === 'production';\n}\n\nfunction isDevelopment(env = process.env.NODE_ENV) {\n  return env === 'development';\n}\n\nfunction isTesting(env = process.env.NODE_ENV) {\n  return env === 'test';\n}\n\n//# sourceURL=webpack:///./packages/sw-shared/src/lib/utils/env/index.ts?"
				);

				/***/
			},

		/***/ '@webpack-blocks/core':
			/*!***************************************!*\
  !*** external "@webpack-blocks/core" ***!
  \***************************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval(
					'module.exports = require("@webpack-blocks/core");\n\n//# sourceURL=webpack:///external_%22@webpack-blocks/core%22?'
				);

				/***/
			},

		/***/ '@webpack-blocks/webpack':
			/*!******************************************!*\
  !*** external "@webpack-blocks/webpack" ***!
  \******************************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval(
					'module.exports = require("@webpack-blocks/webpack");\n\n//# sourceURL=webpack:///external_%22@webpack-blocks/webpack%22?'
				);

				/***/
			},

		/***/ 'copy-webpack-plugin':
			/*!**************************************!*\
  !*** external "copy-webpack-plugin" ***!
  \**************************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval(
					'module.exports = require("copy-webpack-plugin");\n\n//# sourceURL=webpack:///external_%22copy-webpack-plugin%22?'
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

		/***/ fs:
			/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval('module.exports = require("fs");\n\n//# sourceURL=webpack:///external_%22fs%22?');

				/***/
			},

		/***/ glob:
			/*!***********************!*\
  !*** external "glob" ***!
  \***********************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval('module.exports = require("glob");\n\n//# sourceURL=webpack:///external_%22glob%22?');

				/***/
			},

		/***/ 'lodash/omit':
			/*!******************************!*\
  !*** external "lodash/omit" ***!
  \******************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval(
					'module.exports = require("lodash/omit");\n\n//# sourceURL=webpack:///external_%22lodash/omit%22?'
				);

				/***/
			},

		/***/ 'mini-css-extract-plugin':
			/*!******************************************!*\
  !*** external "mini-css-extract-plugin" ***!
  \******************************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval(
					'module.exports = require("mini-css-extract-plugin");\n\n//# sourceURL=webpack:///external_%22mini-css-extract-plugin%22?'
				);

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

		/***/ webpack:
			/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval('module.exports = require("webpack");\n\n//# sourceURL=webpack:///external_%22webpack%22?');

				/***/
			},

		/***/ 'webpack-fix-style-only-entries':
			/*!*************************************************!*\
  !*** external "webpack-fix-style-only-entries" ***!
  \*************************************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval(
					'module.exports = require("webpack-fix-style-only-entries");\n\n//# sourceURL=webpack:///external_%22webpack-fix-style-only-entries%22?'
				);

				/***/
			},

		/***/ 'webpack-node-externals':
			/*!*****************************************!*\
  !*** external "webpack-node-externals" ***!
  \*****************************************/
			/*! no static exports found */
			/***/ function(module, exports) {
				eval(
					'module.exports = require("webpack-node-externals");\n\n//# sourceURL=webpack:///external_%22webpack-node-externals%22?'
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
