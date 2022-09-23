"use strict";
// RxJS is mostly useful for its operators, even though the Observable is the foundation.
// Operators are the essential pieces that allow complex asynchronous code to be easily composed in a declarative manner.
// Operators are functions. There are two kinds of operators
//
// - Pipeable Operators
//   - A Pipeable Operator is a function that takes an Observable as its input and returns another Observable.
//     It is a pure operation: the previous Observable stays unmodified
//     A Pipeable Operator is essentially a pure function which takes one Observable as input and generates another Observable as output.
//     Subscribing to the output Observable will also subscribe to the input Observable
//
// - Creation Operators
//   - the other kind of operator, which can be called as standalone functions to create a new Observable
exports.__esModule = true;
var rxjs_1 = require("rxjs");
// of operator creates an observable. map transforms each value
(0, rxjs_1.of)(1, 2, 3)
    .pipe((0, rxjs_1.map)(function (x) { return x * x; }))
    .subscribe(function (v) { return console.log("value: ".concat(v)); });
