import { Injectable } from '@angular/core';
import { RestApi } from './rest-api';
import { BehaviorSubject, catchError, EMPTY, map, Observable, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationState, TransformedPayloadRecord } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class State {
  
  private applicationState = new BehaviorSubject<ApplicationState>({
    payload:[],
    notification: 'Loading Data ...'
  });
  public appState$: Observable<ApplicationState>;

  constructor( private _api: RestApi) {
    this.appState$ = this.applicationState.asObservable();
  }

  loadAllData() {
    this._api.loadAllData().pipe(
      // transform payload
      map( (payloadRecords: any[]) => {

        return payloadRecords.map( (n) => {
          return {
            name: `${n.user.name.first} ${n.user.name.last}`,
            contact: `${n.user.email} ${n.user.phone}`,
            accounts: n.accounts.map( (acc:any) => acc.accountId)
          }
        });

      }),
      tap(data => {
        // Update state with API data
        this.applicationState.next({  ...this.applicationState.value,
                                      payload:data, 
                                      notification: 'Data loaded successfully' });
      }),
      catchError( (error: HttpErrorResponse) => {
        console.log('state has caught error');
        this.updateApplicationState();
        return EMPTY;
      })
    ).subscribe();
  }


  updateApplicationState() {
    console.log('updating application state');
    this.applicationState.next({
      ...this.applicationState.value,
      notification: 'squoink error'
    });
  }
}
