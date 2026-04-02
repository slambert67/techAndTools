import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs'
import { User, UserDetails } from '../interfaces/interfaces';
import { APIService } from './api';

interface State {
  users: User[];
  loading: boolean;
}


@Injectable({
  providedIn: 'root',
})
export class StateService {
  
  private stateSubject = new BehaviorSubject<State>({
    users: [],
    loading: false
  });

  public state$: Observable<State>; // expose state as readonly outside this service


  constructor(private _api: APIService) {
    this.state$ = this.stateSubject.asObservable();
  }


  loadData(): void {

    this.stateSubject.next({
        ...this.stateSubject.value,
        loading: true
    })

    this._api.loadData().subscribe({
        next: (users) => {
            console.log('updating statesubject');
            this.stateSubject.next({
                //...this.stateSubject.value,
                users: users
                loading: false
            })
        }
    });
  }

}
