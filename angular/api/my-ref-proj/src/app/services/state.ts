import { Injectable } from '@angular/core';
import { Api } from './api';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class State {
  
  private applicationState = new BehaviorSubject<any>({
    untransformedPayload: []
  });
  public appState$: Observable<any>;


  constructor( private _api:Api){
    this.appState$ = this.applicationState.asObservable();
  }

  loadAllData() {

    this._api.loadAllData().pipe(
      // reduce payload size
      map( (data) => data.slice(1,3)),

      // update application state
      tap( (data) => {
        this.applicationState.next({
          ...this.applicationState.value,
          untransformedPayload: data
        })
      })
    ).subscribe( (data) => console.log(data));
  }
}
