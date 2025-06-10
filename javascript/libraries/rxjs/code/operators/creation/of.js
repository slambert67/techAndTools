"use strict";
/*
Converts the arguments to an observable sequence
Returns an Observable that emits the arguments and then completes.
Each argument becomes a next notification
 */
exports.__esModule = true;
var rxjs_1 = require("rxjs");
(0, rxjs_1.of)(10, 20, 30)
    .subscribe({
    next: function (value) { return console.log('next:', value); },
    error: function (err) { return console.log('error:', err); },
    complete: function () { return console.log('the end'); }
});
