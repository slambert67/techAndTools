import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.css']
})
export class AddressCardComponent implements OnInit {

  user: any;

  // decorator that accepts name property from component tag app-address-card
  @Input('name') userName: string;

  constructor() {
  }

  // lifecycle method/hook. Invoked by angular
  // see implements onInit above
  ngOnInit() {

    this.user = {
      name: this.userName,
      title: 'Software Developer',
      address: '37 royston road',
      phone: [
        '0161 2826122',
        '07967 977357'
      ]
    };
  }

}
