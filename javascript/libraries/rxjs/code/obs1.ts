// manual creation of an Observable
import {Observable} from "rxjs";

const ob: Observable<number> = new Observable(subscriber => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    setTimeout( () => {
        subscriber.next(4);
        subscriber.complete();
    },3000);
});

console.log('just before subscribe to observable');

ob.subscribe({
    next(x) {console.log('got value ' + x);},
    error(err) {console.error('something wrong occurred: ' + err)},
    complete() {console.log('Observable has completed');}
});
console.log('just after subscribe to observable');




