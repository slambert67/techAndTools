import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { PayloadRecord } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RestApi {
  
  constructor( private _http: HttpClient ) {}

  loadAllData() {
    return this._http.get<PayloadRecord[]>('/refproj').pipe(
      catchError( (error: HttpErrorResponse) => {
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
