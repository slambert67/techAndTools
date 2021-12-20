import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {

  // member variables can be referenced from view with {{}}
  //message = 'hello';
  //message: string = new Date().toDateString();
  dateMessage: string;
  someNumber: number = 10;

  constructor() {

    setInterval( () => {
      const currentDate = new Date();
      this.dateMessage = currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString();
    }, 1000);

  }

  ngOnInit() {
  }

}
