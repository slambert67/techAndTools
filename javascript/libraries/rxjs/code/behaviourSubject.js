"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
BehaviorSubject has a notion of "the current value".
It stores the latest value emitted to its consumers
whenever a new Observer subscribes, it will immediately receive the "current value" from the BehaviorSubject.
 */
var rxjs_1 = require("rxjs");
var behaviourSubject = new rxjs_1.BehaviorSubject(0); // 0 is the initial value
behaviourSubject.subscribe({
    next: function (v) { return console.log("observerA: ".concat(v)); },
});
behaviourSubject.next(1);
behaviourSubject.next(2);
behaviourSubject.subscribe({
    next: function (v) { return console.log("observerB: ".concat(v)); },
});
behaviourSubject.next(3);
