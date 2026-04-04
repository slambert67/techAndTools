import { } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from './services/state';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {

  //payload$!: Observable<any[]>;

  constructor( public _state: State) {
    //this.payload$ = this._state.loadAllData();
    this._state.loadAllData();
  }
}
