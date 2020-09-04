(function(modules) {
            function require(moduleId) {
                var fn = modules[moduleId];
                var module = {exports:{}};
                fn(require, module, module.exports);
                return module.exports;
            }
            require('D:\app\webpack-learning\src\index.js')
        })({'D:\app\webpack-learning\src\index.js': function(require, module, exports) {"use strict";

var _hello = require("./hello.js");

(0, _hello.hello)();},'./hello.js': function(require, module, exports) {"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hello = hello;
function hello() {
  console.log('hello');
}},});