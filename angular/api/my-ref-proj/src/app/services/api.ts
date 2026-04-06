import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  
  constructor( private _http:HttpClient) {
  }

  loadAllData() : Observable<any[]>{
    return this._http.get<any[]>('/server/refproj');
  }
}
