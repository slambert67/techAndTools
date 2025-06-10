// Observables are like functions with zero arguments, but generalize those to allow multiple values
// Subscribing to an Observable is analogous to calling a Function
// Observables are able to deliver values either synchronously or asynchronously
// func.call() means "give me one value synchronously"
// Observables are COLD until there is a Subscription. Unicast - 1 source per subscriber
// observable.subscribe() means "give me any amount of values, either synchronously or asynchronously"
// Observables are created using new Observable or a creation operator
// Observables can be created with new Observable. Most commonly, observables are created using creation functions, like of, from, interval, etc
// Each call to observable.subscribe triggers its own independent setup for that given subscriber
// Subscribing to an Observable is like calling a function, providing callbacks where the data will be delivered to.
// In an Observable Execution, zero to infinite Next notifications may be delivered.
// - If either an Error or Complete notification is delivered, then nothing else can be delivered afterwards.
// It is a good idea to wrap any code in subscribe with try/catch block that will deliver an Error notification if it catches an exception:
// When you subscribe, you get back a Subscription, which represents the ongoing execution. Just call unsubscribe() to cancel the execution


// manual creation of an Observable
import {Observable, Subscriber, Subscription} from "rxjs";

// takes one argument. A function. This function accepts a Subscriber (Implements Observer interface)
// This function is called when the Observable is INITIALLY subscribed to
const ob: Observable<number> = new Observable(subscriber => {
    // synchronous values
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);

    // asynchronous value
    setTimeout( () => {
        subscriber.next(4);
        subscriber.complete();
    },3000);


});

console.log('just before subscribe to observable sub1');
const sub1: Subscription = ob.subscribe({
    next(x) {console.log('got sub1 value ' + x);},
    error(err) {console.error('something wrong occurred: ' + err)},
    complete() {console.log('Observable sub1 has completed');}
});
console.log('just after subscribe to observable sub1');

// can have multiple subscriptions
console.log('just before subscribe to observable sub2');
const sub2: Subscription = ob.subscribe({
    next(x) {console.log('got sub2 value ' + x);},
    error(err) {console.error('something wrong occurred: ' + err)},
    complete() {console.log('Observable sub2 has completed');}
});
console.log('just after subscribe to observable sub2');

// subscribe is overloaded and so can pass 1 param which is the next function
const sub3: Subscription = ob.subscribe( (x) => {
    console.log("Subscribed with an overload: " + x);
});

// It is a good idea to wrap any code in subscribe with try/catch block that will deliver an Error notification if it catches an exception:
const ob2: Observable<string> = new Observable(subscriber => {
    try {
        subscriber.next('a');
        subscriber.next('b');
        subscriber.next('c');
        subscriber.complete();
    } catch (err) {
        subscriber.error(err);  // delivers an error if encountered
    }
});
const sub4: Subscription = ob2.subscribe( (x) => {
    console.log("Subscribed with try/catch block: " + x);
});

// When you subscribe, you get back a Subscription, which represents the ongoing execution. Just call unsubscribe() to cancel the execution
sub4.unsubscribe();
