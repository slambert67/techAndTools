import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserDetails } from '../interfaces/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
  constructor(private _http: HttpClient) {}

  /*
 this.people$ = this.apiService.getPeople().pipe(
  map(arr => arr.slice(0, 10)) // only take first 10 rows
);
  */

  loadUsers(): Observable<User[]> {
    return this._http.get<User[]>('/users');
  }

  loadAllUserDetails(): Observable<UserDetails[]> {
    console.log('loading all user details');
    return this._http.get<UserDetails[]>('/allUserDetails');
  }
}
