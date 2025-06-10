/*
The main difference between switchMap and other flattening operators is the cancelling effect
On each emission the previous inner observable (the result of the function you supplied) is cancelled and the new observable is subscribed
If you would like more than one inner subscription to be maintained, try mergeMap!

switchMap seems to take values - not Observables! BUT RETURNS OBSERVABLE
- creates Observable on the fly

switchAll takes Observables. BUT RETURNS OBSERVABLE - higher order observable
 */

import {interval, map, Observable, of, switchAll, switchMap} from "rxjs";

/*const ob = of(1, 2, 3);

ob.pipe(
    switchMap( (x)=>{ return of(x, x**2, x**3) })  // returns output observable stream
).subscribe((x:any) => console.log(x));*/

const secondObservable = new Observable<any>((subscriber) => {
    subscriber.next(4);
    setTimeout(() => { //waits a second
        subscriber.next(5);
        setTimeout(() => { //waits a second
            subscriber.next(6);
            setTimeout(() => { //waits a second
                subscriber.next(7);
            }, 1000);
            subscriber.complete();  // prevents the 7 being emitted
        }, 1000);
    }, 1000);
});
//secondObservable.subscribe((x:any) => console.log(x));
secondObservable.pipe(
    switchMap( (x) => of(x**2))
).subscribe((x:any) => console.log(x));



