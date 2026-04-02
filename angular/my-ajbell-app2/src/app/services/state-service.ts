import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApplicationState, User } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  
  private applicationState = new BehaviorSubject<ApplicationState>(

    // initial state
    {
      users:[],
      allUserDetails:[]
    }
  )

  public appState$: Observable<ApplicationState>


  constructor(private _api:ApiService) {
    this.appState$ = this.applicationState.asObservable();
  }


  loadAllData() {
    this.loadUsers();
    this.loadAllUserDetails();
  }

  loadUsers() {

    this._api.loadUsers().subscribe({
      next: (users) => {
        console.log('users retrieved');
        console.log(users);

        // update application state
        this.applicationState.next({
          ...this.applicationState.value,
          users: users
        });
        //this.applicationState.next({x:'users'});
      }
    });


  }

  loadAllUserDetails() {

    this._api.loadAllUserDetails().subscribe({
      next: (userDetails) => {
        console.log('user details retrieved');
        console.log(userDetails);

        // update application state
        this.applicationState.next({
          ...this.applicationState.value,
          allUserDetails: userDetails
        });
        //this.applicationState.next({x:'userdetails'});
      }
    });
  }
}
