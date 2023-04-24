/*
Fork into multiple asynchronous actions
Join back together into single stream when all have completed
This operator is best used when you have a group of observables and only care about the final emitted value of each
c.f Promise.all
Need all to be resolved before taking action
Note: There are many operators that can be used to complete non-completing streams. e.g. take, takeUntil
A common use case for forking might be logging a user out
 */
import {forkJoin, of} from "rxjs";

let obsCharSync = of('a','b','c');
let obsNumSync = of(1,2,3);

forkJoin([obsCharSync, obsNumSync]).subscribe(x=>console.log(x));
