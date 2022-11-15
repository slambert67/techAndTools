// RxJS is mostly useful for its operators, even though the Observable is the foundation.
// Operators are the essential pieces that allow complex asynchronous code to be easily composed in a declarative manner.
// Operators are functions. There are two kinds of operators
//
// - Pipeable Operators
//   - A Pipeable Operator is a function that takes an Observable as its input and returns another Observable.
//     It is a pure operation: the previous Observable stays unmodified
//     A Pipeable Operator is essentially a pure function which takes one Observable as input and generates another Observable as output.
//     Subscribing to the output Observable will also subscribe to the input Observable
//
// - Creation Operators
//   - the other kind of operator, which can be called as standalone functions to create a new Observable
//
// marble diagrams are used to explain how operators work

import {of, map, filter, tap, switchMap, concatMap, combineLatest, distinctUntilChanged} from "rxjs";

// of operator creates an observable.
// pipe is used to stitch together functional operators into a chain


// map - Applies a given project function to each value emitted by the source Observable, and emits the resulting values as an Observable
/*of(1,2,3)
    .pipe( map( (x) => x * x) )
    .subscribe( (v) => console.log(`value: ${v}`) );*/


// filter - Filter items emitted by the source Observable by only emitting those that satisfy a specified predicate
/*of(1,2,3)
    .pipe( filter( (x) => x > 1) )
    .subscribe( (v) => console.log(`value: ${v}`) );*/


// tap -    No effect on the stream. Used to observe values within the stream.
//          Used to create a side effect - trigger other code without affecting the stream
//debug
/*of(1,2,3)
    .pipe( tap( (x) => console.log('debug value = ' + x)) )
    .subscribe( (v) => console.log(`value: ${v}`) );*/
// side effect
// e.g. send value to storage


// switchMap - Projects each source value to an Observable which is merged in the output Observable,
//             emitting values only from the most recently projected Observable
// e.g. Generate new Observable according to source Observable values
/*of(1,2,3)
    .pipe( switchMap( x => of(x, x**2, x**3) ) )
    .subscribe( (v) => console.log(`value: ${v}`) );*/


// concatMap - Projects each source value to an Observable which is merged in the output Observable, in a serialized fashion waiting for each one to complete before merging the next
// differs to switchMap in that no inner observable processing is cancelled


// combineLatest. Creation operator and not piped operator
// todo


// distinctUntilChanged - Returns a result Observable that emits all values pushed by the source observable if they are distinct in comparison to the last value the result observable emitted.
/*of(1, 1, 1, 2, 2, 2, 1, 1, 3, 3)
    .pipe(distinctUntilChanged())
    .subscribe(console.log);*/


// debounceTime
// todo


// catchError - Catches errors on the observable to be handled by returning a new observable or throwing an error.
// It only listens to the error channel and ignores notifications. Handles errors from the source observable, and maps them to a new observable.
// The error may also be rethrown, or a new error can be thrown to emit an error from the result.
// todo


//tmp
of([{"flight":"abc"}])
    //.pipe( map( (x) => x) )
    .subscribe( (v) => console.log(v) );
