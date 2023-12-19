"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
function correcting_interval(interval) {
    var start_time = new Date().getTime();
    return (0, rxjs_1.of)(3).pipe((0, rxjs_1.expand)(function (v) { return ((0, rxjs_1.of)(v + 1)); }));
}
var myob = correcting_interval(3000);
myob.subscribe(function (x) { return console.log(x); });
