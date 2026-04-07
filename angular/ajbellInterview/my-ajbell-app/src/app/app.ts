import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {

  constructor(private _http:HttpClient) {

    this._http.get<any[]>('/server/refproj').subscribe( (data) => console.log(data));
  }
}
