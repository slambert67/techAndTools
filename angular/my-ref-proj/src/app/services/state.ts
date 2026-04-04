import { Injectable } from '@angular/core';
import { RestApi } from './rest-api';
import { BehaviorSubject, catchError, EMPTY, Observable, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationState } from '../interfaces/interfaces';

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
    console.log('state loading data');
    this._api.loadAllData().pipe(
      tap(data => {
        // Update state with API data
        this.applicationState.next({ payload:[], notification: 'Data loaded successfully' });
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
