import { distinctUntilChanged, endWith, from, map, Observable, of, ReplaySubject, shareReplay, startWith, switchMap, tap } from "rxjs"

/**
 * Represents a raw item returned from backend
 */
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

export type State = LoadedState | LoadingState | IdleState

/**
 * Pretend backend helpers
 */
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


/**
 * Reactive model used by Angular components
 * Responsible for transforming backend data into UI-ready state
 */
export class TableRowsModel {

    constructor() {
        this.state.subscribe(state => {
            console.log('STATE:', state);
        });
    }

    /**
     * Emits whenever UI selects a new project
     * ReplaySubject used so late subscribers still receive the last value
     */
    private _projectID = new ReplaySubject<string>()


    private createLoadingState(): LoadingState {
        return { type: "loading" }
    }

    private async createLoadedState(rows: Row[]): Promise<LoadedState> {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return { type: "loaded", rows }
    }

    private createIdleState(): IdleState {
        return { type: "idle" }
    }

    /**
     * Fetch and map backend items into table rows
     */
    private getRows(projectID: string): Observable<Row[]> {
        return Service.getItems(projectID).pipe(
            map(items =>
                items.map((item): Row => ({
                    name: item.materialCode,
                    area: item.length * item.width
                }))
            )
        )
    }

    /**
     * TODO: Finish implementation. Not yet complete.
     * Emits full lifecycle state for the UI
     * idle → loading → loaded (for each project change)
     */
    private readonly state: Observable<State> = this._projectID.pipe(       // OUTER

        distinctUntilChanged(),                                             // only emit when Project ID changes
        switchMap(projectID =>                                              // retrieve observable stream of data based on projectID

            this.getRows(projectID).pipe(                                   
                switchMap(rows => { return from(this.createLoadedState(rows)) }),
                startWith(this.createLoadingState()),
                endWith(this.createIdleState())
            )
        ),
        startWith(this.createIdleState()),
        shareReplay(1)  // not strictly necessary in this setup as there is only 1 subscription per instance in the constructor
    );


    /**
     * TODO:
     * Emit true while rows are being loaded
     */
    readonly isLoading = this.state.pipe(
        map(state => state.type === 'loading')
    );

    /**
     * TODO:
     * Emit true only when model is idle
     */
    readonly isIdle = this.state.pipe(
        map(state => state.type === 'idle')
    );

    /**
     * TODO:
     * Emit rows only when state === "loaded"
     * Should emit empty array for idle/loading
     */
    readonly rowsToDisplay = this.state.pipe(
        map(state =>
            state.type === 'loaded' ? state.rows : []
        )
    );

    /**
     * Called by UI when user selects a project
     */
    updateProjectID(projectID: string) {
        // TODO: push project ID into the stream
        this._projectID.next(projectID);
    }
}

const tableRows: TableRowsModel = new( TableRowsModel );
tableRows.updateProjectID('project1');
//tableRows.updateProjectID('project2');
//tableRows.updateProjectID('project1');


/*
How does this work?


!!! switchMap is for mapping a value to anything async and flattening it into the stream

Flattening means: Subscribing to the inner async source and re-emitting its values on the outer stream.
Flattening is the act of turning “a stream of async things” into “a stream of their results”.
*/