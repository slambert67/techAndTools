import { Component, OnInit, Input } from '@angular/core';
import { User } from './user.model';

@Component({
  selector: 'app-address-card2',
  templateUrl: './address-card2.component.html',
  styleUrls: ['./address-card2.component.css']
})
export class AddressCard2Component implements OnInit {

  // decorator that accepts user object from component tag app-address-card2 (passed from app component)
  @Input('user') user: User;

  isCollapsed: boolean = true;

  constructor() { }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit() {
  }

}
