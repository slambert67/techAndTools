import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestApi {
  
  constructor( private _http: HttpClient) {}

  retrieveAllData() : Observable<any[]>{
    console.log('getting data from api service');

    return this._http.get<any[]>('/refproj');

  }
}
