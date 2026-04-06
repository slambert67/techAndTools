import { Component, OnInit, signal } from '@angular/core';
import { State } from './services/state';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{


  constructor( public _state: State){}


  ngOnInit() {
    this._state.loadAllData();
  }
}
