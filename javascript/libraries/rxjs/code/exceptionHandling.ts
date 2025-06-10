// Gate Manager backend
@Get('gates')
@ApiOperation({ summary: 'List of gates and flight allocated' })
getGates(): Observable<any> {

    //return this.gatesService.fetchGates();
    return this.gatesService.fetchGates()
        .pipe(
            catchError( (err:any) => {
                console.log('controller');
                console.log(err.response.data);
                //return throwError( ()=> {new Error('Could not retrieve flights')});
                //console.log('rethrowing from controller');
                throw err;
                // return failed http response?
            })
        );

}


// Retrieve all gate allocations along with associated flight status details
fetchGates(): Observable<any> {

    // Define Observable to retrieve all flight departure details
    //const flights$ = this.httpService.get('http://10.172.252.8:4000/v2/flights/' + '?levelOfDetail=full&&direction=departure',
    const flights$ = this.httpService.get('http://10.172.252.8:4000/v2/flights/' + '?levelOfDetail=full&&direction=departure',
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Buffer.from ('REST_FLT_FULL:kUkeztqKQL5W23b6', 'utf-8').toString('base64')
            }
        }).pipe(
        catchError( (err:any) => {
            //console.log('flight$ error');
            //console.log(err.response.status);
            //console.log(err.response.statusText);
            console.log(err.response.data);
            //return throwError( ()=> {new Error('Could not retrieve from flights api')}); })
            throw err;
        })
    );


    // Define Observable to retrieve all gate details
    const gates$ = this.httpService.get('http://10.172.252.8:4000/v1/resources/gates?numberOfFlights=2&sort=terminal|gate',
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from('REST_RESOURCES_GATES:$W5ztv=xDxv@gu6@','utf-8').toString('base64')
            }
        });

    // Combine flight and gate details as required
    // Currently we need gateBoardingStatus from flight API
    return combineLatest(flights$, gates$)
        .pipe(
            mergeMap( ( [flights, gates] ) => {

                // Ensure gates with multiple flights are expanded into multiple rows
                const flattenedGates = gates.data.flatMap((g: Gate) => {
                    return g.flights?.filter((f) => f.direction === "departure")
                        .map((f) => ({flight: f, resource: {...g.resource}}));
                });

                // Initialise array to hold final response data
                let finalResultset = [];

                // Create array of objects that have the required gate and flight details
                flattenedGates.forEach( (flattenedGate) => {

                    // Find the flight at this gate from the previously retrieved flights
                    let searchedForFlight = flights.data.find( (flight)=> {
                        return flight.id === flattenedGate.flight.id
                    });

                    // Determine appropriate gate entry on flight to determine the status
                    let gateStatus!: string;
                    if ( flattenedGate.resource.name == searchedForFlight?.gates[0]?.gate ) {
                        // gate matches the flight's first gate i.e. GAT
                        gateStatus = searchedForFlight?.gates[0]?.gateBoardingStatus;
                    } else if ( flattenedGate.resource.name == searchedForFlight?.gates[1]?.gate ) {
                        // gate matches the flight's second gate i.e. GT2
                        gateStatus = searchedForFlight?.gates[1]?.gateBoardingStatus;
                    } else {
                        // no match
                        gateStatus = undefined;
                    }

                    // Add gate/flight object to response
                    finalResultset.push( {flight: {...flattenedGate.flight}, resource: {...flattenedGate.resource, status:gateStatus}} );
                });

                return of(finalResultset);  // merge map is flattening this. http only takes one result. So use 'of'
            })/*,
                catchError( (err:any) => {
                    console.log('inner pipe error');
                    //console.log(err);
                    //return throwError( ()=> {new Error('Could not retrieve flights')});
                    console.log('rethrowing inner');
                    throw err;
                })*/
        )
        .pipe(
            catchError( (err:any) => {
                console.log('outer pipe error');
                //console.log(err.response);
                //return throwError( ()=> {new Error('Could not retrieve flights')});
                console.log(err.response.data);
                console.log('rethrowing outer');
                throw err;
            })
        );
}







// Gate Manager frontend
fetchAllGateAllocations(): Observable<any> {
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa('REST_RESOURCES_GATES:$W5ztv=xDxv@gu6@')
        })
    };
    //return this._http.get('http://localhost:4000/v1/resources/gates?numberOfFlights=2&sort=terminal|gate', httpOptions);
    return this._http.get('http://localhost:3000/gates', httpOptions)
        .pipe(
            //catchError( (err) => {console.log('FAILED TO GET ALLOCATIONS'); console.log(err.statusText); return EMPTY})
            catchError( (err) => {
                // console.log(err);
                //console.log('FAILED TO GET ALLOCATIONS');
                //console.log(err.statusText);
                //return throwError( () => new Error('squoink'));
                console.log('Error caught in frontend http pipe');
                console.log(err);
                console.log('Error caught in frontend http pipe - rethrowing');
                return throwError( () => new Error('Rethrown: Error caught in http pipe'))
            })
        );
}


@Action(FetchAllGateAllocations)
fetchAllGateAllocations( ctx: StateContext<GateAllocationsStateModel>, action: FetchAllGateAllocations) {

    this._gateManagerService.fetchAllGateAllocations()
        .pipe(
            tap( (x)=>{console.log('tap - ignored if exception'); console.log(x)}),
            catchError(  // must return observable
                (err) => {
                    console.log('Error caught in action pipe');
                    //console.log(err);
                    //console.log('printing err as observable to be returned')
                    //console.log(from(err));
                    //return of([1,2,3]);  success
                    //return throwError( ()=>new Error('Error caught in pipe'))
                    throw err;
                }  // as observable?
            )
        )
        .subscribe(
            (allGateAllocations) => {
                console.log('in subscribe.next');
                const state = ctx.getState();
                ctx.setState({
                    ...state,
                    gateAllocations: allGateAllocations
                });
                this._notificationService.success('Successfully retrieved data from backend');
            },
            (err: any) => {
                console.log('Error caught in subscriber');
                console.log(err);
                this._notificationService.warn('Failed to retrieve data from backend');
            }
        )
}
