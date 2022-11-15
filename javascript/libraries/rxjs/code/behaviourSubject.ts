/*
BehaviorSubject has a notion of "the current value".
It stores the latest value emitted to its consumers
whenever a new Observer subscribes, it will immediately receive the "current value" from the BehaviorSubject.
 */
import {BehaviorSubject} from "rxjs";

const behaviourSubject = new BehaviorSubject(0); // 0 is the initial value

behaviourSubject.subscribe({
    next: (v) => console.log(`observerA: ${v}`),
});

behaviourSubject.next(1);
behaviourSubject.next(2);

behaviourSubject.subscribe({
    next: (v) => console.log(`observerB: ${v}`),
});

behaviourSubject.next(3);
