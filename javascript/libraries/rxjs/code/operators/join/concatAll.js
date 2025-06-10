"use strict";
exports.__esModule = true;
/*
All values from all inner observables
 */
var rxjs_1 = require("rxjs");
var firstObservable = (0, rxjs_1.of)(1, 2, 3);
var secondObservable = new rxjs_1.Observable(function (subscriber) {
    subscriber.next(4);
    setTimeout(function () {
        subscriber.next(5);
        setTimeout(function () {
            subscriber.next(6);
            subscriber.complete();
        }, 1000);
    }, 1000);
});
var thirdObservable = new rxjs_1.Observable(function (subscriber) {
    subscriber.next(7);
    setTimeout(function () {
        subscriber.next(8);
        subscriber.next(9);
        subscriber.complete();
    }, 1000);
});
var fouthObservable = (0, rxjs_1.of)(10, 11, 12);
var ob = new rxjs_1.Observable(function (subscriber) {
    subscriber.next(firstObservable); // 1,2,3
    subscriber.next(secondObservable); // 4,5,6
    subscriber.next(thirdObservable); // 7,8,9
    setTimeout(function () {
        subscriber.next(fouthObservable); // 10,11,12
        subscriber.complete();
    }, 500);
});
ob.pipe((0, rxjs_1.concatAll)()).subscribe(function (x) { return console.log(x); }); // 1,2,3,4,5,6,7,8,9,10,11,12
