import { Component } from '@angular/core';
import { State } from '../../services/state';

@Component({
  selector: 'app-user-container',
  standalone: false,
  templateUrl: './user-container.html',
  styleUrl: './user-container.css',
})
export class UserContainer {

  constructor( public _state: State) {
  }
}
