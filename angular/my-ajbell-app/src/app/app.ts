import { Component, OnInit } from '@angular/core';
import { StateService } from './services/state';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {


  constructor( public _state: StateService ) {
  }

  ngOnInit(): void {
    this._state.loadData();
  }
}
