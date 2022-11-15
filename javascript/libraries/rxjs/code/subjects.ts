/*
An RxJS Subject is a special type of Observable that allows values to be multicasted to many Observers
plain Observables are unicast (each subscribed Observer owns an independent execution of the Observable)
A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners
Internally to the Subject, subscribe does not invoke a new execution that delivers values
It simply registers the given Observer in a list of Observers, similarly to how addListener usually works in other libraries and languages.
Every Subject is an Observable and an Observer. You can subscribe to a Subject, and you can call next to feed values as well as error and complete.
 */

import {from, Subject} from "rxjs";

// create a new Subject
const subject = new Subject<number>();

// first subscription
subject.subscribe({
    next: (v) => console.log(`observerA: ${v}`),
});

// second subscription
subject.subscribe({
    next: (v) => console.log(`observerB: ${v}`),
});

// push values into the Subject
subject.next(1);
subject.next(2);

// third subscription
subject.subscribe({
    next: (v) => console.log(`observerC: ${v}`),
});

// subject maintains its registry of subscriptions
// subject is an Observer (next, error, complete) so can be used to subscribe to Observable
const observable = from([7,8,9]);
observable.subscribe(subject);
