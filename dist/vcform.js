(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VCForm"] = factory();
	else
		root["VCForm"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 55);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/core-js-stable/json/stringify");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/core-js-stable/object/keys");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/core-js-stable/instance/includes");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/helpers/toConsumableArray");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = {};

function modulesToDom(moduleId, list, options) {
  for (var i = 0; i < list.length; i++) {
    var part = {
      css: list[i][1],
      media: list[i][2],
      sourceMap: list[i][3]
    };

    if (stylesInDom[moduleId][i]) {
      stylesInDom[moduleId][i](part);
    } else {
      stylesInDom[moduleId].push(addStyle(part, options));
    }
  }
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (moduleId, list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  moduleId = options.base ? moduleId + options.base : moduleId;
  list = list || [];

  if (!stylesInDom[moduleId]) {
    stylesInDom[moduleId] = [];
  }

  modulesToDom(moduleId, list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    if (!stylesInDom[moduleId]) {
      stylesInDom[moduleId] = [];
    }

    modulesToDom(moduleId, newList, options);

    for (var j = newList.length; j < stylesInDom[moduleId].length; j++) {
      stylesInDom[moduleId][j]();
    }

    stylesInDom[moduleId].length = newList.length;

    if (stylesInDom[moduleId].length === 0) {
      delete stylesInDom[moduleId];
    }
  };
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    for (var i = 0; i < modules.length; i++) {
      var item = [].concat(modules[i]);

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot).concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/component/item.vue?vue&type=template&id=6d078e7e&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return !_vm.hidden
    ? _c(
        "el-form",
        {
          ref: "form",
          class: [
            "fm-item__root",
            {
              "fm-item--root": _vm.isRoot,
              "fm-item--combined": !_vm.isBase,
              "fm-item--invalid": _vm.error
            }
          ],
          attrs: {
            "label-width": (_vm.isBase ? _vm.labelWidth : 0) + "px",
            model: _vm.model,
            rules: _vm.rules,
            "status-icon": true,
            "show-message": _vm.isBase,
            "inline-message": true
          },
          on: { validate: _vm.onValidate }
        },
        [
          _c(
            "el-form-item",
            {
              attrs: {
                label: _vm.isBase ? _vm.schema.title : "",
                prop: "value"
              }
            },
            [
              _vm.schema.type === "object"
                ? [
                    _vm.value
                      ? _c(
                          "el-collapse",
                          {
                            class: { "fm-item--root": _vm.isRoot },
                            attrs: { value: ["1"] }
                          },
                          [
                            _c(
                              "el-collapse-item",
                              { attrs: { name: "1", disabled: _vm.isRoot } },
                              [
                                _c(
                                  "div",
                                  {
                                    staticClass: "fm-item__header",
                                    attrs: { slot: "title" },
                                    slot: "title"
                                  },
                                  [
                                    _c(
                                      "el-row",
                                      {
                                        attrs: {
                                          type: "flex",
                                          justify: "space-between"
                                        }
                                      },
                                      [
                                        _c("el-col", { attrs: { span: 15 } }, [
                                          _c(
                                            "span",
                                            {
                                              staticClass: "fm-item__label",
                                              style: {
                                                width: _vm.labelWidth + "px"
                                              },
                                              attrs: {
                                                "data-required": _vm.required
                                                  ? "*"
                                                  : ""
                                              }
                                            },
                                            [_vm._v(_vm._s(_vm.schema.title))]
                                          ),
                                          _vm._v(" "),
                                          _vm.schema.description
                                            ? _c(
                                                "span",
                                                {
                                                  staticClass:
                                                    "fm-item__description"
                                                },
                                                [
                                                  _vm._v(
                                                    _vm._s(
                                                      _vm.schema.description
                                                    )
                                                  )
                                                ]
                                              )
                                            : _vm._e()
                                        ]),
                                        _vm._v(" "),
                                        _vm.error
                                          ? _c(
                                              "el-col",
                                              {
                                                staticClass: "fm-item__error",
                                                attrs: { span: 7 }
                                              },
                                              [_vm._v(_vm._s(_vm.error))]
                                            )
                                          : _vm._e()
                                      ],
                                      1
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  typeof _vm.schema.component === "function"
                                    ? _vm.schema.component()
                                    : "v-object",
                                  {
                                    ref: "object",
                                    tag: "component",
                                    attrs: {
                                      schema: _vm.schema,
                                      value: _vm.value
                                    },
                                    on: {
                                      validate: function($event) {
                                        var i = arguments.length,
                                          argsArray = Array(i)
                                        while (i--) argsArray[i] = arguments[i]
                                        return _vm.$set.apply(
                                          void 0,
                                          [
                                            _vm.validateResult.properties
                                          ].concat(argsArray)
                                        )
                                      },
                                      destroy: function($event) {
                                        return _vm.$delete(
                                          _vm.validateResult.properties,
                                          $event
                                        )
                                      }
                                    }
                                  }
                                )
                              ],
                              1
                            )
                          ],
                          1
                        )
                      : _vm._e()
                  ]
                : _vm.schema.type === "array"
                ? [
                    _vm.value
                      ? _c(
                          "el-collapse",
                          {
                            class: { "fm-item--root": _vm.isRoot },
                            attrs: { value: ["1"] }
                          },
                          [
                            _c(
                              "el-collapse-item",
                              { attrs: { name: "1", disabled: _vm.isRoot } },
                              [
                                _c(
                                  "div",
                                  {
                                    staticClass: "fm-item__header",
                                    attrs: { slot: "title" },
                                    slot: "title"
                                  },
                                  [
                                    _c(
                                      "el-row",
                                      {
                                        attrs: {
                                          type: "flex",
                                          justify: "space-between"
                                        }
                                      },
                                      [
                                        _c("el-col", { attrs: { span: 12 } }, [
                                          _c(
                                            "span",
                                            {
                                              staticClass: "fm-item__label",
                                              style: {
                                                width: _vm.labelWidth + "px"
                                              },
                                              attrs: {
                                                "data-required": _vm.required
                                                  ? "*"
                                                  : ""
                                              }
                                            },
                                            [_vm._v(_vm._s(_vm.schema.title))]
                                          ),
                                          _vm._v(" "),
                                          _vm.schema.description
                                            ? _c(
                                                "span",
                                                {
                                                  staticClass:
                                                    "fm-item__description"
                                                },
                                                [
                                                  _vm._v(
                                                    _vm._s(
                                                      _vm.schema.description
                                                    )
                                                  )
                                                ]
                                              )
                                            : _vm._e()
                                        ]),
                                        _vm._v(" "),
                                        _vm.error
                                          ? _c(
                                              "el-col",
                                              {
                                                staticClass: "fm-item__error",
                                                attrs: { span: 8 }
                                              },
                                              [_vm._v(_vm._s(_vm.error))]
                                            )
                                          : _vm._e(),
                                        _vm._v(" "),
                                        typeof _vm.schema.component !==
                                        "function"
                                          ? _c(
                                              "el-col",
                                              {
                                                staticClass: "fm-item__add",
                                                attrs: { span: 4 }
                                              },
                                              [
                                                _c(
                                                  "el-button",
                                                  {
                                                    attrs: { type: "primary" },
                                                    on: {
                                                      click: function($event) {
                                                        $event.stopPropagation()
                                                        return _vm.$refs.array.onAdd(
                                                          $event
                                                        )
                                                      }
                                                    }
                                                  },
                                                  [_vm._v("新增")]
                                                )
                                              ],
                                              1
                                            )
                                          : _vm._e()
                                      ],
                                      1
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  typeof _vm.schema.component === "function"
                                    ? _vm.schema.component()
                                    : "v-array",
                                  {
                                    ref: "array",
                                    tag: "component",
                                    attrs: {
                                      schema: _vm.schema,
                                      value: _vm.value
                                    },
                                    on: {
                                      validate: function($event) {
                                        var i = arguments.length,
                                          argsArray = Array(i)
                                        while (i--) argsArray[i] = arguments[i]
                                        return _vm.$set.apply(
                                          void 0,
                                          [_vm.validateResult.items].concat(
                                            argsArray
                                          )
                                        )
                                      },
                                      destroy: function($event) {
                                        return _vm.validateResult.items.splice(
                                          $event,
                                          1
                                        )
                                      }
                                    }
                                  }
                                )
                              ],
                              1
                            )
                          ],
                          1
                        )
                      : _vm._e()
                  ]
                : _c(
                    "div",
                    {
                      class: [
                        "fm-item__content",
                        { "fm-item__content--valid": !_vm.error }
                      ]
                    },
                    [
                      _c(
                        typeof _vm.schema.component === "function"
                          ? _vm.schema.component()
                          : "v-base",
                        {
                          tag: "component",
                          attrs: { schema: _vm.schema, value: _vm.value },
                          on: { input: _vm.$listeners.input }
                        }
                      ),
                      _vm._v(" "),
                      _vm.schema.description
                        ? _c(
                            "div",
                            { staticClass: "fm-item__description--content" },
                            [_vm._v(_vm._s(_vm.schema.description))]
                          )
                        : _vm._e()
                    ],
                    1
                  )
            ],
            2
          )
        ],
        1
      )
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./src/component/item.vue?vue&type=template&id=6d078e7e&

// EXTERNAL MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/component/item.vue?vue&type=script&lang=js&
var itemvue_type_script_lang_js_ = __webpack_require__(12);

// CONCATENATED MODULE: ./src/component/item.vue?vue&type=script&lang=js&
 /* harmony default export */ var component_itemvue_type_script_lang_js_ = (itemvue_type_script_lang_js_["a" /* default */]); 
// EXTERNAL MODULE: ./src/component/item.vue?vue&type=style&index=0&lang=less&
var itemvue_type_style_index_0_lang_less_ = __webpack_require__(51);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/component/item.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  component_itemvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/component/item.vue"
/* harmony default export */ var item = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/helpers/typeof");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/core-js-stable/instance/find-index");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_reverse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(27);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_reverse__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_reverse__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs3_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_corejs3_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_every__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(28);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_every__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_every__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_find_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_find_index__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_find_index__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_starts_with__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(29);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_starts_with__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_starts_with__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_splice__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(21);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_splice__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_splice__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_corejs3_helpers_typeof__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_corejs3_helpers_typeof__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_typeof__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_json_stringify__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_json_stringify__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_json_stringify__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(4);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(23);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(24);
/* harmony import */ var _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(30);
/* harmony import */ var big_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(big_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(37);
/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(36);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(35);













//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





function noop() {}
/**
 * 遍历校验结果并过滤掉一些无用数据
 * valid 表示整个表单是否校验通过
 */


function travel() {
  var _context;

  var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var valid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var result = {};

  _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()(_context = _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default()(item)).call(_context, function (key) {
    var _context2, _context3;

    switch (key) {
      case 'valid':
      case 'message':
        result[key] = item[key];

        if (key === 'valid' && !result[key]) {
          valid = result[key];
        }

        break;

      case 'properties':
        var properties = {};

        _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()(_context2 = _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default()(item[key])).call(_context2, function (prop) {
          var _travel = travel(item[key][prop], valid),
              _travel2 = _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_10___default()(_travel, 2),
              child = _travel2[0],
              val = _travel2[1];

          if (child) {
            properties[prop] = child;
          }

          if (!val) {
            valid = val;
          }
        });

        if (_babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default()(properties).length) {
          result[key] = properties;
        }

        break;

      case 'items':
        var items = [];

        _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()(_context3 = item[key]).call(_context3, function (item) {
          var _travel3 = travel(item, valid),
              _travel4 = _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_10___default()(_travel3, 2),
              child = _travel4[0],
              val = _travel4[1];

          items.push(child);

          if (!val) {
            valid = val;
          }
        });

        if (_babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_9___default()(items).call(items, function (child) {
          return child;
        })) {
          result[key] = items;
        }

        break;
    }
  });

  return [_babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default()(result).length ? result : undefined, valid];
}

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'v-item',
  components: {
    VObject: _object__WEBPACK_IMPORTED_MODULE_14__[/* default */ "a"],
    VArray: _array__WEBPACK_IMPORTED_MODULE_15__[/* default */ "a"],
    VBase: _base__WEBPACK_IMPORTED_MODULE_16__[/* default */ "a"]
  },
  provide: function provide() {
    return this.provideData;
  },
  inject: {
    fmGlobal: {
      "default": undefined
    }
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      required: true
    },
    required: {
      // 是否必填
      type: Boolean,
      "default": false
    },
    labelWidth: {
      type: Number,
      "default": 80
    }
  },
  data: function data() {
    return {
      error: '',
      // 错误信息
      validateResult: undefined // 校验结果

    };
  },
  computed: {
    isRoot: function isRoot() {
      // 是不是根组件
      return !this.fmGlobal;
    },
    provideData: function provideData() {
      // 共享给后代组件的数据
      var self = this;
      return this.isRoot ? {
        fmGlobal: {
          get value() {
            // 整个表单的值
            return self.value;
          },

          inited: false // 整个表单是否已初始化

        }
      } : {};
    },
    isBase: function isBase() {
      var _context4;

      // 是不是基本数据类型
      return !_babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_8___default()(_context4 = ['object', 'array']).call(_context4, this.schema.type);
    },
    global: function global() {
      // 全局数据
      return this.fmGlobal || this.provideData.fmGlobal;
    },
    hidden: function hidden() {
      // 当前组件是否需要隐藏
      return this.isHidden(this.schema);
    },
    fixedValue: function fixedValue() {
      var _this = this,
          _context6;

      // 根据schema并剔除隐藏的项后生成最终的value
      var schema = this.schema;
      var type = schema.type,
          defaultValue = schema["default"];
      var data; // 拷贝默认值

      if (defaultValue !== undefined) {
        defaultValue = JSON.parse(_babel_runtime_corejs3_core_js_stable_json_stringify__WEBPACK_IMPORTED_MODULE_7___default()(defaultValue));
      }

      switch (type) {
        case 'object':
          data = this.value || defaultValue || {}; // 当前组件需要隐藏，删除所有属性

          if (this.hidden) {
            var _context5;

            _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()(_context5 = _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default()(data)).call(_context5, function (key) {
              _this.$delete(data, key);
            });

            break;
          } // 如果对象的某个属性被隐藏时，从对象中删除该属性


          _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()(_context6 = _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default()(schema.properties)).call(_context6, function (prop) {
            var hidden = _this.isHidden(schema.properties[prop]);

            if (hidden) {
              return data.hasOwnProperty(prop) && _this.$delete(data, prop);
            }

            if (!data.hasOwnProperty(prop)) {
              // 给子属性设置初始值，不能统一设置成undefined，不然基本类型有默认值时初始化时就会触发校验

              /**
               * 当value初始为undefined时，el-input-number会触发input事件，导致覆盖掉fixedValue设置的默认值
               */
              var _type = schema.properties[prop].type;
              var _defaultValue = schema.properties[prop]["default"];
              var value;

              switch (_type) {
                case 'object':
                  value = _defaultValue || {};
                  break;

                case 'array':
                case 'address':
                case 'range':
                  value = _defaultValue instanceof Array ? _defaultValue : [];
                  break;

                default:
                  // eslint-disable-next-line valid-typeof
                  value = _babel_runtime_corejs3_helpers_typeof__WEBPACK_IMPORTED_MODULE_6___default()(_defaultValue) === _type ? _defaultValue : undefined;
              }

              _this.$set(data, prop, value);
            }
          });

          break;

        case 'array':
        case 'address':
        case 'range':
          data = this.value instanceof Array ? this.value : defaultValue instanceof Array ? defaultValue : [];
          this.hidden && _babel_runtime_corejs3_core_js_stable_instance_splice__WEBPACK_IMPORTED_MODULE_5___default()(data).call(data, 0); // 当前组件需要隐藏，删除所有元素

          break;

        default:
          // eslint-disable-next-line valid-typeof
          data = _babel_runtime_corejs3_helpers_typeof__WEBPACK_IMPORTED_MODULE_6___default()(this.value) === type ? this.value : _babel_runtime_corejs3_helpers_typeof__WEBPACK_IMPORTED_MODULE_6___default()(defaultValue) === type ? defaultValue : undefined;
          this.hidden && (data = undefined);
        // 当前组件需要隐藏，置为undefined
      }

      return data;
    },
    fixedValidateResult: function fixedValidateResult() {
      // 根据schema并剔除隐藏的项后生成最终的validateResult
      var schema = this.schema;
      var data;

      if (this.hidden) {
        // 当前组件需要隐藏
        return undefined;
      }

      switch (schema.type) {
        case 'object':
          data = this.validateResult || {
            properties: {}
          };
          break;

        case 'array':
          data = this.validateResult || {
            items: []
          };
          break;

        default:
          data = this.validateResult || {};
      }

      return data;
    },
    model: function model() {
      return {
        value: this.value
      };
    },
    rules: function rules() {
      var _context8;

      // 校验规则
      var _this$schema = this.schema,
          type = _this$schema.type,
          format = _this$schema.format,
          message = _this$schema.message,
          pattern = _this$schema.pattern,
          minLength = _this$schema.minLength,
          maxLength = _this$schema.maxLength,
          minimum = _this$schema.minimum,
          maximum = _this$schema.maximum,
          multipleOf = _this$schema.multipleOf,
          minItems = _this$schema.minItems,
          maxItems = _this$schema.maxItems,
          uniqueItems = _this$schema.uniqueItems,
          _validator = _this$schema.validator;
      var rules = {
        value: []
      };
      this.required && rules.value.push({
        type: function () {
          var _context7;

          if (_babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_8___default()(_context7 = ['address', 'range']).call(_context7, type)) {
            return 'array';
          }

          return type;
        }(),
        required: true,
        message: '输入不能为空'
      });

      switch (true) {
        case type === 'string':
          if (typeof minLength === 'number') {
            rules.value.push({
              type: type,
              min: minLength,
              message: "\u4E0D\u80FD\u5C11\u4E8E".concat(minLength, "\u4E2A\u5B57\u7B26")
            });
          }

          if (typeof maxLength === 'number') {
            rules.value.push({
              type: type,
              max: maxLength,
              message: "\u4E0D\u80FD\u8D85\u8FC7".concat(maxLength, "\u4E2A\u5B57\u7B26")
            });
          } // 文件校验


          if (_babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_8___default()(_context8 = ['image', 'video', 'file']).call(_context8, format)) {
            rules.value.push({
              validator: function validator(rule, value, callback) {
                if (_babel_runtime_corejs3_core_js_stable_instance_starts_with__WEBPACK_IMPORTED_MODULE_4___default()(value).call(value, 'validate:')) {
                  callback(new Error(value.replace(/^validate\:/, '')));
                } else {
                  callback();
                }
              }
            });
          }

          break;

        case type === 'number':
          if (typeof minimum === 'number') {
            rules.value.push({
              type: type,
              min: minimum,
              message: "\u4E0D\u80FD\u5C0F\u4E8E".concat(minimum)
            });
          }

          if (typeof maximum === 'number') {
            rules.value.push({
              type: type,
              max: maximum,
              message: "\u4E0D\u80FD\u5927\u4E8E".concat(maximum)
            });
          }

          if (typeof multipleOf === 'number') {
            rules.value.push({
              validator: function validator(rule, value, callback) {
                if (new big_js__WEBPACK_IMPORTED_MODULE_13___default.a(value).mod(multipleOf).toString() !== '0') {
                  callback(new Error("\u8BF7\u8F93\u5165".concat(multipleOf, "\u7684\u500D\u6570")));
                } else {
                  callback();
                }
              }
            });
          }

          break;

        case type === 'address':
          rules.value.push({
            validator: function validator(rule, value, callback) {
              switch (_babel_runtime_corejs3_core_js_stable_instance_find_index__WEBPACK_IMPORTED_MODULE_3___default()(value).call(value, function (item) {
                return !item;
              })) {
                case 0:
                  callback(new Error('请选择省份'));
                  break;

                case 1:
                  callback(new Error('请选择城市'));
                  break;

                case 2:
                  callback(new Error('请选择区域'));
                  break;

                case 3:
                  callback(new Error('请输入详细地址'));
                  break;

                default:
                  callback();
              }
            }
          });

          if ((format || 'detail') === 'detail') {
            if (typeof minLength === 'number') {
              rules.value.push({
                validator: function validator(rule, value, callback) {
                  if (!value[3] || value[3].length < minLength) {
                    return callback(new Error("\u5730\u5740\u8BE6\u60C5\u6700\u5C11\u8F93\u5165".concat(minLength, "\u4E2A\u5B57\u7B26")));
                  }

                  callback();
                }
              });
            }

            if (typeof maxLength === 'number') {
              rules.value.push({
                validator: function validator(rule, value, callback) {
                  if (value[3] && value[3].length > maxLength) {
                    return callback(new Error("\u5730\u5740\u8BE6\u60C5\u6700\u591A\u8F93\u5165".concat(maxLength, "\u4E2A\u5B57\u7B26")));
                  }

                  callback();
                }
              });
            }
          }

          break;

        case type === 'array':
          if (typeof minItems === 'number') {
            rules.value.push({
              type: type,
              min: minItems,
              message: "\u4E0D\u80FD\u5C11\u4E8E".concat(minItems, "\u4E2A\u5143\u7D20")
            });
          }

          if (typeof maxItems === 'number') {
            rules.value.push({
              type: type,
              max: maxItems,
              message: "\u4E0D\u80FD\u8D85\u8FC7".concat(maxItems, "\u4E2A\u5143\u7D20")
            });
          }

          rules.value.push({
            validator: function validator(rule, value, callback) {
              var list = [];
              var keyGenerator;

              switch (true) {
                case uniqueItems instanceof Array:
                  keyGenerator = function keyGenerator(item) {
                    var key = [];

                    _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_12___default()(uniqueItems).call(uniqueItems, function (name) {
                      key.push(item[name]);
                    });

                    return _babel_runtime_corejs3_core_js_stable_json_stringify__WEBPACK_IMPORTED_MODULE_7___default()(key);
                  };

                  break;

                case typeof uniqueItems === 'function':
                  keyGenerator = function keyGenerator(item) {
                    return uniqueItems(item);
                  };

                  break;

                case !!uniqueItems:
                  keyGenerator = function keyGenerator(item) {
                    return _babel_runtime_corejs3_core_js_stable_json_stringify__WEBPACK_IMPORTED_MODULE_7___default()(item);
                  };

                  break;
              }

              if (keyGenerator && _babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_9___default()(value).call(value, function (item) {
                var key = keyGenerator(item);

                var exist = _babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_8___default()(list).call(list, key);

                list.push(key);
                return exist;
              })) {
                return callback(new Error('包含重复元素'));
              }

              callback();
            }
          });
          break;
      } // 自定义校验函数


      if (typeof _validator === 'function') {
        rules.value.push({
          validator: function validator(rule, value, callback) {
            _validator(JSON.parse(_babel_runtime_corejs3_core_js_stable_json_stringify__WEBPACK_IMPORTED_MODULE_7___default()(value)), callback);
          }
        });
      } // 这里加个空的校验函数是为了执行this.$refs.form.validate()时一定会给出校验结果


      rules.value.push({
        validator: function validator(rule, value, callback) {
          callback();
        }
      });
      return rules;
    }
  },
  watch: {
    fixedValue: {
      immediate: true,
      handler: function handler(value, oldValue) {
        // computed属性只要返回对象，不管值有没有变化都一定会触发watch
        value !== oldValue && this.$emit('input', value);
      }
    },
    model: {
      immediate: true,
      handler: function handler() {
        // 确保表单初始化后再进行校验，且同一个tick内只校验一次
        if (!this.global.inited || this.formValidated) {
          return;
        }

        this.formValidated = true; // 必须等重新render后再校验，否则form的model数据还是原来的旧值

        this.$nextTick(function () {
          this.formValidated = false;
          this.$refs.form.validate(noop);
        });
      }
    },
    fixedValidateResult: {
      immediate: true,
      handler: function handler(value, oldValue) {
        if (value === oldValue) {
          return;
        }

        this.validateResult = value;
      }
    },
    validateResult: {
      immediate: true,
      handler: function handler(value, oldValue) {
        if (this.isRoot || value === oldValue) {
          return;
        }

        this.$emit('validate', value);
      }
    }
  },
  methods: {
    isHidden: function isHidden(schema) {
      var _context9,
          _this2 = this;

      // 根据schema判断是否需要隐藏
      var expression = schema.hidden;
      var hidden;

      try {
        if (typeof expression === 'string') {
          // 必须要将this.rootData的影响范围降到最小，否则rootData被修改后所有字段的fixedValue都要重新计算
          // eslint-disable-next-line no-unused-vars
          var data = JSON.parse(_babel_runtime_corejs3_core_js_stable_json_stringify__WEBPACK_IMPORTED_MODULE_7___default()(this.global.value)); // eslint-disable-next-line no-eval

          hidden = !!eval(expression);
        } else if (typeof expression === 'function') {
          hidden = !!expression(JSON.parse(_babel_runtime_corejs3_core_js_stable_json_stringify__WEBPACK_IMPORTED_MODULE_7___default()(this.global.value)));
        } else {
          hidden = !!expression;
        }
      } catch (e) {
        hidden = false;
      }

      if (hidden) {
        return hidden;
      }

      switch (schema.type) {
        case 'object':
          // 如果对象的所有属性被隐藏，那该对象也隐藏
          hidden = _babel_runtime_corejs3_core_js_stable_instance_every__WEBPACK_IMPORTED_MODULE_2___default()(_context9 = _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default()(schema.properties)).call(_context9, function (prop) {
            return _this2.isHidden(schema.properties[prop]);
          });
          break;

        case 'array':
          // 如果子元素隐藏的话，该数组也隐藏
          hidden = this.isHidden(schema.items);
          break;
      }

      return hidden;
    },
    onValidate: function onValidate() {
      this.error = (arguments.length <= 2 ? undefined : arguments[2]) || '';
      this.$set(this.validateResult, 'valid', arguments.length <= 1 ? undefined : arguments[1]);
      this.$set(this.validateResult, 'message', (arguments.length <= 2 ? undefined : arguments[2]) || '');
    },
    validate: function validate(callback) {
      // 校验整个表单
      this.$refs.form.validate(noop);
      this.$refs.object && this.$refs.object.validate();
      this.$refs.array && this.$refs.array.validate(); // 根组件

      this.isRoot && this.$nextTick(function () {
        var _context10;

        callback.apply(void 0, _babel_runtime_corejs3_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_1___default()(_babel_runtime_corejs3_core_js_stable_instance_reverse__WEBPACK_IMPORTED_MODULE_0___default()(_context10 = travel(this.validateResult)).call(_context10)));
      });
    }
  },
  created: function created() {
    this.isRoot && this.$nextTick(function () {
      // 整个表单初始化完成
      this.global.inited = true;
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.$emit('destroy');
  }
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(6);
            var content = __webpack_require__(39);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(module.i, content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["a"] = ({
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      required: true
    }
  },
  data: function data() {
    return {
      preview: false // 是否显示预览界面

    };
  },
  methods: {
    onValidateFail: function onValidateFail(reason) {
      reason && this.$emit('input', "validate:".concat(reason));
    },
    onBeforeUpload: function onBeforeUpload(file) {
      if (typeof this.schema.fileValidator !== 'function') {
        return;
      } // 检验失败后不会上传文件


      return this.schema.fileValidator(file, this.onValidateFail);
    },
    onSuccess: function onSuccess(res, file) {
      var url;

      if (typeof this.schema.urlFetcher === 'string') {
        var response = file.response;
        url = eval(this.schema.urlFetcher);
      } else {
        url = this.schema.urlFetcher(file.response);
      }

      this.$refs.upload.clearFiles();
      this.$emit('input', url);
    },
    onPreview: function onPreview() {
      this.preview = true;
    },
    onEdit: function onEdit() {
      this.$refs.box.click();
    },
    onDelete: function onDelete() {
      this.$emit('input', '');
    }
  }
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(6);
            var content = __webpack_require__(41);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(module.i, content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(6);
            var content = __webpack_require__(43);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(module.i, content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(6);
            var content = __webpack_require__(45);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(module.i, content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(6);
            var content = __webpack_require__(47);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(module.i, content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(6);
            var content = __webpack_require__(52);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(module.i, content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(6);
            var content = __webpack_require__(54);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(module.i, content, options);

var exported = content.locals ? content.locals : {};



module.exports = exported;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/core-js-stable/instance/splice");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/core-js-stable/instance/filter");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/core-js-stable/instance/some");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/helpers/slicedToArray");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/regenerator");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/core-js-stable/instance/map");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/core-js-stable/instance/reverse");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/core-js-stable/instance/every");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/core-js-stable/instance/starts-with");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("big.js");

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/helpers/asyncToGenerator");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs3/core-js-stable/instance/slice");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("@tinymce/tinymce-vue");

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/component/base.vue?vue&type=template&id=7f87e988&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "fm-base__root" },
    [
      _vm.schema.type === "string"
        ? [
            _vm.schema.format === "color"
              ? [
                  _vm.schema.enum instanceof Array
                    ? _c("v-enum", {
                        attrs: { schema: _vm.schema, value: _vm.value },
                        on: { input: _vm.$listeners.input }
                      })
                    : _c("el-color-picker", {
                        attrs: {
                          value: _vm.value,
                          "show-alpha": _vm.schema.showAlpha,
                          "color-format": _vm.schema.colorFormat,
                          predefine: _vm.schema.predefine,
                          disabled: _vm.schema.readonly
                        },
                        on: { input: _vm.$listeners.input }
                      })
                ]
              : ["image", "video"].includes(_vm.schema.format)
              ? [
                  _vm.schema.enum instanceof Array
                    ? _c("v-enum", {
                        attrs: { schema: _vm.schema, value: _vm.value },
                        on: { input: _vm.$listeners.input }
                      })
                    : _c("v-image", {
                        attrs: { schema: _vm.schema, value: _vm.value },
                        on: { input: _vm.$listeners.input }
                      })
                ]
              : _vm.schema.format === "file"
              ? [
                  _vm.schema.enum instanceof Array
                    ? _c("v-enum", {
                        attrs: { schema: _vm.schema, value: _vm.value },
                        on: { input: _vm.$listeners.input }
                      })
                    : _c("v-file", {
                        attrs: { schema: _vm.schema, value: _vm.value },
                        on: { input: _vm.$listeners.input }
                      })
                ]
              : ["time", "datetime", "year", "month", "week", "date"].includes(
                  _vm.schema.format
                )
              ? [
                  _vm.schema.enum instanceof Array
                    ? _c("v-enum", {
                        attrs: { schema: _vm.schema, value: _vm.value },
                        on: { input: _vm.$listeners.input }
                      })
                    : _c("v-time", {
                        attrs: { schema: _vm.schema, value: _vm.value },
                        on: { input: _vm.$listeners.input }
                      })
                ]
              : [
                  _vm.schema.enum instanceof Array
                    ? _c("v-enum", {
                        attrs: { schema: _vm.schema, value: _vm.value },
                        on: { input: _vm.$listeners.input }
                      })
                    : _vm.schema.component === "richtext"
                    ? _c("v-richtext", {
                        attrs: { schema: _vm.schema, value: _vm.value },
                        on: { input: _vm.$listeners.input }
                      })
                    : _c("el-input", {
                        attrs: {
                          value: _vm.value,
                          type:
                            _vm.schema.component === "textarea"
                              ? "textarea"
                              : undefined,
                          minlength:
                            typeof _vm.schema.minLength === "number"
                              ? _vm.schema.minLength
                              : undefined,
                          maxlength:
                            typeof _vm.schema.maxLength === "number"
                              ? _vm.schema.maxLength
                              : undefined,
                          readonly: _vm.schema.readonly,
                          placeholder: "请输入内容"
                        },
                        on: { input: _vm.$listeners.input }
                      })
                ]
          ]
        : _vm.schema.type === "number"
        ? [
            _vm.schema.enum instanceof Array
              ? _c("v-enum", {
                  attrs: { schema: _vm.schema, value: _vm.value },
                  on: { input: _vm.$listeners.input }
                })
              : _c("el-input-number", {
                  attrs: {
                    value: _vm.value,
                    min:
                      typeof _vm.schema.minimum === "number"
                        ? _vm.schema.minimum
                        : undefined,
                    max:
                      typeof _vm.schema.maximum === "number"
                        ? _vm.schema.maximum
                        : undefined,
                    step:
                      typeof _vm.schema.multipleOf === "number"
                        ? _vm.schema.multipleOf
                        : undefined,
                    "step-strictly": typeof _vm.schema.multipleOf === "number"
                  },
                  on: { input: _vm.$listeners.input }
                })
          ]
        : _vm.schema.type === "boolean"
        ? [
            _vm.schema.component === "switch"
              ? _c("el-switch", {
                  attrs: { value: _vm.value, disabled: _vm.schema.readonly },
                  on: { input: _vm.$listeners.input }
                })
              : _c("el-checkbox", {
                  attrs: { disabled: _vm.schema.readonly, value: _vm.value },
                  on: { input: _vm.$listeners.input }
                })
          ]
        : _vm.schema.type === "address"
        ? [
            _vm.schema.enum instanceof Array
              ? _c("v-enum", {
                  attrs: { schema: _vm.schema, value: _vm.value },
                  on: { input: _vm.$listeners.input }
                })
              : _c("v-address", {
                  attrs: { schema: _vm.schema, value: _vm.value },
                  on: { input: _vm.$listeners.input }
                })
          ]
        : _vm.schema.type === "range"
        ? [
            _vm.schema.enum instanceof Array
              ? _c("v-enum", {
                  attrs: { schema: _vm.schema, value: _vm.value },
                  on: { input: _vm.$listeners.input }
                })
              : _c("v-time", {
                  attrs: { schema: _vm.schema, value: _vm.value },
                  on: { input: _vm.$listeners.input }
                })
          ]
        : _vm._e()
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./src/component/base.vue?vue&type=template&id=7f87e988&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/component/enum.vue?vue&type=template&id=a929fd28&
var enumvue_type_template_id_a929fd28_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.isSelect
    ? _c(
        "el-select",
        {
          staticClass: "fm-enum__root",
          attrs: {
            value: _vm.fixedValue,
            disabled: _vm.schema.readonly,
            placeholder: "请选择"
          },
          on: {
            input: function($event) {
              return _vm.$listeners.input(
                _vm.isBase ? $event : _vm.schema.enum[$event]
              )
            }
          }
        },
        _vm._l(_vm.schema.enum, function(value, index) {
          return _c(
            "el-option",
            {
              key: index,
              style:
                _vm.schema.type === "string" && _vm.schema.format === "color"
                  ? { background: value }
                  : {},
              attrs: {
                label: _vm.getSelectLabel(index),
                value: _vm.isBase ? value : index
              }
            },
            [
              !(_vm.schema.type === "string" && _vm.schema.format === "color")
                ? [
                    _vm.schema.enumNames && _vm.schema.enumNames[index]
                      ? _c("div", { staticClass: "fm-select__select-item" }, [
                          _c(
                            "span",
                            { staticClass: "fm-select__select-item--left" },
                            [_vm._v(_vm._s(_vm.schema.enumNames[index]))]
                          ),
                          _vm._v(" "),
                          _c(
                            "span",
                            { staticClass: "fm-select__select-item--right" },
                            [_vm._v(_vm._s(_vm.getShowValue(value)))]
                          )
                        ])
                      : _vm._e()
                  ]
                : _vm._e()
            ],
            2
          )
        }),
        1
      )
    : _c(
        "el-radio-group",
        {
          staticClass: "fm-enum__root",
          attrs: { value: _vm.fixedValue, disabled: _vm.schema.readonly },
          on: {
            input: function($event) {
              return _vm.$listeners.input(
                _vm.isBase ? $event : _vm.schema.enum[$event]
              )
            }
          }
        },
        _vm._l(_vm.schema.enum, function(value, index) {
          return _c(
            "el-radio",
            { key: index, attrs: { label: _vm.isBase ? value : index } },
            [
              _vm.schema.type === "string" && _vm.schema.format === "color"
                ? [
                    _vm.schema.enumNames && _vm.schema.enumNames[index]
                      ? _c("span", { style: { color: value } }, [
                          _vm._v(_vm._s(_vm.schema.enumNames[index]))
                        ])
                      : _c("span", {
                          staticClass: "fm-select__color",
                          style: { background: value }
                        })
                  ]
                : _vm.schema.type === "string" &&
                  ["image", "video"].includes(_vm.schema.format)
                ? _c(
                    "el-tooltip",
                    {
                      attrs: {
                        content:
                          _vm.schema.enumNames && _vm.schema.enumNames[index],
                        disabled:
                          !_vm.schema.enumNames || !_vm.schema.enumNames[index],
                        placement: "bottom"
                      }
                    },
                    [
                      _c("v-image", {
                        attrs: {
                          schema: Object.assign({}, _vm.schema, {
                            readonly: true
                          }),
                          value: value
                        }
                      })
                    ],
                    1
                  )
                : _vm.schema.type === "string" &&
                  ["file"].includes(_vm.schema.format)
                ? _c("el-link", { attrs: { href: value, target: "_blank" } }, [
                    _vm._v(
                      _vm._s(
                        (_vm.schema.enumNames && _vm.schema.enumNames[index]) ||
                          value
                      )
                    )
                  ])
                : [
                    _vm.schema.enumNames && _vm.schema.enumNames[index]
                      ? _c(
                          "el-tooltip",
                          {
                            attrs: {
                              content: _vm.getShowValue(value),
                              placement: "bottom"
                            }
                          },
                          [
                            _c("span", [
                              _vm._v(_vm._s(_vm.schema.enumNames[index]))
                            ])
                          ]
                        )
                      : [_vm._v(_vm._s(_vm.getShowValue(value)))]
                  ]
            ],
            2
          )
        }),
        1
      )
}
var enumvue_type_template_id_a929fd28_staticRenderFns = []
enumvue_type_template_id_a929fd28_render._withStripped = true


// CONCATENATED MODULE: ./src/component/enum.vue?vue&type=template&id=a929fd28&

// EXTERNAL MODULE: external "@babel/runtime-corejs3/core-js-stable/json/stringify"
var stringify_ = __webpack_require__(1);
var stringify_default = /*#__PURE__*/__webpack_require__.n(stringify_);

// EXTERNAL MODULE: external "@babel/runtime-corejs3/core-js-stable/instance/find-index"
var find_index_ = __webpack_require__(10);
var find_index_default = /*#__PURE__*/__webpack_require__.n(find_index_);

// EXTERNAL MODULE: external "@babel/runtime-corejs3/core-js-stable/instance/includes"
var includes_ = __webpack_require__(4);
var includes_default = /*#__PURE__*/__webpack_require__.n(includes_);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/component/image.vue?vue&type=template&id=fc5b4300&
var imagevue_type_template_id_fc5b4300_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      class: [
        "fm-image__root",
        { "fm-image--uploaded": _vm.schema.readonly || _vm.value }
      ]
    },
    [
      _c(
        "el-upload",
        {
          ref: "upload",
          attrs: {
            action: _vm.schema.action || "",
            name: _vm.schema.name,
            headers: _vm.schema.headers,
            "with-credentials": _vm.schema.withCredentials,
            accept: _vm.schema.accept,
            "list-type": "picture-card",
            "show-file-list": false,
            "before-upload": _vm.onBeforeUpload,
            "on-success": _vm.onSuccess
          }
        },
        [
          !_vm.schema.readonly && !_vm.value
            ? _c("i", { staticClass: "el-icon-plus" })
            : _c(
                "div",
                { ref: "box", staticClass: "fm-image__box" },
                [
                  _vm.schema.format === "image"
                    ? _c("img", { attrs: { src: _vm.value } })
                    : _c("video", { attrs: { src: _vm.value } }, [
                        _vm._v("您的浏览器不支持 video 标签")
                      ]),
                  _vm._v(" "),
                  _c(
                    "el-row",
                    {
                      attrs: { type: "flex", justify: "center" },
                      nativeOn: {
                        click: function($event) {
                          $event.stopPropagation()
                        }
                      }
                    },
                    [
                      _c("el-col", { attrs: { span: 6 } }, [
                        _c("i", {
                          staticClass: "el-icon-zoom-in",
                          on: { click: _vm.onPreview }
                        })
                      ]),
                      _vm._v(" "),
                      !_vm.schema.readonly
                        ? _c("el-col", { attrs: { span: 6 } }, [
                            _c("i", {
                              staticClass: "el-icon-edit",
                              on: { click: _vm.onEdit }
                            })
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      !_vm.schema.readonly
                        ? _c("el-col", { attrs: { span: 6 } }, [
                            _c("i", {
                              staticClass: "el-icon-delete",
                              on: { click: _vm.onDelete }
                            })
                          ])
                        : _vm._e()
                    ],
                    1
                  )
                ],
                1
              )
        ]
      ),
      _vm._v(" "),
      _c(
        "el-dialog",
        {
          staticClass: "fm-image__preview",
          attrs: { visible: _vm.preview },
          on: {
            "update:visible": function($event) {
              _vm.preview = $event
            }
          }
        },
        [
          _vm.schema.format === "image"
            ? _c("img", { attrs: { width: "100%", src: _vm.value } })
            : _c("video", { attrs: { src: _vm.value, controls: "" } }, [
                _vm._v("您的浏览器不支持 video 标签")
              ])
        ]
      )
    ],
    1
  )
}
var imagevue_type_template_id_fc5b4300_staticRenderFns = []
imagevue_type_template_id_fc5b4300_render._withStripped = true


// CONCATENATED MODULE: ./src/component/image.vue?vue&type=template&id=fc5b4300&

// EXTERNAL MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/component/image.vue?vue&type=script&lang=js&
var imagevue_type_script_lang_js_ = __webpack_require__(14);

// CONCATENATED MODULE: ./src/component/image.vue?vue&type=script&lang=js&
 /* harmony default export */ var component_imagevue_type_script_lang_js_ = (imagevue_type_script_lang_js_["a" /* default */]); 
// EXTERNAL MODULE: ./src/component/image.vue?vue&type=style&index=0&lang=less&
var imagevue_type_style_index_0_lang_less_ = __webpack_require__(40);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/component/image.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  component_imagevue_type_script_lang_js_,
  imagevue_type_template_id_fc5b4300_render,
  imagevue_type_template_id_fc5b4300_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/component/image.vue"
/* harmony default export */ var component_image = (component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/component/enum.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var enumvue_type_script_lang_js_ = ({
  components: {
    VImage: component_image
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      required: true
    }
  },
  computed: {
    isSelect: function isSelect() {
      if (this.schema.component === 'select') {
        var _context2;

        if (this.schema.type === 'string') {
          var _context;

          return !includes_default()(_context = ['image', 'video', 'file']).call(_context, this.schema.format);
        }

        return includes_default()(_context2 = ['number', 'address', 'range']).call(_context2, this.schema.type);
      }

      return false;
    },
    isBase: function isBase() {
      var _context3;

      return !includes_default()(_context3 = ['address', 'range']).call(_context3, this.schema.type);
    },
    fixedValue: function fixedValue() {
      if (!this.isBase) {
        var _context4;

        var index = find_index_default()(_context4 = this).call(_context4, this.schema["enum"], this.value);

        return index !== -1 ? index : undefined;
      }

      return this.value;
    }
  },
  methods: {
    findIndex: function findIndex(list, array) {
      return find_index_default()(list).call(list, function (item) {
        return stringify_default()(item) === stringify_default()(array);
      });
    },
    getSelectLabel: function getSelectLabel(index) {
      return this.schema.enumNames && this.schema.enumNames[index] || this.getShowValue(this.schema["enum"][index]);
    },
    getShowValue: function getShowValue(value) {
      switch (true) {
        case this.schema.type === 'address':
          return value.join(' ');

        case this.schema.type === 'range':
          return value.join(' ～ ');

        default:
          return value;
      }
    }
  }
});
// CONCATENATED MODULE: ./src/component/enum.vue?vue&type=script&lang=js&
 /* harmony default export */ var component_enumvue_type_script_lang_js_ = (enumvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/component/enum.vue?vue&type=style&index=0&lang=less&
var enumvue_type_style_index_0_lang_less_ = __webpack_require__(42);

// CONCATENATED MODULE: ./src/component/enum.vue






/* normalize component */

var enum_component = Object(componentNormalizer["a" /* default */])(
  component_enumvue_type_script_lang_js_,
  enumvue_type_template_id_a929fd28_render,
  enumvue_type_template_id_a929fd28_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var enum_api; }
enum_component.options.__file = "src/component/enum.vue"
/* harmony default export */ var component_enum = (enum_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/component/file.vue?vue&type=template&id=09fea732&
var filevue_type_template_id_09fea732_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.schema.readonly
    ? _c(
        "el-link",
        {
          staticClass: "fm-file__root",
          attrs: { href: _vm.value, target: "_blank" }
        },
        [_vm._v(_vm._s(_vm.value))]
      )
    : _c(
        "el-upload",
        {
          ref: "upload",
          staticClass: "fm-file__root",
          attrs: {
            action: _vm.schema.action,
            name: _vm.schema.name,
            headers: _vm.schema.headers,
            "with-credentials": _vm.schema.withCredentials,
            accept: _vm.schema.accept,
            "file-list": _vm.list,
            "before-upload": _vm.onBeforeUpload,
            "on-success": _vm.onSuccess,
            "on-remove": _vm.onDelete
          }
        },
        [
          _c("el-button", { attrs: { size: "small", type: "primary" } }, [
            _vm._v("点击上传")
          ])
        ],
        1
      )
}
var filevue_type_template_id_09fea732_staticRenderFns = []
filevue_type_template_id_09fea732_render._withStripped = true


// CONCATENATED MODULE: ./src/component/file.vue?vue&type=template&id=09fea732&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/component/file.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var filevue_type_script_lang_js_ = ({
  props: {
    schema: {
      required: true,
      type: Object
    },
    value: {
      required: true,
      type: String
    }
  },
  data: function data() {
    return {
      list: []
    };
  },
  methods: {
    onValidateFail: function onValidateFail(reason) {
      reason && this.$emit('input', "validate:".concat(reason));
    },
    onBeforeUpload: function onBeforeUpload(file) {
      if (typeof this.schema.fileValidator !== 'function') {
        return;
      } // 检验失败后不会上传文件


      return this.schema.fileValidator(file, this.onValidateFail);
    },
    onSuccess: function onSuccess(res, file) {
      var url = this.schema.urlFetcher(file.response);
      this.$refs.upload.clearFiles();
      this.list = [{
        name: file.name,
        url: url
      }];
      this.$emit('input', url);
    },
    onDelete: function onDelete() {
      this.$emit('input', '');
    }
  }
});
// CONCATENATED MODULE: ./src/component/file.vue?vue&type=script&lang=js&
 /* harmony default export */ var component_filevue_type_script_lang_js_ = (filevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/component/file.vue?vue&type=style&index=0&lang=less&
var filevue_type_style_index_0_lang_less_ = __webpack_require__(44);

// CONCATENATED MODULE: ./src/component/file.vue






/* normalize component */

var file_component = Object(componentNormalizer["a" /* default */])(
  component_filevue_type_script_lang_js_,
  filevue_type_template_id_09fea732_render,
  filevue_type_template_id_09fea732_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var file_api; }
file_component.options.__file = "src/component/file.vue"
/* harmony default export */ var file = (file_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/component/address.vue?vue&type=template&id=7c2ee54e&
var addressvue_type_template_id_7c2ee54e_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.addressList
    ? _c(
        "div",
        { staticClass: "fm-address__root" },
        [
          _c("el-cascader", {
            attrs: {
              options: _vm.addressList,
              props: { expandTrigger: "hover" },
              filterable: true,
              disabled: _vm.schema.readonly
            },
            model: {
              value: _vm.address,
              callback: function($$v) {
                _vm.address = $$v
              },
              expression: "address"
            }
          }),
          _vm._v(" "),
          _vm.format === "detail"
            ? _c("el-input", {
                attrs: {
                  type: "textarea",
                  rows: 2,
                  maxlength: _vm.schema.maxLength,
                  minlength: _vm.schema.minLength,
                  "show-word-limit": typeof _vm.schema.maxLength === "number",
                  readonly: _vm.schema.readonly,
                  placeholder: "请输入地址详情"
                },
                model: {
                  value: _vm.detail,
                  callback: function($$v) {
                    _vm.detail = $$v
                  },
                  expression: "detail"
                }
              })
            : _vm._e()
        ],
        1
      )
    : _vm._e()
}
var addressvue_type_template_id_7c2ee54e_staticRenderFns = []
addressvue_type_template_id_7c2ee54e_render._withStripped = true


// CONCATENATED MODULE: ./src/component/address.vue?vue&type=template&id=7c2ee54e&

// EXTERNAL MODULE: external "@babel/runtime-corejs3/core-js-stable/object/keys"
var keys_ = __webpack_require__(3);
var keys_default = /*#__PURE__*/__webpack_require__.n(keys_);

// EXTERNAL MODULE: external "@babel/runtime-corejs3/core-js-stable/instance/for-each"
var for_each_ = __webpack_require__(2);
var for_each_default = /*#__PURE__*/__webpack_require__.n(for_each_);

// EXTERNAL MODULE: external "@babel/runtime-corejs3/regenerator"
var regenerator_ = __webpack_require__(25);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator_);

// EXTERNAL MODULE: external "@babel/runtime-corejs3/helpers/asyncToGenerator"
var asyncToGenerator_ = __webpack_require__(31);
var asyncToGenerator_default = /*#__PURE__*/__webpack_require__.n(asyncToGenerator_);

// EXTERNAL MODULE: external "@babel/runtime-corejs3/helpers/toConsumableArray"
var toConsumableArray_ = __webpack_require__(5);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray_);

// EXTERNAL MODULE: external "@babel/runtime-corejs3/core-js-stable/instance/slice"
var slice_ = __webpack_require__(32);
var slice_default = /*#__PURE__*/__webpack_require__.n(slice_);

// EXTERNAL MODULE: external "@babel/runtime-corejs3/core-js-stable/instance/filter"
var filter_ = __webpack_require__(22);
var filter_default = /*#__PURE__*/__webpack_require__.n(filter_);

// EXTERNAL MODULE: external "axios"
var external_axios_ = __webpack_require__(33);
var external_axios_default = /*#__PURE__*/__webpack_require__.n(external_axios_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/component/address.vue?vue&type=script&lang=js&







//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var axiosInstance = external_axios_default.a.create();
axiosInstance.interceptors.response.use(function (response) {
  return response.data;
});
/* harmony default export */ var addressvue_type_script_lang_js_ = ({
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      required: true,
      type: Array
    }
  },
  data: function data() {
    return {
      addressList: undefined
    };
  },
  computed: {
    format: function format() {
      return this.schema.format || 'detail';
    },
    filter: function filter() {
      // 是否过滤特殊地区
      return filter_default()(this.schema) !== undefined ? !!filter_default()(this.schema) : true;
    },
    address: {
      get: function get() {
        var value = this.value || [];
        return slice_default()(value).call(value, 0, {
          province: 1,
          city: 2,
          area: 3,
          detail: 3
        }[this.format]);
      },
      set: function set(address) {
        var value = toConsumableArray_default()(address);

        this.format === 'detail' && value.push(this.detail);
        this.$emit('input', value);
      }
    },
    detail: {
      get: function get() {
        return this.value && this.value[3] || '';
      },
      set: function set(detail) {
        var value = toConsumableArray_default()(this.value);

        value[3] = detail;
        this.$emit('input', value);
      }
    }
  },
  methods: {
    getAddress: function () {
      var _getAddress = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee() {
        var address;
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return axiosInstance.get("//shequwsdl.vivo.com.cn/shequ/address_".concat(filter_default()(this) ? 'filter' : 'full', ".json"));

              case 2:
                address = _context.sent;
                this.addressList = this.formatAddress(address);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getAddress() {
        return _getAddress.apply(this, arguments);
      }

      return getAddress;
    }(),
    formatAddress: function formatAddress(address) {
      var _this = this;

      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // 格式化地址数据
      var data = [];
      var target = {
        province: 0,
        city: 1,
        area: 2,
        detail: 2
      }[this.format];

      if (address instanceof Array) {
        for_each_default()(address).call(address, function (value) {
          data.push({
            label: value,
            value: value
          });
        });
      } else {
        var _context2;

        for_each_default()(_context2 = keys_default()(address)).call(_context2, function (value) {
          var item = {
            label: value,
            value: value
          };

          if (level < target) {
            item.children = _this.formatAddress(address[value], level + 1);
          }

          data.push(item);
        });
      }

      return data;
    }
  },
  created: function created() {
    var _this2 = this;

    typeof this.schema.fetcher === 'function' ? this.schema.fetcher(function (address) {
      _this2.addressList = address;
    }) : this.getAddress();
  }
});
// CONCATENATED MODULE: ./src/component/address.vue?vue&type=script&lang=js&
 /* harmony default export */ var component_addressvue_type_script_lang_js_ = (addressvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/component/address.vue?vue&type=style&index=0&lang=less&
var addressvue_type_style_index_0_lang_less_ = __webpack_require__(46);

// CONCATENATED MODULE: ./src/component/address.vue






/* normalize component */

var address_component = Object(componentNormalizer["a" /* default */])(
  component_addressvue_type_script_lang_js_,
  addressvue_type_template_id_7c2ee54e_render,
  addressvue_type_template_id_7c2ee54e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var address_api; }
address_component.options.__file = "src/component/address.vue"
/* harmony default export */ var component_address = (address_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/component/time.vue?vue&type=template&id=a9f40d90&
var timevue_type_template_id_a9f40d90_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.schema.format === "time"
    ? _c("el-time-picker", {
        staticClass: "fm-time__root",
        attrs: {
          "is-range": _vm.schema.type === "range",
          "value-format": _vm.schema.valueFormat,
          "picker-options": _vm.pickerOptions,
          readonly: _vm.schema.readonly,
          placeholder: "选择时间",
          "start-placeholder": "开始时间",
          "end-placeholder": "结束时间"
        },
        model: {
          value: _vm.time,
          callback: function($$v) {
            _vm.time = $$v
          },
          expression: "time"
        }
      })
    : _c("el-date-picker", {
        staticClass: "fm-time__root",
        attrs: {
          type:
            _vm.schema.type === "range" &&
            ["datetime", "month", "date"].includes(_vm.schema.format)
              ? _vm.schema.format + "range"
              : _vm.schema.format,
          format: _vm.schema.valueFormat,
          "value-format":
            _vm.schema.format !== "week" ? _vm.schema.valueFormat : undefined,
          "unlink-panels": true,
          "picker-options": _vm.pickerOptions,
          readonly: _vm.schema.readonly,
          placeholder: "选择时间",
          "start-placeholder": "开始时间",
          "end-placeholder": "结束时间"
        },
        model: {
          value: _vm.time,
          callback: function($$v) {
            _vm.time = $$v
          },
          expression: "time"
        }
      })
}
var timevue_type_template_id_a9f40d90_staticRenderFns = []
timevue_type_template_id_a9f40d90_render._withStripped = true


// CONCATENATED MODULE: ./src/component/time.vue?vue&type=template&id=a9f40d90&

// EXTERNAL MODULE: external "@babel/runtime-corejs3/core-js-stable/instance/map"
var map_ = __webpack_require__(26);
var map_default = /*#__PURE__*/__webpack_require__.n(map_);

// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__(11);
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/component/time.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var timevue_type_script_lang_js_ = ({
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      required: true
    }
  },
  data: function data() {
    var options = {};

    if (this.schema.format === 'time') {
      // if (this.schema.selectableRange) {
      //   options.selectableRange = this.schema.selectableRange
      // }
      if (this.schema.valueFormat) {
        options.format = this.schema.valueFormat;
      }
    } else {
      /**
       * 不管firstDayOfWeek设置多少，实际上算出来的周数始终是以周一为一周的开始，跟ISO8061一致
       * 为了界面显示一致，故将firstDayOfWeek设为1
       */
      options.firstDayOfWeek = 1; // options.disabledDate = function (time) {
      //   // console.log(time)
      //   return false
      // }
    }

    return {
      pickerOptions: options
    };
  },
  computed: {
    momentFormat: function momentFormat() {
      // 将element-ui的日期格式转换成moment格式
      return this.schema.valueFormat.replace(/y/g, 'Y').replace(/d/g, 'D');
    },
    time: {
      get: function get() {
        var _this = this;

        var value = this.schema.type === 'range' ? this.value ? toConsumableArray_default()(this.value) : [] : this.value || ''; // week类型的value-format只能是Date对象

        if (this.schema.format === 'week') {
          if (value instanceof Array) {
            value = map_default()(value).call(value, function (item) {
              return item && external_moment_default()(item, _this.momentFormat).toDate();
            });
          } else {
            value = value && external_moment_default()(value, this.momentFormat).toDate();
          }
        }

        return value;
      },
      set: function set(time) {
        var _this2 = this;

        var value = this.schema.type === 'range' ? toConsumableArray_default()(time || []) : time || '';

        if (this.schema.format === 'week') {
          if (value instanceof Array) {
            value = map_default()(value).call(value, function (item) {
              return item && external_moment_default()(item).format(_this2.momentFormat);
            });
          } else {
            value = value && external_moment_default()(value).format(this.momentFormat);
          }
        }

        this.$emit('input', value);
      }
    }
  }
});
// CONCATENATED MODULE: ./src/component/time.vue?vue&type=script&lang=js&
 /* harmony default export */ var component_timevue_type_script_lang_js_ = (timevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/component/time.vue





/* normalize component */

var time_component = Object(componentNormalizer["a" /* default */])(
  component_timevue_type_script_lang_js_,
  timevue_type_template_id_a9f40d90_render,
  timevue_type_template_id_a9f40d90_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var time_api; }
time_component.options.__file = "src/component/time.vue"
/* harmony default export */ var component_time = (time_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/component/richtext/index.vue?vue&type=template&id=f1c8b312&
var richtextvue_type_template_id_f1c8b312_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("tinymce-editor", {
    attrs: { value: _vm.value, init: _vm.config },
    on: { input: _vm.$listeners.input }
  })
}
var richtextvue_type_template_id_f1c8b312_staticRenderFns = []
richtextvue_type_template_id_f1c8b312_render._withStripped = true


// CONCATENATED MODULE: ./src/component/richtext/index.vue?vue&type=template&id=f1c8b312&

// EXTERNAL MODULE: external "tinymce/tinymce"
var tinymce_ = __webpack_require__(48);

// EXTERNAL MODULE: external "tinymce/themes/silver"
var silver_ = __webpack_require__(49);

// EXTERNAL MODULE: external "@tinymce/tinymce-vue"
var tinymce_vue_ = __webpack_require__(34);
var tinymce_vue_default = /*#__PURE__*/__webpack_require__.n(tinymce_vue_);

// EXTERNAL MODULE: ./src/component/richtext/generate-resource.js
var generate_resource = __webpack_require__(50);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/component/richtext/index.vue?vue&type=script&lang=js&
//
//
//
//



 // 生成tinymce的资源

/* harmony default export */ var richtextvue_type_script_lang_js_ = ({
  components: {
    TinymceEditor: tinymce_vue_default.a
  },
  props: {
    schema: {
      required: true,
      type: Object
    },
    value: {
      required: true
    }
  },
  data: function data() {
    return {
      config: {
        height: 300,
        skin: window.matchMedia("(prefers-color-scheme: dark)").matches ? "oxide-dark" : "",
        content_css: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "",
        // skin_url: '/tinymce'
        language: 'zh_CN',
        plugins: ['advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker', 'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking', 'save table contextmenu directionality emoticons template paste textcolor'],
        paste_data_images: true,
        images_upload_handler: this.schema.uploader,
        file_picker_types: 'file image media',
        file_picker_callback: function file_picker_callback(callback, value, meta) {
          var input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', '*/*');
          /*
            Note: In modern browsers input[type="file"] is functional without
            even adding it to the DOM, but that might not be the case in some older
            or quirky browsers like IE, so you might want to add it to the DOM
            just in case, and visually hide it. And do not forget do remove it
            once you do not need it anymore.
          */

          input.onchange = function () {
            var file = this.files[0];
            var reader = new FileReader();

            reader.onload = function () {
              /*
                Note: Now we need to register the blob in TinyMCEs image blob
                registry. In the next release this part hopefully won't be
                necessary, as we are looking to handle it internally.
              */
              var id = 'blobid' + new Date().getTime();
              var blobCache = tinymce.activeEditor.editorUpload.blobCache;
              var base64 = reader.result.split(',')[1];
              var blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);
              /* call the callback and populate the Title field with the file name */

              callback(blobInfo.blobUri(), {
                title: file.name
              });
            };

            reader.readAsDataURL(file);
          };

          input.click();
        }
      }
    };
  }
});
// CONCATENATED MODULE: ./src/component/richtext/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var component_richtextvue_type_script_lang_js_ = (richtextvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/component/richtext/index.vue





/* normalize component */

var richtext_component = Object(componentNormalizer["a" /* default */])(
  component_richtextvue_type_script_lang_js_,
  richtextvue_type_template_id_f1c8b312_render,
  richtextvue_type_template_id_f1c8b312_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var richtext_api; }
richtext_component.options.__file = "src/component/richtext/index.vue"
/* harmony default export */ var richtext = (richtext_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/component/base.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ var basevue_type_script_lang_js_ = ({
  components: {
    VEnum: component_enum,
    VImage: component_image,
    VFile: file,
    VAddress: component_address,
    VTime: component_time,
    VRichtext: richtext
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      required: true
    }
  }
});
// CONCATENATED MODULE: ./src/component/base.vue?vue&type=script&lang=js&
 /* harmony default export */ var component_basevue_type_script_lang_js_ = (basevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/component/base.vue





/* normalize component */

var base_component = Object(componentNormalizer["a" /* default */])(
  component_basevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var base_api; }
base_component.options.__file = "src/component/base.vue"
/* harmony default export */ var base = __webpack_exports__["a"] = (base_component.exports);

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/component/array.vue?vue&type=template&id=613b787e&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "fm-array__root" },
    _vm._l(_vm.value, function(item, index) {
      return _c(
        "el-row",
        {
          key: index,
          attrs: { type: "flex", justify: "space-between", align: "middle" }
        },
        [
          _c(
            "el-col",
            { attrs: { span: 20 } },
            [
              _c("v-item", {
                ref: "items",
                refInFor: true,
                attrs: { schema: _vm.schema.items, value: _vm.value[index] },
                on: {
                  input: function($event) {
                    $event !== _vm.value[index] &&
                      _vm.$set(_vm.value, index, $event)
                  },
                  validate: function($event) {
                    return _vm.$emit("validate", index, $event)
                  },
                  destroy: function($event) {
                    return _vm.$emit("destroy", index)
                  }
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-col",
            { staticClass: "fm-array__delete", attrs: { span: 3 } },
            [
              _c(
                "el-button",
                {
                  attrs: { type: "danger" },
                  on: {
                    click: function($event) {
                      return _vm.onDelete(index)
                    }
                  }
                },
                [_vm._v("删除")]
              )
            ],
            1
          )
        ],
        1
      )
    }),
    1
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./src/component/array.vue?vue&type=template&id=613b787e&

// EXTERNAL MODULE: external "@babel/runtime-corejs3/core-js-stable/instance/for-each"
var for_each_ = __webpack_require__(2);
var for_each_default = /*#__PURE__*/__webpack_require__.n(for_each_);

// EXTERNAL MODULE: external "@babel/runtime-corejs3/core-js-stable/instance/splice"
var splice_ = __webpack_require__(21);
var splice_default = /*#__PURE__*/__webpack_require__.n(splice_);

// EXTERNAL MODULE: external "@babel/runtime-corejs3/helpers/typeof"
var typeof_ = __webpack_require__(9);
var typeof_default = /*#__PURE__*/__webpack_require__.n(typeof_);

// EXTERNAL MODULE: external "@babel/runtime-corejs3/core-js-stable/json/stringify"
var stringify_ = __webpack_require__(1);
var stringify_default = /*#__PURE__*/__webpack_require__.n(stringify_);

// EXTERNAL MODULE: ./src/component/item.vue + 3 modules
var item = __webpack_require__(8);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/component/array.vue?vue&type=script&lang=js&




//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var arrayvue_type_script_lang_js_ = ({
  components: {
    VItem: function VItem(resolve) {
      resolve(item["a" /* default */]);
    }
  },
  props: {
    schema: {
      required: true,
      type: Object
    },
    value: {
      required: true,
      type: Array
    }
  },
  methods: {
    onAdd: function onAdd() {
      var _this$schema$items = this.schema.items,
          type = _this$schema$items.type,
          defaultValue = _this$schema$items["default"];
      var value; // 拷贝默认值

      if (defaultValue !== undefined) {
        defaultValue = JSON.parse(stringify_default()(defaultValue));
      }

      switch (type) {
        case 'object':
          value = defaultValue || {};
          break;

        case 'array':
        case 'address':
        case 'range':
          value = defaultValue instanceof Array ? defaultValue : [];
          break;

        default:
          // eslint-disable-next-line valid-typeof
          value = typeof_default()(defaultValue) === type ? defaultValue : undefined;
      }

      this.value.push(value);
    },
    onDelete: function onDelete(index) {
      var _context;

      splice_default()(_context = this.value).call(_context, index, 1);
    },
    validate: function validate() {
      var _context2;

      // 校验整个表单
      ;

      for_each_default()(_context2 = this.$refs.items || []).call(_context2, function (item) {
        item.validate();
      });
    }
  }
});
// CONCATENATED MODULE: ./src/component/array.vue?vue&type=script&lang=js&
 /* harmony default export */ var component_arrayvue_type_script_lang_js_ = (arrayvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/component/array.vue?vue&type=style&index=0&lang=less&
var arrayvue_type_style_index_0_lang_less_ = __webpack_require__(38);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/component/array.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  component_arrayvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/component/array.vue"
/* harmony default export */ var array = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/component/object.vue?vue&type=template&id=50af77ea&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "fm-object__root" },
    [
      _vm._l(_vm.schema.properties, function(propSchema, prop) {
        return [
          _vm.value.hasOwnProperty(prop)
            ? _c("v-item", {
                key: prop,
                ref: "properties",
                refInFor: true,
                attrs: {
                  schema: propSchema,
                  required:
                    (_vm.schema.required &&
                      _vm.schema.required.includes(prop)) ||
                    (propSchema.type === "array" && !!propSchema.minItems)
                },
                on: {
                  validate: function($event) {
                    return _vm.$emit("validate", prop, $event)
                  },
                  destroy: function($event) {
                    return _vm.$emit("destroy", prop)
                  }
                },
                model: {
                  value: _vm.value[prop],
                  callback: function($$v) {
                    _vm.$set(_vm.value, prop, $$v)
                  },
                  expression: "value[prop]"
                }
              })
            : _vm._e()
        ]
      })
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./src/component/object.vue?vue&type=template&id=50af77ea&

// EXTERNAL MODULE: external "@babel/runtime-corejs3/core-js-stable/instance/for-each"
var for_each_ = __webpack_require__(2);
var for_each_default = /*#__PURE__*/__webpack_require__.n(for_each_);

// EXTERNAL MODULE: ./src/component/item.vue + 3 modules
var item = __webpack_require__(8);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/component/object.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var objectvue_type_script_lang_js_ = ({
  components: {
    VItem: function VItem(resolve) {
      resolve(item["a" /* default */]);
    }
  },
  props: {
    schema: {
      required: true,
      type: Object
    },
    value: {
      required: true,
      type: Object
    }
  },
  methods: {
    validate: function validate() {
      var _context;

      // 校验整个表单
      ;

      for_each_default()(_context = this.$refs.properties || []).call(_context, function (item) {
        item.validate();
      });
    }
  }
});
// CONCATENATED MODULE: ./src/component/object.vue?vue&type=script&lang=js&
 /* harmony default export */ var component_objectvue_type_script_lang_js_ = (objectvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/component/object.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  component_objectvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/component/object.vue"
/* harmony default export */ var object = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_array_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_array_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_array_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_array_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(7);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".fm-array__delete {\n  padding-right: 42px;\n  text-align: right;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_image_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_image_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_image_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_image_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(7);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".fm-image--uploaded.fm-image__root .el-upload {\n  border: none;\n}\n.fm-image__box {\n  position: relative;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  border: 1px solid #c0ccda;\n  border-radius: 6px;\n  height: 100%;\n}\n.fm-image__box img {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  max-width: 100%;\n  max-height: 100%;\n}\n.fm-image__box video {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n.fm-image__box > div {\n  position: absolute;\n  left: -1px;\n  right: -1px;\n  top: -1px;\n  bottom: -1px;\n  border-radius: 6px;\n  background: rgba(0, 0, 0, 0.5);\n  opacity: 0;\n  -webkit-transition: opacity 0.3s;\n  -o-transition: opacity 0.3s;\n  transition: opacity 0.3s;\n}\n.fm-image__box > div:hover {\n  opacity: 1;\n}\n.fm-image__box > div i {\n  color: #fff;\n  font-size: 20px;\n}\n.fm-image__preview video {\n  display: block;\n  outline: none;\n  width: 100%;\n  max-height: 500px;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_enum_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_enum_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_enum_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_enum_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(7);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".fm-enum__root .el-radio {\n  margin-top: 5px;\n  margin-bottom: 5px;\n  font-size: 0;\n}\n.fm-enum__root .el-radio .el-radio__label {\n  display: inline-block;\n  vertical-align: middle;\n}\n.fm-enum__select-item {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: justify;\n  -webkit-justify-content: space-between;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n}\n.fm-enum__select-item--right {\n  margin-left: 2em;\n  color: #8492a6;\n}\n.fm-enum__color {\n  display: inline-block;\n  vertical-align: middle;\n  width: 20px;\n  height: 20px;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_file_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_file_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_file_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_file_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(7);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".fm-file__root .el-upload {\n  float: left;\n}\n.fm-file__root .el-upload-list {\n  margin-left: 100px;\n  height: 32px;\n}\n.fm-file__root .el-upload-list .el-upload-list__item {\n  margin-top: 0 !important;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_address_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_address_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_address_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_address_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(7);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".fm-address__root .el-cascader > .el-input {\n  width: 50%;\n  min-width: 300px;\n}\n.fm-address__root .el-textarea {\n  margin-top: 15px;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = require("tinymce/tinymce");

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("tinymce/themes/silver");

/***/ }),
/* 50 */
/***/ (function(module, exports) {

// 生成插件
require.context('!!file-loader?name=[path][name].[ext]&context=node_modules/tinymce!tinymce/plugins', true, /.*/); // 生成皮肤


require.context('!!file-loader?name=[path][name].[ext]&context=node_modules/tinymce!tinymce/skins', true, /.*/); // 生成语言


require.context('!!file-loader?name=[path][name].[ext]&context=node_modules/vcform/src/component/richtext!vcform/src/component/richtext/langs', true, /.*/);

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_item_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_item_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_item_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_item_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(7);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".fm-item__root.fm-item--combined:not(.fm-item--root) {\n  margin: 5px 5px 5px 0;\n  border: 1px solid #dcdfe6;\n  border-radius: 5px;\n  overflow: hidden;\n}\n.fm-item__root.fm-item--combined:not(.fm-item--root):hover {\n  border-color: #c0c4cc;\n}\n.fm-item__root.fm-item--combined:not(.fm-item--root).fm-item--invalid {\n  border-color: #f56c6c;\n}\n.fm-item__root.fm-item--combined:not(.fm-item--root) + .fm-item__root {\n  margin-top: 25px;\n}\n.fm-item__root.fm-item--combined > .el-form-item {\n  margin-bottom: 0;\n}\n.fm-item__root .el-collapse {\n  border: none;\n}\n.fm-item__root .el-collapse .el-collapse-item.is-disabled > div > .el-collapse-item__header {\n  cursor: default;\n}\n.fm-item__root .el-collapse .el-collapse-item.is-disabled > div > .el-collapse-item__header .el-collapse-item__arrow {\n  display: none;\n}\n.fm-item__root .el-collapse .el-collapse-item__header {\n  border-bottom-color: #ebeef5;\n  margin-bottom: 1em;\n  padding: 0.2em 0;\n  height: auto;\n  color: inherit;\n  font-size: inherit;\n  line-height: inherit;\n  cursor: pointer;\n}\n.fm-item__root .el-collapse:not(.fm-item--root) > .el-collapse-item > .el-collapse-item__wrap > .el-collapse-item__content {\n  margin-left: 2em;\n  font-size: inherit;\n}\n.fm-item__root .el-collapse .el-collapse-item__wrap {\n  border: none;\n}\n.fm-item__root .el-collapse .el-collapse-item__wrap .el-collapse-item__content {\n  padding-bottom: 0;\n}\n.fm-item__root .el-form-item__error--inline {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  margin-left: 0;\n  padding-left: 1em;\n  width: 30%;\n}\n.fm-item__header {\n  -webkit-box-flex: 1;\n  -webkit-flex: auto;\n      -ms-flex: auto;\n          flex: auto;\n  font-weight: normal;\n}\n.fm-item__label {\n  display: inline-block;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  padding-right: 12px;\n  text-align: right;\n}\n.fm-item__label::before {\n  content: attr(data-required);\n  margin-right: 4px;\n  color: #f56c6c;\n}\n.fm-item__description {\n  font-size: 0.8em;\n  font-weight: bold;\n}\n.fm-item__description--content {\n  margin-top: 0.6em;\n  line-height: 1;\n}\n.fm-item__error {\n  color: #f56c6c;\n}\n.fm-item__add {\n  padding-right: 20px;\n  text-align: right;\n}\n.fm-item__content {\n  float: left;\n  width: 70%;\n}\n.fm-item__content--valid .el-input__inner,\n.fm-item__content--valid .el-textarea__inner {\n  border-color: #dcdfe6 !important;\n}\n.fm-item__content--valid .el-input__inner:hover,\n.fm-item__content--valid .el-textarea__inner:hover {\n  border-color: #c0c4cc !important;\n}\n.fm-item__content--valid .el-input__inner:focus,\n.fm-item__content--valid .el-textarea__inner:focus {\n  border-color: #409eff !important;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_ref_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_less___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(7);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".fm__body {\n  text-align: left;\n}\n.fm__footer {\n  margin-top: 20px;\n  text-align: center;\n}\n.fm__footer .el-button + .el-button {\n  margin-left: 30px;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/index.vue?vue&type=template&id=2964abc9&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "fm__root" },
    [
      _c("v-item", {
        ref: "form",
        staticClass: "fm__body",
        attrs: { schema: _vm.schema, "label-width": _vm.labelWidth },
        model: {
          value: _vm.value,
          callback: function($$v) {
            _vm.value = $$v
          },
          expression: "value"
        }
      }),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "fm__footer" },
        [
          _c(
            "el-button",
            { attrs: { type: "primary" }, on: { click: _vm.onConfirm } },
            [_vm._v("确定")]
          ),
          _vm._v(" "),
          _c(
            "el-button",
            { attrs: { type: "warning" }, on: { click: _vm.onReset } },
            [_vm._v("重置")]
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./src/index.vue?vue&type=template&id=2964abc9&

// EXTERNAL MODULE: external "@babel/runtime-corejs3/core-js-stable/json/stringify"
var stringify_ = __webpack_require__(1);
var stringify_default = /*#__PURE__*/__webpack_require__.n(stringify_);

// EXTERNAL MODULE: ./src/component/item.vue + 3 modules
var item = __webpack_require__(8);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/index.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var lib_vue_loader_options_srcvue_type_script_lang_js_ = ({
  components: {
    VItem: item["a" /* default */]
  },
  props: {
    schema: {
      required: true,
      type: Object
    },
    submit: {
      required: true,
      type: Function
    },
    labelWidth: {
      type: Number
    }
  },
  data: function data() {
    return {
      value: undefined
    };
  },
  methods: {
    onConfirm: function onConfirm() {
      var _this = this;

      this.$refs.form.validate(function (valid, detail) {
        valid && _this.submit(JSON.parse(stringify_default()(_this.value)));
      });
    },
    onReset: function onReset() {
      this.value = undefined;
    }
  }
});
// CONCATENATED MODULE: ./src/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var srcvue_type_script_lang_js_ = (lib_vue_loader_options_srcvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/index.vue?vue&type=style&index=0&lang=less&
var srcvue_type_style_index_0_lang_less_ = __webpack_require__(53);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/index.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  srcvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/index.vue"
/* harmony default export */ var src = __webpack_exports__["default"] = (component.exports);

/***/ })
/******/ ])["default"];
});