
/*const { range } = require('rxjs');
const { map, filter } = require('rxjs/operators');
 
range(1, 200).pipe(
  filter(x => x % 2 === 1),
  map(x => x + x)
).subscribe(x => console.log(x));*/

/*
Observable: Invokable collection of future values or events
Observer: collection of callbacks that knows how to listen to values delivered by an Observable
Subscription: represents execution of an Observable. Primarily useful for cancelling the execution
Operators: map, filter, concat etc
Subject: cf eventEmitter. Only way of multicasting a value or event to multiple Observers
Schedulers: centralised dispatchers to control concurrency.
*/

const { Observable } = require('rxjs');

/*
create an observable
constructor takes a function that is executed when Observable initially subscribed to
this function is given (from where?) a Subscriber as it's 1st parameter
this is used (I think?) to define the outputs from the Observable
*/

console.log("creating observer ...")
const myObservable = new Observable( subscriber => {
  // subscriber is instance of Subscriber given to the function passed to the Observable constructor
  console.log("myObservable being subscribed to");
  subscriber.next(1);
  subscriber.next(2);
  setTimeout( () => {
    subscriber.next(3);
    subscriber.complete()
  }, 2000);
});
console.log("created observer");


/*
subscribe to myObservable
pass in an object that implements the Observer interface i.e. has next, error and complete functions defined
Invokes an execution of an Observable and registers Observer handlers for notifications it will emit.
This is the moment the Observable starts it work
*/
console.log("subscribing to myObservable");
myObservable.subscribe({
  next(x) { console.log('got value ' + x); },
  error(err) { console.error('something wrong occurred: ' + err); },
  complete() { console.log('completed'); }
});
console.log("subscribed to myObservable");
