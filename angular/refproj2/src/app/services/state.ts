import { Injectable } from '@angular/core';
import { RestApi } from './rest-api';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
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
    userSummary:[],
    selectedUser:{},
    appState: 'Initialising ...'
  });

  public appState$: Observable<ApplicationState>;

  constructor( private _api: RestApi){
    this.appState$ = this.applicationState.asObservable();
  };

  retrieveAllData() {
    console.log('getting data from state revice');
    //this._api.retrieveAllData().subscribe((data) => {console.log('data retrieved into state');console.log(data)});

    this._api.retrieveAllData().pipe(
      map( (data) => data.slice(1,3)),

      // 1 tap for each transformation
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
      } ),
      tap( () => {
        this.applicationState.next({
          ...this.applicationState.value,
          appState: 'Data loaded successfully'
        });          
      }) 
    ).subscribe();
  }

  private summariseUsers(data:any) {
    let summarisedUsers: any[];

    summarisedUsers = data.map( (entry:any) => {
      //console.log(entry);
      const transformedEntry = {
        summariseduser: { id: entry.user.id, 
                          fullName: `${entry.user.name.first} ${entry.user.name.last}`, 
                          contact: `${entry.user.email ?? 'unknown'} : ${entry.user.phone ?? 'unknown'}`}
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
                contact: `${entry.user.email ?? 'unknown'} : ${entry.user.phone}`},
        accounts: ['acc1', 'acc2'],
        portfolioSummary: 'portfolioSummary',
        alerts: ['foo', 'bar']
      }
      return transformedEntry;
    });

    return transformedPayload;
  }

  updateSelectedUser(row:any) {
    const selecteduser = this.applicationState.value.untransformedPayload.find( (entry) => {
      return entry.user.id === row.summariseduser.id;
    });

    this.applicationState.next({
      ...this.applicationState.value,
      selectedUser: selecteduser
    });   

    console.log(this.applicationState.value);
    //console.log(row);
   // console.log(this.applicationState.value.untransformedPayload);
   //console.log(selecteduser);
  }
}
