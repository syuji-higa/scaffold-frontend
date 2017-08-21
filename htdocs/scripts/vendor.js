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
// import 'babel-polyfill/dist/polyfill.min';
// import 'classList';  // https://github.com/eligrey/classList.js.git
// import 'element-dataset';
// import 'fetch-polyfill';  // ie8+
// import 'whatwg-fetch';  // ie10+
// import 'rAF';  // https://gist.github.com/1579671.git
// import 'custom-event-polyfill';
// import 'html-domparser';  // https://gist.github.com/1129031.git
// import 'gsap';
// import 'velocity-animate/velocity.min';  // velocity-animate
// import 'velocity-animate/velocity.ui.min';  // velocity-animate
// import 'velocity.easeplus';  // https://github.com/syuji-higa/easeplus-velocity.git
// import { Router } from 'hash-router';  // https://github.com/michaelsogos/Hash-Router.git
// import doT from 'doT';  // dot
//
// if(typeof VENDORS !== 'undefined') {
//   throw new Error('namespace "VENDORS" is already exists.');
// }
// window.VENDORS = {};
//
// VENDORS.HashRouter = Router;
// VENDORS.doT        = doT;
//
// doT.templateSettings = {
//   evaluate    : /<%([\s\S]+?(\}?)+)%>/g,
//   interpolate : /<%=([\s\S]+?)%>/g,
//   encode      : /<%!([\s\S]+?)%>/g,
//   use         : /<%#([\s\S]+?)%>/g,
//   useParams   : /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
//   define      : /<%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#%>/g,
//   defineParams: /^\s*([\w$]+):([\s\S]+)/,
//   conditional : /<%\?(\?)?\s*([\s\S]*?)\s*%>/g,
//   iterate     : /<%~\s*(?:%>|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*%>)/g,
//   varname         : 'it',
//   strip           : true,
//   append          : true,
//   selfcontained   : false,
//   doNotSkipEncoded: false
// };


/***/ })
/******/ ]);
//# sourceMappingURL=vendor.js.map