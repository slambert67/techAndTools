"use strict";
/*
The main difference between switchMap and other flattening operators is the cancelling effect
On each emission the previous inner observable (the result of the function you supplied) is cancelled and the new observable is subscribed
If you would like more than one inner subscription to be maintained, try mergeMap!

switchMap seems to take values - not Observables! BUT RETURNS OBSERVABLE
- creates Observable on the fly

switchAll takes Observables. BUT RETURNS OBSERVABLE - higher order observable
 */
exports.__esModule = true;
var rxjs_1 = require("rxjs");
/*const ob = of(1, 2, 3);

ob.pipe(
    switchMap( (x)=>{ return of(x, x**2, x**3) })  // returns output observable stream
).subscribe((x:any) => console.log(x));*/
var secondObservable = new rxjs_1.Observable(function (subscriber) {
    subscriber.next(4);
    setTimeout(function () {
        subscriber.next(5);
        setTimeout(function () {
            subscriber.next(6);
            setTimeout(function () {
                subscriber.next(7);
            }, 1000);
            //subscriber.complete();
        }, 1000);
    }, 1000);
});
//secondObservable.subscribe((x:any) => console.log(x));
secondObservable.pipe((0, rxjs_1.switchMap)(function (x) { return (0, rxjs_1.of)(Math.pow(x, 2)); })).subscribe(function (x) { return console.log(x); });
