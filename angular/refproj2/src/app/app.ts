import { Component, OnInit, signal } from '@angular/core';
import { State } from './services/state';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{

  constructor( public _state: State){};

  handleRowSelected(item: any) {
    console.log('row selection detected in app');
    console.log(item);

    // update state with selected row
    this._state.updateSelectedUser(item);
  }

  ngOnInit() {
    this._state.retrieveAllData();
    console.log()
  }
}
