import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {

  //message: string = new Date().toDateString();
  dateMessage: string = '';
  someNumber: number = 10;

  constructor() { 

    // => means 'this' refers to component instance
    setInterval( () => {
      let currentDate = new Date();
      this.dateMessage = currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString();
    }, 1000);

  }

  ngOnInit(): void {
  }

  addTwoNumbers(a: number,b: number) {
    return a+b;
  }

}
