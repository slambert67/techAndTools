import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  
  constructor( private _http:HttpClient) {
  }

  loadAllData() : Observable<any[]>{
    return this._http.get<any[]>('/server/refproj').pipe(
      catchError( (error:HttpErrorResponse) => {
        let message = 'Unknown error';
        if (error.status === 0) {
            message = 'Server not reachable';
        } else if (error.status >= 500) {
            message = 'Server error';
        } else if (error.status === 404) {
            message = 'Resource not found';
        }
        return throwError(() => new Error(message));
      })
    );
  }
}
