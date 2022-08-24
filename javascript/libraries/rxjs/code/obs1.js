"use strict";
exports.__esModule = true;
// manual creation of a SYNCHRONOUS Observable
var rxjs_1 = require("rxjs");
var ob = new rxjs_1.Observable(function (subscriber) {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    setTimeout(function () {
        subscriber.next(4);
        subscriber.complete();
    }, 3000);
});
console.log('just before subscribe to synchronous observable');
ob.subscribe({
    next: function (x) { console.log('got value ' + x); },
    error: function (err) { console.error('something wrong occurred: ' + err); },
    complete: function () { console.log('Observable has completed'); }
});
console.log('just after subscribe to synchronous observable');
console.log('----------------------------------------------');
