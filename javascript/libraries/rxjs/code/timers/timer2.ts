import {delay, expand, Observable, of} from "rxjs";
function correcting_interval(interval: number) {
    const start_time = new Date().getTime();
    return of(-1).pipe(
        expand( (v) => (of(v+1)))
    );
}

let myob = correcting_interval(3000);

myob.subscribe( (x) => console.log(x));