"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
/*
Subscriber
- Implements Observer Interface
- Extends Subscription
 */
// define subscriber function - tells Observable how to generate values
var subscriberFunction = function (sub) {
    sub.next("hello");
    sub.next("world");
    sub.complete();
};
// define the Observable
var observable = new rxjs_1.Observable(subscriberFunction);
// An observer is a consumer of values
// An observer is something that is interested in the emitted values by the observable
// An Observer is simply a set of callbacks (next, error, complete).
// One for each type of notification that an Observable may emit
var observer = {
    next: function (value) {
        return console.log("[observer] next", value);
    },
    error: function (error) {
        return console.error("[observer] error", error);
    },
    complete: function () {
        return console.log("[observer] complete!");
    }
};
var subscription;
subscription = observable.subscribe(observer);
subscription.unsubscribe();
