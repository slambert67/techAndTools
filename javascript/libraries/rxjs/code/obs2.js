"use strict";
exports.__esModule = true;
// manual creation of an ASYNCHRONOUS Observable
var rxjs_1 = require("rxjs");
var ob = new rxjs_1.Observable(function (subscriber) {
    setTimeout(function () {
        subscriber.next(1);
        setTimeout(function () {
            subscriber.next(2);
        });
    }, 3000);
    setTimeout(function () {
        subscriber.next(3);
        subscriber.complete();
    }, 3000);
});
console.log('just before subscribe to asynchronous observable');
ob.subscribe({
    next: function (x) { console.log('got value ' + x); },
    error: function (err) { console.error('something wrong occurred: ' + err); },
    complete: function () { console.log('Observable has completed'); }
});
console.log('just after subscribe to asynchronous observable');
