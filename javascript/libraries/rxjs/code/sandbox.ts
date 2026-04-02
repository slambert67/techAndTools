import {endWith, mergeMap, Observable, of, startWith, switchMap, tap} from "rxjs";

// const projectIDs$: Observable<string> = of('proj1', 'proj2', 'proj3');

const projectIDs$: Observable<string> = new Observable( (subscriber) => {

    setTimeout( () => {
        subscriber.next('proj1');
    },1000);

    setTimeout( () => {
        subscriber.next('proj2');
    },2000);

    setTimeout( () => {
        subscriber.next('proj3');
    },3000);

    setTimeout( () => {
        subscriber.complete();
    },4000);

});

const projectData$: Observable<string> = new Observable( (subscriber) => {

    setTimeout( () => {
        subscriber.next('data1');
    },3000);

    setTimeout( () => {
        subscriber.next('data2');
    },4000);

    setTimeout( () => {
        subscriber.next('data3');
    },5000);

    setTimeout( () => {
        subscriber.complete();
    },6000);

});

/*const state: Observable<string> = projectIDs$.pipe(                                     // stream1 - project IDs
    tap( (projectID) => { console.log(`${projectID}`); } ),

    switchMap( (outerProjectID) => { return of('data1', 'data2', 'data3').pipe(         // stream2 - project data
        tap( (x) => { console.log(`in switchmap ${outerProjectID} - ${x}`); })
    ); } )
);*/


const state: Observable<string> = projectIDs$.pipe(                                     // stream1 - project IDs

    startWith('squoink'),
    endWith('squoinkXXX'),

    //tap( (projectID) => { console.log(`${projectID}`); } ),

    switchMap( (outerProjectID) => { return projectData$.pipe(                          // stream2 - project data
        tap( (x) => { console.log(`in ?map ${outerProjectID} - ${x}`); })
    ); } )
  
);


state.subscribe({});

