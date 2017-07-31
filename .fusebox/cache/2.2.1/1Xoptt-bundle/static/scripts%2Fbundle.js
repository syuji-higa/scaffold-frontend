module.exports = { contents: "'use strict';\n\nvar _instance = require('imports/utility/instance');\n\nvar _sample = require('imports/view/sample');\n\nvar _sample2 = _interopRequireDefault(_sample);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\nif (typeof NS !== 'undefined') {\n  throw new Error('namespace \"NS\" is already exists.');\n}\nwindow.NS = {};\n\nwindow.addEventListener('DOMContentLoaded', function () {\n\n  var _modules = [[_sample2.default, '.js-sample']];\n\n  var _singleModules = [[_sample2.default, '.js-sample']];\n\n  _modules.forEach(function (arr) {\n    _instance.createInstance.apply(undefined, _toConsumableArray(arr));\n  });\n\n  _singleModules.forEach(function (arr) {\n    _instance.createSingleInstance.apply(undefined, _toConsumableArray(arr));\n  });\n});",
dependencies: ["imports/utility/instance","imports/view/sample"],
sourceMap: {},
headerContent: undefined,
mtime: 1501504539000,
devLibsRequired : undefined
};