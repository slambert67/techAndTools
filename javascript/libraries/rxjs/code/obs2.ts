// manual creation of an ASYNCHRONOUS Observable
import {Observable} from "rxjs";

const ob: Observable<number> = new Observable(subscriber => {
    setTimeout( () => {
        subscriber.next(1);

        setTimeout( ()=> {
            subscriber.next(2);
        });
    },3000);
    setTimeout( () => {
        subscriber.next(3);
        subscriber.complete();
    },3000);
});

console.log('just before subscribe to asynchronous observable');
ob.subscribe({
    next(x) {console.log('got value ' + x);},
    error(err) {console.error('something wrong occurred: ' + err)},
    complete() {console.log('Observable has completed');}
});
console.log('just after subscribe to asynchronous observable');
