"use strict";
exports.__esModule = true;
/*
This operator is best used when you have a group of observables and only care about the final emitted value of each
 */
var rxjs_1 = require("rxjs");
var obsCharSync = (0, rxjs_1.of)('a', 'b', 'c');
var obsNumSync = (0, rxjs_1.of)(1, 2, 3);
(0, rxjs_1.forkJoin)([obsCharSync, obsNumSync]).subscribe(function (x) { return console.log(x); });
