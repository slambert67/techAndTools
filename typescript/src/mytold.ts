import { BehaviorSubject, concat, map, Observable, of, ReplaySubject, startWith, Subject, switchMap, tap } from "rxjs"

// Represents a raw item returned from backend
type Item = {
	index: number
	materialCode: string
	length: number
	width: number
}


/**
 * Row used by the UI table
 */
type Row = {
    name: string
    area: number
}

/**
 * Different UI states for loading lifecycle
 */
type LoadingState = {
    type: "loading"
}

type LoadedState = {
    type: "loaded"
    rows: Row[]
}

type IdleState = {
    type: "idle"
}

export type State = LoadedState | LoadingState | IdleState;


class Service {
    static getItems(projectID: string): Observable<Item[]> {
        
        switch (projectID) {
            case 'project1':
                return of([
                    { index:0, materialCode: 'p1m1', length: 5, width:3 },
                    { index:1, materialCode: 'p1m2', length: 6, width:4 }
                ]);
                break;
            case 'project2':
                return of([
                    { index:0, materialCode: 'p2m1', length: 7, width:5 },
                    { index:1, materialCode: 'p2m2', length: 8, width:6 }
                ]);
                break;
            default:
                return of([]);
                break;
        }
    }
}



export class TableRowsModel {


    //////////
    // PRIVATE
    //////////

    private _isIdle = new BehaviorSubject(false);
    readonly isIdle$: Observable<boolean> = this._isIdle.asObservable();
    private _isLoading = new BehaviorSubject(false);
    readonly isLoading$: Observable<boolean> = this._isLoading.asObservable();
    private _isLoaded = new BehaviorSubject(false);
    readonly isLoaded$: Observable<boolean> = this._isLoaded.asObservable();
    private _rowsToDisplay = new BehaviorSubject([]);
    readonly rowsToDisplay$: Observable<Row[]> = this._rowsToDisplay.asObservable();

    private createIdleState(): IdleState {
        this._isIdle.next(true);
        this._isLoaded.next(false);
        return { type: "idle" }
    }

    private createLoadingState(): LoadingState {
        this._isIdle.next(false);
        this._isLoading.next(true);
        return { type: "loading" }
    }

    private createLoadedState(rows: Row[]): LoadedState {
        this._isLoading.next(false);
        this._isLoaded.next(true);
        return { type: "loaded", rows }
    }

    //private _projectID = new ReplaySubject<string>();
    private _projectID = new Subject<string>();
    readonly projectIDs$: Observable<string> = this._projectID.asObservable();

    // Fetch and map backend items into table rows
    private getRows(projectID: string): Observable<Row[]> {
        return Service.getItems(projectID).pipe(
            map(items =>
                items.map((item): Row => ({
                    name: item.materialCode,
                    area: item.length * item.length
                }))
            )
        )
    }


    // Emits full lifecycle state for the UI
    // idle → loading → loaded (for each project change)
    /*private readonly projectState: Observable<String> = this._projectID.pipe( 
        tap( (x) => {console.log(`ProjectID updated to ${x}`)}),
        map( (x) => { return x; })

    );*/

	private readonly projectState: Observable<State> = this.projectIDs$.pipe(
    
        switchMap(proj => 
            // concat emits these observables in sequence
            {
                console.log(`PROCESSING PROJECT ${proj}`);
                return concat(
                of(this.createIdleState()),       // 1️⃣ idle state
                of(this.createLoadingState()),    // 2️⃣ loading state
                this.getRows(proj).pipe(          // 3️⃣ fetch rows then loaded state
                    map(rows => this.createLoadedState(rows))
                )
            )}
        ),
        startWith(this.createIdleState())     // initial idle state before any projectID
	)

            /*map( () => { return this.createIdleState()}),
        map( () => { return this.createLoadingState()}),
        map( () => { this.getRows()}),
        map( () => { return this.createLoadedState([])})
        startWith(this.createIdleState()),
        */
    /////////
    // PUBLIC
    /////////




    // trigger data fetching and state transitions.

    updateProjectID(projectID: string) {

        this.isIdle$.subscribe( (x) => { if (x) {console.log(`${projectID} Is Idle: ` + x)}} );
        this.isLoading$.subscribe( (x) => { if (x) {console.log(`${projectID} Is Loading: ` + x)}} );
        this.isLoaded$.subscribe( (x) => { if (x) {console.log(`${projectID} Is Loaded: ` + x)}} );

        this.projectState.subscribe( { next(x) { console.log(x) },
                                       error(err) {console.log(err)},
                                       complete() {console.log('observable has completed')} } ) ;
                                       
        // TODO: push project ID into the stream
        this._projectID.next(projectID);
        



        //this._projectID.complete();
    }
}

const tableRows: TableRowsModel = new( TableRowsModel );
tableRows.updateProjectID('project1');
tableRows.updateProjectID('project2');