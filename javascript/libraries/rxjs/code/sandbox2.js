"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var mysubfunc = function (sub) {
    sub.next("ponkival");
    sub.next("punkflap");
    sub.complete();
};
// subscriber defines values emitted from observable
/*const observable = new Observable<string>((subscriber: Subscriber<string>) => {
    subscriber.next("Hello");
    subscriber.next("World");
    subscriber.complete();
});*/
var observable = new rxjs_1.Observable(mysubfunc);
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
var subscription = observable.subscribe(observer);
