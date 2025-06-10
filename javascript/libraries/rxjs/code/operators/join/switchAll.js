"use strict";
/*
Converts a higher-order Observable into a first-order Observable producing values only from the most recent observable sequence
See search on click example below

switchAll takes a Higher Order Observable (Observable of Observables)
Emitted values are inner Observables
Subscribes to most recently provided inner Observable
Only 1 subscription at a time
As values from any inner observable are produced, those values are emitted as part of the resulting sequence.
Such process is often referred to as flattening - values emitted are from multiple (inner) Observables

 */
exports.__esModule = true;
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
var fourthObservable = (0, rxjs_1.of)(10, 11, 12);
var fifthObservable = new rxjs_1.Observable(function (subscriber) {
    setTimeout(function () {
        subscriber.next(13);
        subscriber.complete();
    }, 1000);
});
var ob = new rxjs_1.Observable(function (subscriber) {
    subscriber.next(firstObservable); // 1,2,3
    subscriber.next(fifthObservable);
    /*    subscriber.next(secondObservable); // 4,5,6
        subscriber.next(thirdObservable);  // 7,8,9
        setTimeout(() => {
            subscriber.next(fourthObservable);  // 10,11,12
            subscriber.complete();
        }, 500);*/
});
//ob.subscribe(x => console.log(x));  // emits 3 observables - but I want the values ...
ob.pipe((0, rxjs_1.switchAll)()).subscribe(function (x) { return console.log(x); }); // 1,2,3 (switch), 4 (switch), 7 (switch), 10,11,12
/*
First emission from ob is firstObservable
firstObservable is subscribed to runs to completion. 1,2,3 emitted synchronously
Next emission from ob is second observable
firstObservable is unsubscribed from and secondObservable is subscribed to
secondObservable runs to completion. Emits 4 synchronously and sets up callbacks for 5 and 6
Next emission from ob is thirdObservable
second Observable is unsubscribed from and thirdObservable is subscribed to
thirdObservable runs to completion. Emits 7 synchronously and sets up callbacks for 8 and 9
Next emission from ob is fourthObservable
third Observable is unsubscribed from and fourth Observable is subscribed to
fourthObservable runs to completion. Emits 10,11,12 synchronously
 */
// simulate a set of key presses as part of a search
/*const keyPresses = new Observable<any>((subscriber) => {
    subscriber.next('a');
    setTimeout(() => { //waits a second
        subscriber.next('b');
        setTimeout(() => { //waits a second
            subscriber.next('c');
            subscriber.complete();
        }, 2000);
    }, 2000);
});
keyPresses.subscribe( x=>console.log(x));*/
