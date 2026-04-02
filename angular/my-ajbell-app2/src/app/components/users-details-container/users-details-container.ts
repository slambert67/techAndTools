import { Component } from '@angular/core';
import { StateService } from '../../services/state-service';

@Component({
  selector: 'app-users-details-container',
  standalone: false,
  templateUrl: './users-details-container.html',
  styleUrl: './users-details-container.css',
})
export class UsersDetailsContainer {

  constructor(public _state: StateService) { }
}
