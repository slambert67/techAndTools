"use strict";
exports.__esModule = true;
/*
Creates an Observable from an Array, an array-like object, a Promise, an iterable object, or an Observable-like object
Returns an Observable
Converts almost anything to an Observable
 */
var rxjs_1 = require("rxjs");
var array = [10, 20, 30];
var result = (0, rxjs_1.from)(array);
result.subscribe(function (x) { return console.log(x); });
