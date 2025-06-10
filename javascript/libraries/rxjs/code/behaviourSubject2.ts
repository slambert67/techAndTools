/*
BehaviorSubject has a notion of "the current value".
It stores the latest value emitted to its consumers
whenever a new Observer subscribes, it will immediately receive the "current value" from the BehaviorSubject.
 */
import {BehaviorSubject, Subscription} from "rxjs";

const behaviourSubject = new BehaviorSubject(0); // 0 is the initial value

let sub1 = behaviourSubject.subscribe({
    next: (v) => console.log(`observerA: ${v}`),
});

behaviourSubject.next(1);
behaviourSubject.next(2);

let sub2 = behaviourSubject.subscribe({
    next: (v) => console.log(`observerB: ${v}`),
});

behaviourSubject.next(3);

sub2.unsubscribe();

behaviourSubject.next(4);
