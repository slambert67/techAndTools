import { Component } from '@angular/core';
import { User } from './address-card2/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // uses address-card-2 component. Higher in hierarchy
  user: User;  // can be used in template with []

  // TWO WAY DATA BINDING
  inputText: string = 'Initial value';

  constructor() {
    this.user = new User();

    this.user.name = 'Kathleen Lambert';
    this.user.designation = 'Retired';
    this.user.address = '23 st michaels close';
    this.user.phone = ['01924 454121', '01924 454121'];
  }
}
