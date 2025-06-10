import {Observable, Observer, Subscriber} from "rxjs";

// define Observable emissions
let subscriber: Subscriber<number> = new Subscriber<number>;
subscriber.next(1);
subscriber.next(2);
subscriber.next(3);
subscriber.complete();

// create the Observable
/*let observablex: Observable<number> = new Observable<number>(
    function(subscriber){
        console.log('teardown logic');
});*/

let observable: Observable<number> = new Observable<number>(subscriber => {
    // synchronous values
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete();
});

// create Observer. create is deprecated - do not create directly
//let observer: Subscriber<number> = Subscriber.create()

// create Subscription
let subscription = observable.subscribe({
    next(x) {console.log('got sub1 value ' + x);},
    error(err) {console.error('something wrong occurred: ' + err)},
    complete() {console.log('Observable sub1 has completed');}
});

// unsubscribe
//subscription.unsubscribe();


