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
      allUserDetails:[],
      selectedUser: undefined,
      loading:true
    }
  )

  public appState$: Observable<ApplicationState>


  constructor(private _api:ApiService) {
    this.appState$ = this.applicationState.asObservable();
  }

  updateSelectedUser(name:User) {
    console.log('update selected user');
    console.log(name);

    const userdetails = this.applicationState.value.allUserDetails.find( (x) => name.name === x.name);

    this.applicationState.next({
      ...this.applicationState.value,
      selectedUser:userdetails
    });
  }

  getSelectedUserDetails() {
    return 
  }

  loadAllData() {
    this.loadUsers();
    this.loadAllUserDetails();
  }

  loadUsers() {

    this._api.loadUsers().subscribe({
      next: (users) => {
        // update application state
        this.applicationState.next({
          ...this.applicationState.value,
          users: users
        });
      }
    });


  }

  loadAllUserDetails() {

    this._api.loadAllUserDetails().subscribe({
      next: (userDetails) => {
        console.log('user details retrieved');
        //console.log(userDetails);

        // update application state
        this.applicationState.next({
          ...this.applicationState.value,
          allUserDetails: userDetails,
          loading: false
        });
        //this.applicationState.next({x:'userdetails'});
      }
    });
  }

/*
@Injectable({ providedIn: 'root' })
export class UsersStore {
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private api: UsersApi) {}

  loadUsers() {
    this.loading.set(true);

    this.api.getUsers().subscribe({
      next: users => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  selectUser(id: number) {
    this.loading.set(true);

    this.api.getUser(id).subscribe({
      next: user => {
        this.selectedUser.set(user);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
*/
}
