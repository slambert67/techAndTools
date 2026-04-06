import { Injectable } from '@angular/core';
import { Api } from './api';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApplicationState } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class State {
  
  private applicationState = new BehaviorSubject<ApplicationState>({
    untransformedPayload: [],
    transformedPayload:[]
  });
  public appState$: Observable<any>;


  
  constructor( private _api:Api){
    this.appState$ = this.applicationState.asObservable();
  }

  loadAllData() {
    this._api.loadAllData().pipe(
      // reduce payload size
      map( (data: any[]) => data.slice(0,1)),

      // update application state with untransformed payload
      tap( (data: any[]) => {
        this.applicationState.next({
          ...this.applicationState.value,
          untransformedPayload: data
        })
      }),

      // update application state with trtransformed payload
      tap( (data: any[]) => {
        this.applicationState.next({
          ...this.applicationState.value,
          transformedPayload: this.transformPayload(data)
        })
      }),
    ).subscribe( (data) => console.log(data));    
  }

  private transformPayload(data: any[]): any[] {
    //return [1,2,3,4,5]

    return data.
    map( (entry) => {
      // transform each entry

      // transform user
      const user = {
        id: Number(entry.user.id) || 0,
        fullName: `${entry.user?.name?.first ?? 'Unknown first name'} ${entry.user?.name?.last ?? 'Unknown last name'}`,
        email: entry.user?.email ?? 'No email address',
        phone: String(entry.user?.phone ?? 'No phone number'),

      };

      // transform accounts
      const accounts = entry.accounts.map( (entry:any) => {
        return {
            id: `${entry.accountId ?? 'unknown accound id'} - ${entry.type ?? 'unknown account type'}`,
            balance: Number(entry.balance) ?? 0
        };
      });

      // transform alerts
      const alerts = entry.alerts.map( (entry:any) => {
        return {
          id: entry.id,
          createdAt: entry.createdAt ? new Date(entry.createdAt) : null
        }
      });

      return {
        user:user,
        accounts: accounts,
        portfolioSummary: entry.portfolioSummary,
        alerts: alerts
      }

  

    } );
  }

}
