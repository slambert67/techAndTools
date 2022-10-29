import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  clickEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onClick(p_event: any) {

    this.clickEvent.emit();
/*    console.log("clicked");
    console.log(p_event);*/


  }
}
