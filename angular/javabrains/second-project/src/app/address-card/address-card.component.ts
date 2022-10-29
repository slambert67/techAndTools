import { Component, OnInit, Input } from '@angular/core';
import { User } from './user.model';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.css']
})
export class AddressCardComponent implements OnInit {

  //user: any;  // will ultimately pass this in as parameter from higher level component

  // reworked to pass in object instead of individual values
  // @Input('name') userName!: string;  // ! indicates we are aware variable is not initialised
  @Input('user') user: User;

  isCollapsed: boolean = true;

  constructor() { 
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit(): void {
    // not needed as object populated on input
    /*
    this.user = {
      name: this.userObj.name,
      title: this.userObj.designation,
      address: this.userObj.address,
      phone: this.userObj.phone
    }*/
  }

}
