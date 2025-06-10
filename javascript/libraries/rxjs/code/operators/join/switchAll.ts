/*
Converts a higher-order Observable into a first-order Observable producing values only from the most recent observable sequence
See search on click example below

switchAll takes a Higher Order Observable (Observable of Observables)
Emitted values are inner Observables
Subscribes to most recently provided inner Observable
Only 1 subscription at a time
As values from any inner observable are produced, those values are emitted as part of the resulting sequence.
Such process is often referred to as flattening - values emitted are from multiple (inner) Observables

All inner observables will not return a value if asynchronous and next emitted inner observable arrives before async operation complete
Good for search
i.e
Enter a in search -> inner ob1 -> async operation to DB with 'a'
Enter b in search before above operation completes -> inner ob2 -> async operation to DB with 'ab'
inner ob1 unsubscribed to so callback operations are cancelled
We just process results from 'ab' search
 */


import {interval, map, Observable, of, switchAll} from "rxjs";

const firstObservable = of(1, 2, 3);

const secondObservable = new Observable<any>((subscriber) => {
    subscriber.next(4);
    setTimeout(() => { //waits a second
        subscriber.next(5);
        setTimeout(() => { //waits a second
            subscriber.next(6);
            subscriber.complete();
        }, 1000);
    }, 1000);
});

const thirdObservable = new Observable<any>((subscriber) => {
    subscriber.next(7);
    setTimeout(() => { //waits a second
        subscriber.next(8);
        subscriber.next(9);
        subscriber.complete();
    }, 1000);
});

const fourthObservable = of(10, 11, 12);

const fifthObservable = new Observable<any>((subscriber) => {
    setTimeout(() => { //waits a second
        subscriber.next(13);
        subscriber.complete();
    }, 1000);
});

const ob = new Observable<any>((subscriber) => {
    subscriber.next(firstObservable);  // 1,2,3
    //subscriber.next(fifthObservable);
    subscriber.next(secondObservable); // 4,5,6
    subscriber.next(thirdObservable);  // 7,8,9
    setTimeout(() => {
        subscriber.next(fourthObservable);  // 10,11,12
        subscriber.complete();
    }, 500);
});

//ob.subscribe(x => console.log(x));  // emits 3 observables - but I want the values ...


ob.pipe(
    switchAll()  // returns output observable stream - 1,2,3 (switch), 4 (switch), 7 (switch), 10,11,12
).subscribe((x:any) => console.log(x)); // 1,2,3 (switch), 4 (switch), 7 (switch), 10,11,12

/*
First emission from ob is firstObservable
firstObservable is subscribed to runs to completion. 1,2,3 emitted synchronously
Next emission from ob is second observable
firstObservable is unsubscribed from and secondObservable is subscribed to
secondObservable runs to completion. Emits 4 synchronously and sets up callbacks for 5 and 6
Next emission from ob is thirdObservable
second Observable is unsubscribed from and thirdObservable is subscribed to
thirdObservable runs to completion. Emits 7 synchronously and sets up callbacks for 8 and 9
Next emission from ob is fourthObservable
third Observable is unsubscribed from and fourth Observable is subscribed to
fourthObservable runs to completion. Emits 10,11,12 synchronously

VALUES emitted from last Observable even if asynchronous as not unsubscribed to - see fifthObservable above
 */





