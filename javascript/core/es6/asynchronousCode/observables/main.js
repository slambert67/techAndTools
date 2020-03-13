$(document).ready(function () {
    console.log("document ready");

    const { fromEvent, of} = rxjs;
    const { map, filter, throttleTime } = rxjs.operators;


    var btn1 = $("#btn1")[0];

    // create an observable based on an event
    var myObservable = fromEvent(btn1, 'click');

    // subscribe to the observable
    /*var mySubscription = myObservable.subscribe(
        (event) => console.log(event)
    );*/
    var mySubscription = myObservable.subscribe({
        // success
        next: event => console.log("clicked"),
        // error
        error: error => console.log("failed"),
        // complete
        complete: () => console.log("complete")
    });
    var mySubscription2 = myObservable.subscribe({
        // success
        next: event => console.log("clicked2"),
        // error
        error: error => console.log("failed2"),
        // complete
        complete: () => console.log("complete2")
    });

    // clean up with unsubscribe
    mySubscription.unsubscribe();
    mySubscription2.unsubscribe();


    // observables useful due to operators

    // eg. only process the clicks every second. ie. discard other clicks
    var btn2 = $("#btn2")[0];  
    var myObservable2 = fromEvent(btn2, 'click')
    .pipe(throttleTime(1000));

    var mySubscription2 = myObservable2.subscribe(
        (event) => console.log("clicked")
    );


    // pipes and operators
    //////////////////////

    const dataSource = of(1,2,3,4,5);

    // subscribe to source observable
    const mySubscription3 = dataSource
    .pipe(
        // increment
        map(value => value + 1),
        // increment again
        map(value => value + 1)
    )
    .subscribe(value => console.log(value));




});
