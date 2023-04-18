import {Observable, Observer, Subscriber} from "rxjs";

let mysubfunc = function(sub:Subscriber<string>) {
    sub.next("ponkival");
    sub.next("punkflap");
    sub.complete();
}
// subscriber defines values emitted from observable
/*const observable = new Observable<string>((subscriber: Subscriber<string>) => {
    subscriber.next("Hello");
    subscriber.next("World");
    subscriber.complete();
});*/

const observable = new Observable<string>( mysubfunc );

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

const subscription = observable.subscribe( observer );
