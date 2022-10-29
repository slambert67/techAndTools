import { Component } from '@angular/core';
import { User } from './address-card/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  user: User;

  inputText: string = "Initial value 1";
  inputText2: string = "Initial value 2";

  constructor() {
    // create instance of User class to pass to address card component
    this.user = new User();
    this.user.name = 'foo bar';
    this.user.designation = 'software engineer';
    this.user.address = 'blah blah address';
    this.user.phone = [
      '123-123-123',
      '456-456-456'
    ]
  }
}
