/*
All values from all inner observables
 */
import {mergeAll, Observable, of, switchAll} from "rxjs";

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

const ob = new Observable<any>((subscriber) => {
    subscriber.next(firstObservable);  // 1,2,3
    subscriber.next(secondObservable); // 4,5,6
    subscriber.next(thirdObservable);  // 7,8,9
    setTimeout(() => {
        subscriber.next(fourthObservable);  // 10,11,12
        subscriber.complete();
    }, 500);
});


ob.pipe(
    mergeAll()
).subscribe((x:any) => console.log(x)); // 1,2,3,4,7,10,11,12,5,8,9,6
