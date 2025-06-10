"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
// define Observable emissions
var subscriber = new rxjs_1.Subscriber;
subscriber.next(1);
subscriber.next(2);
subscriber.next(3);
subscriber.complete();
// create the Observable
/*let observablex: Observable<number> = new Observable<number>(
    function(subscriber){
        console.log('teardown logic');
});*/
var observable = new rxjs_1.Observable(function (subscriber) {
    // synchronous values
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete();
});
// create Observer. create is deprecated - do not create directly
//let observer: Subscriber<number> = Subscriber.create()
// create Subscription
var subscription = observable.subscribe({
    next: function (x) { console.log('got sub1 value ' + x); },
    error: function (err) { console.error('something wrong occurred: ' + err); },
    complete: function () { console.log('Observable sub1 has completed'); }
});
// unsubscribe
//subscription.unsubscribe();
