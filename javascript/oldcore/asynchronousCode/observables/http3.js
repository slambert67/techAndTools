$(document).ready(function () {

    const { of, from } = rxjs;
    const { map, catchError } = rxjs.operators;
    const { ajax } = rxjs.ajax;

    const obs$ = from(ajax.getJSON(`https://api.github.com/users?per_page=5`).pipe(
        map(userResponse => console.log('users: ', userResponse)),
        catchError(error => {
          console.log('error: ', error);
          return of(error);
        })
    ));

    let mysub = obs$.subscribe({
        next: console.log("next"),
        error: console.log("error"),
        complete: console.log("complete")
    });

    console.log("completed");
});