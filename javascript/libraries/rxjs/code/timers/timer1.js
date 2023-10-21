"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
function correcting_interval(interval) {
    var start_time = new Date().getTime();
    return (0, rxjs_1.of)(-1).pipe((0, rxjs_1.expand)(function (v) { return (0, rxjs_1.of)(v + 1).pipe((0, rxjs_1.delay)(interval - (new Date().getTime() - start_time) % interval)); }));
}
var t0;
var tx;
var counter = 0;
var myob = correcting_interval(10000);
myob.subscribe(function (x) {
    /*    if ( counter === 0 ) {
            t0 = new Date().getTime();
            console.log(`First value received at ${t0}`);
        } else {
            tx =
        }
        counter++;
        console.log(x);*/
    console.log(new Date().getTime());
});
