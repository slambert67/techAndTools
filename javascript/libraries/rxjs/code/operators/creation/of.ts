/*
Converts the arguments to an observable sequence
Returns an Observable that emits the arguments and then completes.
Each argument becomes a next notification
 */

import {of} from "rxjs";

of(10, 20, 30)
    .subscribe({
        next: value => console.log('next:', value),
        error: err => console.log('error:', err),
        complete: () => console.log('the end'),
    });
