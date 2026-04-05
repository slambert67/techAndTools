import { Injectable } from '@angular/core';
import { RestApi } from './rest-api';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApplicationState, Transformation } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class State {

  private applicationState = new BehaviorSubject<ApplicationState>({
    untransformedPayload: ['Steve','Andy'],
    transformedPayload: [{
      user:{},
      accounts:[],
      portfolioSummary: {},
      alerts:[]
    }],
    userSummary:[]
  });

  public appState$: Observable<ApplicationState>;

  constructor( private _api: RestApi){
    this.appState$ = this.applicationState.asObservable();
  };

  retrieveAllData() {
    console.log('getting data from state revice');
    //this._api.retrieveAllData().subscribe((data) => {console.log('data retrieved into state');console.log(data)});

    this._api.retrieveAllData().pipe(
      tap( (data) => {
                        this.applicationState.next({
                          ...this.applicationState.value,
                          untransformedPayload:data
                        });
                      } ),
      tap ( (data) => {
        this.applicationState.next({
          ...this.applicationState.value,
          transformedPayload: this.transformPayload(data)
        });
      }),
      tap( (data) => {
        this.applicationState.next({
          ...this.applicationState.value,
          userSummary: this.summariseUsers(data)
        });       
      } )
    ).subscribe();
  }

  private summariseUsers(data:any) {
    let summarisedUsers: any[];

    summarisedUsers = data.map( (entry:any) => {
      //console.log(entry);
      const transformedEntry = {
        summariseduser: { id: entry.user.id, 
                          fullName: `${entry.user.name.first} ${entry.user.name.last}`, 
                          contact: `${entry.user.email} : ${entry.user.phone}`}
      }
      return transformedEntry;
    });

    return summarisedUsers;
  }


  private transformPayload(data:any): Transformation[] {

    let transformedPayload: Transformation[];
    transformedPayload = data.map( (entry:any) => {
      //console.log(entry);
      const transformedEntry = {
        user: { id: entry.user.id, 
                fullName: `${entry.user.name.first} ${entry.user.name.last}`, 
                contact: `${entry.user.email} : ${entry.user.phone}`},
        accounts: ['acc1', 'acc2'],
        portfolioSummary: 'portfolioSummary',
        alerts: ['foo', 'bar']
      }
      return transformedEntry;
    });

    return transformedPayload;
  }
}
