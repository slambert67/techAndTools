"use strict";
exports.__esModule = true;
//import * as Rx from 'rxjs';
var rxjs_1 = require("rxjs");
var emitter = (0, rxjs_1.of)("Sam", "Ray", "Thomas");
emitter.subscribe(function (value) {
    console.log("Name: ".concat(value));
});
