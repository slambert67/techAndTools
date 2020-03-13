$(document).ready(function () {

    // standard js
    /*$("#b1").on('click', (event) => {
        console.log('hello world');
    });*/
    
    // observable
    let b1 = $("#b1")[0];
    let myObservable = Rx.Observable.fromEvent(b1, 'click');

    // need to subscribe to an observable to REACT to an event
    myObservable.subscribe(
        (event) => console.log('hello world')  // 1st parameter 
    );

    // observables have many useful operators

});
