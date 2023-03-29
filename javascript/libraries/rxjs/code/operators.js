"use strict";
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
exports.__esModule = true;
var rxjs_1 = require("rxjs");
// of operator creates an observable.
// pipe is used to stitch together functional operators into a chain
// map - Applies a given project function to each value emitted by the source Observable, and emits the resulting values as an Observable
/*of(1,2,3)
    .pipe( map( (x) => x * x) )
    .subscribe( (v) => console.log(`value: ${v}`) );
console.log('hello');*/
/*const ob1 = of(1,2,3)
    .pipe( map( (x) => x * x) );


const sub1 = ob1.subscribe( (v) => console.log('sub1' + `value: ${v}`) );

const sub2 = ob1.subscribe( (v) => console.log('sub2' + `value: ${v}`) );

sub1.unsubscribe();
sub2.unsubscribe();*/
// filter - Filter items emitted by the source Observable by only emitting those that satisfy a specified predicate
/*of(1,2,3)
    .pipe( filter( (x) => x > 1) )
    .subscribe( (v) => console.log(`value: ${v}`) );*/
/*of(1,2,3)
    .pipe( filter( (x) => !!x) )
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
var smOuter$ = (0, rxjs_1.of)(1, 2, 3);
var smInner$ = (0, rxjs_1.of)('a', 'b', 'c');
smOuter$
    .pipe((0, rxjs_1.switchMap)(function (outer) {
    return smInner$
        .pipe((0, rxjs_1.map)(function (inner) { return [outer, inner]; }));
})).subscribe(function (x) { return console.log(x); });
// concatMap - Projects each source value to an Observable which is merged in the output Observable, in a serialized fashion waiting for each one to complete before merging the next
// differs to switchMap in that no inner observable processing is cancelled
// mergeMap
// Maps each value to an Observable, then flattens all of these inner Observables using mergeAll
/////////////////////////////////////////////////////////////////////////
/*of( [1,2,3] )
    .pipe(
    ).subscribe(res=>{console.log('result');console.log(res)});  // [1,2,3]*/
/*
of( [1,2,3] )
    .pipe(
        mergeMap( (outerObsVal)=>{ return outerObsVal } ), // creates observable out of array
        tap(x=>{console.log('tap'); console.log(x)})
    ).subscribe(res=>{console.log('result');console.log(res)});  // tap 1 result 1 tap 2 result 2 tap3 result 3 individually
*/
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/*of( {a:1, b:2, c:3} )
    .pipe(
    ).subscribe(res=>{console.log('result');console.log(res)});  // { a: 1, b: 2, c: 3 }*/
/*of( {a:1, b:2, c:3} )
    .pipe(
        mergeMap( (outerObsVal)=>{ return outerObsVal } ),
        tap(x=>{console.log('tap'); console.log(x)})
    ).subscribe(res=>{console.log('result');console.log(res)});  // { a: 1, b: 2, c: 3 }*/
/////////////////////////////////////////////////////////////////////////
/*of( { a: [1,2,3], b: [4,5,6] } )
    .pipe(
    ).subscribe(res=>{console.log('result');console.log(res)});  // { a: [ 1, 2, 3 ], b: [ 4, 5, 6 ] }*/
/*console.log('without mergemap');
of( { a: [1,2,3], b: [4,5,6]} )
    .subscribe(outerObsValue=>console.log(outerObsValue)); // { a: [ 1, 2, 3 ], b: [ 4, 5, 6 ] }*/
/*console.log('with mergemap');
of( { a: [1,2,3], b: [4,5,6] } )
    .pipe(
        mergeMap((outerObsValue)=>[7,8,9])
    )
    .subscribe(res=>{console.log('result');console.log(res)});  // 7,8,9 not in array*/
// mergeMap - so mergeMap also flattens array
/*of( { a: [1,2,3], b: [4,5,6] } )
    .pipe(
        //mergeMap((outerObsValue)=>{ return [7,8,9] })  // 7 8 9 individually
        //mergeMap((outerObsValue)=>{ return outerObsValue.a })  // 1 2 3 individually
        //mergeMap((outerObsValue)=>{ return outerObsValue.b })  // 4 5 6 individually
    )
    .subscribe(res=>{console.log('result');console.log(res)});*/
// with mergeMap -> 1,2,3
// ie. takes individual elements from array
/*console.log('mergeMap');
of( { a: [1,2,3] } )
    .pipe(
        mergeMap(x=>x.a)
    )
    .subscribe(x=>console.log(x));*/
/*
mergeMap notes
It seems like mergeMap sees that this is not an Observable and wraps it in a from operator.
This creates an Observable from the array where each element emits individually.

 */
// combineLatest. Creation operator and not piped operator
/*let obsChar = of('a','b','c');
let obsNum = of(1,2,3);
console.log('combineLatest 1');
combineLatest([obsChar, obsNum]).subscribe(x=>console.log(x)).unsubscribe();
console.log('combineLatest 2');
combineLatest([obsNum, obsChar]).subscribe(x=>console.log(x)).unsubscribe();
console.log('combineLatest 3');
combineLatest([obsChar, obsNum]).subscribe( ([str,num])=>{console.log(str + ':' + num)}).unsubscribe();*/
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
/*of([{"flight":"abc"}])
    .subscribe( (v) => console.log(v) );*/
