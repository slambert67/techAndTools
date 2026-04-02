import { Component, OnInit } from '@angular/core';
import { StateService } from '../../services/state-service';

@Component({
  selector: 'app-users-container',
  standalone: false,
  templateUrl: './users-container.html',
  styleUrl: './users-container.css',
})
export class UsersContainer implements OnInit{

  constructor(public _state: StateService) { }

  ngOnInit() {
    
  }
}
