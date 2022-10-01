import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MyService {
  constructor(private _http: HttpClient) {}

  fetchMainTabConfig(): Observable<any> {
    return this._http.get('assets/main-tab-config.json');
  }

  fetchColumnDefs(): Observable<any> {
    return this._http.get('assets/grid-columns.json');
  }

  fetchColumnsToDisplay(): Observable<any> {
    return this._http.get('assets/grid-columns-to-display.json');
  }

  fetchGateData(): Observable<any> {
    return this._http.get('assets/gates.json');
  }

  fetchFlightData(flightARI: number): Observable<any> {
    return this._http.get('assets/flights.json');
    //return this._http.get('http://10.172.252.8:4000/v1/flights?id=' + flightARI);
  }

}
