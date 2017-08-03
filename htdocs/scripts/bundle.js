(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.pkg("default", {"imports":"0.0.0"}, function(___scope___){
___scope___.file("scripts/bundle.js", function(exports, require, module, __filename, __dirname){

'use strict';

var _instance = require('imports/utility/instance');

var _sample = require('imports/view/sample');

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
});
});
FuseBox.pkg("imports@0.0.0", {}, function(___scope___){
___scope___.file("utility/instance.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("../model/type");
var element_1 = require("./element");
/**
 * incetance
 */
/**
 * @param {Class} Cls
 * @param {string} selector
 * @param {...*} [opts]
 * @return {Array<Instance>}
 */
exports.createInstance = function (Cls, selector) {
    var opts = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        opts[_i - 2] = arguments[_i];
    }
    var _el = element_1.getElement(selector);
    if (!_el)
        return null;
    if (_el instanceof HTMLCollection || _el instanceof NodeList) {
        var _instances_1 = [];
        Array.from(_el, function ($el) {
            var _arg = [$el];
            if (opts)
                _arg.push.apply(_arg, opts);
            _instances_1.push(new (Cls.bind.apply(Cls, [void 0].concat(_arg)))());
        });
        return _instances_1;
    }
    else if (_el instanceof HTMLElement) {
        return new (Cls.bind.apply(Cls, [void 0].concat([_el, opts])))();
    }
};
/**
 * @param {Class} Cls
 * @param {string} selector
 * @param {...*} [opts]
 * @return {Instance}
 */
exports.createSingleInstance = function (Cls, selector) {
    var opts = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        opts[_i - 2] = arguments[_i];
    }
    var _el = element_1.getElement(selector);
    var _type = type_1.getType(_el);
    if (!_el || !_type.match(/^(HTMLCollection|NodeList)$/) || !_el.length)
        return;
    var _arg = [_el];
    if (opts)
        _arg.push.apply(_arg, opts);
    return new (Cls.bind.apply(Cls, [void 0].concat(_arg)))();
};

});
___scope___.file("model/type.js", function(exports, require, module, __filename, __dirname){

"use strict";
/**
 * index
 */
Object.defineProperty(exports, "__esModule", { value: true });
var toString = Object.prototype.toString;
/**
 * @param {*} target
 * @return {string}
 */
exports.getType = function (target) {
    var _strs = toString.call(target).match(/^\[object (.+)\]$/);
    if (!_strs)
        return;
    var _type = _strs[1];
    var _elStrs = _type.match(/^HTML.+Element$/);
    return _elStrs ? 'Element' : _type;
};

});
___scope___.file("utility/element.js", function(exports, require, module, __filename, __dirname){

"use strict";
/**
 * element
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param {string} str
 * @param {Element} [$el]
 */
exports.getElement = function (str, $el) {
    if ($el === void 0) { $el = document; }
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

});
___scope___.file("view/sample.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sample = (function () {
    function Sample() {
        console.log('ok');
    }
    Sample.prototype.say = function () {
        return 'Hello World';
    };
    return Sample;
}());
exports.default = Sample;

});
});

FuseBox.import("default/scripts/bundle.js");
FuseBox.main("default/scripts/bundle.js");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((d||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),u=e.substring(o+1);return[a,u]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(d){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function u(e){return{server:require(e)}}function f(e,n){var o=n.path||"./",a=n.pkg||"default",f=r(e);if(f&&(o="./",a=f[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=f[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!d&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return u(e);var s=m[a];if(!s){if(d&&"electron"!==h.target)throw"Package not found "+a;return u(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,c=t(o,e),v=i(c),p=s.f[v];return!p&&v.indexOf("*")>-1&&(l=v),p||l||(v=t(c,"/","index.js"),p=s.f[v],p||(v=c+".js",p=s.f[v]),p||(p=s.f[c+".jsx"]),p||(v=c+"/index.jsx",p=s.f[v])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:c,validPath:v}}function s(e,r,n){if(void 0===n&&(n={}),!d)return r(/\.(js|json)$/.test(e)?v.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);h.dynamic(a,o),r(h.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=g[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=f(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),u=m[t.pkgName];if(u){var p={};for(var g in u.f)a.test(g)&&(p[g]=c(t.pkgName+"/"+g));return p}}if(!i){var h="function"==typeof r,x=l("async",[e,r]);if(x===!1)return;return s(e,function(e){return h?r(e):null},r)}var _=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var w=i.locals={},y=n(t.validPath);w.exports={},w.module={exports:w.exports},w.require=function(e,r){return c(e,{pkg:_,path:y,v:t.versions})},d||!v.require.main?w.require.main={filename:"./",paths:[]}:w.require.main=v.require.main;var j=[w.module.exports,w.require,w.module,t.validPath,y,_];return l("before-import",j),i.fn.apply(0,j),l("after-import",j),w.module.exports}if(e.FuseBox)return e.FuseBox;var d="undefined"!=typeof window&&window.navigator,v=d?window:global;d&&(v.global=window),e=d&&"undefined"==typeof __fbx__dnm__?e:module.exports;var p=d?window.__fsbx__=window.__fsbx__||{}:v.$fsbx=v.$fsbx||{};d||(v.require=require);var m=p.p=p.p||{},g=p.e=p.e||{},h=function(){function r(){}return r.global=function(e,r){return void 0===r?v[e]:void(v[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){g[e]=g[e]||[],g[e].push(r)},r.exists=function(e){try{var r=f(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=f(e,{}),n=m[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var u=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);u(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=m.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(m[e])return n(m[e].s);var t=m[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=m,r.isBrowser=d,r.isServer=!d,r.plugins=[],r}();return d||(v.FuseBox=h),e.FuseBox=h}(this))
//# sourceMappingURL=bundle.js.map