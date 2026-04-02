import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserDetails } from "../interfaces/interfaces";

@Injectable({
  providedIn: 'root',
})
export class APIService {
  

  constructor(private _http: HttpClient) {

  }

  loadData(): Observable<UserDetails[]> {
    return this._http.get<UserDetails[]>('/users');
  }
}