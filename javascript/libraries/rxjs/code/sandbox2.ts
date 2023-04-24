import {Observable, Observer, Subscriber, Subscription} from "rxjs";

/*
Subscriber
- Implements Observer Interface
  An object interface that defines a set of callback functions a user can use to get notified of any set of Observable notification events.

  interface Observer<T> {
  next: (value: T) => void
  error: (err: any) => void
  complete: () => void
}

- Extends Subscription
  Represents a disposable resource, such as the execution of an Observable.
  A Subscription has one important method, unsubscribe, that takes no argument and just disposes the resource held by the subscription.


 */

// define subscriber function - tells Observable how to generate values
//
let subscriberFunction = function(sub:Subscriber<string>) {
    sub.next("hello");
    sub.next("world");
    sub.complete();
}

// define the Observable
const observable = new Observable<string>( subscriberFunction );


// An observer is a consumer of values
// An observer is something that is interested in the emitted values by the observable
// An Observer is simply a set of callbacks (next, error, complete).
// One for each type of notification that an Observable may emit
const observer: Observer<string> = {
    next: (value: string) =>
        console.log(`[observer] next`, value),
    error: (error: Error) =>
        console.error(`[observer] error`, error),
    complete: () =>
        console.log(`[observer] complete!`),
};

// Represents a disposable resource, such as the execution of an Observable.
// A Subscription has one important method, unsubscribe, that takes no argument and just disposes the resource held by the subscription.
let subscription!: Subscription;
subscription = observable.subscribe( observer );  // All Observers get converted to Subscribers
subscription.unsubscribe();
