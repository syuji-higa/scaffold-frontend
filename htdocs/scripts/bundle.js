/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _instance = __webpack_require__(1);

var _sample = __webpack_require__(4);

var _sample2 = _interopRequireDefault(_sample);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

if (typeof NS !== 'undefined') {
  throw new Error('namespace "NS" is already exists.');
}
window.NS = {};

window.addEventListener('DOMContentLoaded', function () {

  var _modules = [[_sample2.default, '.js-sample']];

  var _singleModules = [[_sample2.default, '.js-sample']];

  _modules.forEach(function (arr) {
    _instance.createInstance.apply(undefined, _toConsumableArray(arr));
  });

  _singleModules.forEach(function (arr) {
    _instance.createSingleInstance.apply(undefined, _toConsumableArray(arr));
  });
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSingleInstance = exports.createInstance = undefined;

var _type2 = __webpack_require__(2);

var _element = __webpack_require__(3);

/**
 * incetance
 */

/**
 * @param {Class} Cls
 * @param {string} selector
 * @param {...*} [opts]
 * @return {Array<Instance>}
 */
var createInstance = exports.createInstance = function createInstance(Cls, selector) {
  for (var _len = arguments.length, opts = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    opts[_key - 2] = arguments[_key];
  }

  var _el = (0, _element.getElement)(selector);
  if (!_el) return null;
  if (_el instanceof HTMLCollection || _el instanceof NodeList) {
    var _instances = [];
    Array.from(_el, function ($el) {
      var _arg = [$el];
      if (opts) _arg.push.apply(_arg, opts);
      _instances.push(new (Function.prototype.bind.apply(Cls, [null].concat(_arg)))());
    });
    return _instances;
  } else if (_el instanceof HTMLElement) {
    return new (Function.prototype.bind.apply(Cls, [null].concat([_el, opts])))();
  }
};

/**
 * @param {Class} Cls
 * @param {string} selector
 * @param {...*} [opts]
 * @return {Instance}
 */
var createSingleInstance = exports.createSingleInstance = function createSingleInstance(Cls, selector) {
  for (var _len2 = arguments.length, opts = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    opts[_key2 - 2] = arguments[_key2];
  }

  var _el = (0, _element.getElement)(selector);
  var _type = (0, _type2.getType)(_el);
  if (!_el || !_type.match(/^(HTMLCollection|NodeList)$/) || !_el.length) return;
  var _arg = [_el];
  if (opts) _arg.push.apply(_arg, opts);
  return new (Function.prototype.bind.apply(Cls, [null].concat(_arg)))();
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * index
 */

var toString = Object.prototype.toString;

/**
 * @param {*} target
 * @return {string}
 */
var getType = exports.getType = function getType(target) {
  var _strs = toString.call(target).match(/^\[object (.+)\]$/);
  if (!_strs) return;
  var _type = _strs[1];
  var _elStrs = _type.match(/^HTML.+Element$/);
  return _elStrs ? 'Element' : _type;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * element
 */

/**
 * @param {string} str
 * @param {Element} [$el]
 */
var getElement = exports.getElement = function getElement(str) {
  var $el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

  if (str.match(/^\#[^\s]+$/)) {
    return $el.getElementById(str.replace('#', ''));
  }
  if (str.match(/^\.[^\s]+$/)) {
    return $el.getElementsByClassName(str.replace('.', ''));
  }
  if (str.match(/^[^\s]+$/)) {
    return $el.getElementsByTagName(str);
  }
  return $el.querySelectorAll(str);
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sample = function () {
  function Sample() {
    _classCallCheck(this, Sample);

    console.log('ok');
  }

  _createClass(Sample, [{
    key: 'say',
    value: function say() {
      return 'Hello World';
    }
  }]);

  return Sample;
}();

exports.default = Sample;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map