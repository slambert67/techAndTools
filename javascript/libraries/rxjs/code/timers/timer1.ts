import {delay, expand, Observable, of} from "rxjs";
function correcting_interval(interval: number) {
    const start_time = new Date().getTime();
    return of(-1).pipe(
        expand(v => of(v + 1).pipe(
            delay(interval - (new Date().getTime() - start_time) % interval)
        )
            )
    )
}

let t0;
let tx;
let counter = 0;

let myob = correcting_interval(10000);
myob.subscribe( (x) => {
/*    if ( counter === 0 ) {
        t0 = new Date().getTime();
        console.log(`First value received at ${t0}`);
    } else {
        tx =
    }
    counter++;
    console.log(x);*/
    console.log( new Date().getTime() );
});
