/*
Whenever any input Observable emits a value, it computes a formula using the latest values from all the inputs, then emits the output of that formula.
Combines values of all input observables when any of them emit a value
if one observable emits values before the others do, then those values are lost.
When any observable emits a value, emit the last emitted value from each

This operator is best used when you have multiple, long-lived observables that rely on each other for some calculation or determination
Be aware that combineLatest will not emit an initial value until each observable emits at least one value
if you are working with observables that only emit one value, or you only require the last value of each before completion, forkJoin is likely a better option.
 */

import {combineLatest, of, delay, Observable, interval, map, forkJoin} from "rxjs";

function asyncVals(val: any, delay: number) {
    return interval(delay).pipe(map(index => val + " " + index));
}

// synchronous so [c,1], [c,2], [c,3]
/*let obsCharSync = of('a','b','c');
let obsNumSync = of(1,2,3);
console.log('combineLatest 1');
combineLatest([obsCharSync, obsNumSync]).subscribe(x=>console.log(x)).unsubscribe();*/


// asynchronous
/*const ob1$ = asyncVals("OB1 ", 5000);
const ob2$ = asyncVals("OB2 ", 2000);
combineLatest([ob1$, ob2$]).subscribe(x=>console.log(x));*/


// projection function
/*const ob1$ = asyncVals("OB1 ", 5000);
const ob2$ = asyncVals("OB2 ", 2000);
combineLatest([ob1$, ob2$], (one,two)=>{return one + ' : ' + two}).subscribe(x=>console.log(x));*/

