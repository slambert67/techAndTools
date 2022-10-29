/*
Together, the COMPONENT and its TEMPLATE describe a VIEW
COMPONENT controls a patch of screen called a VIEW
The TypeScript class defines the interaction of the HTML template and the rendered DOM structure
The COMPONENT can also define a VIEW HIERARCHY, which contains EMBEDDED VIEWS, hosted by other COMPONENTS
A VIEW HIERARCHY can include VIEWS from COMPONENTS in the same NgModule and from those in different NgModules.
TEMPLATE  - use DATA BINDING to coordinate the application and DOM data
          - PIPES to transform data before it is displayed
          - DIRECTIVES to apply application logic to what gets displayed.

 */


import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',  // COMPONENT'S HOST VIEW
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  players!: string[];
  selectedPlayer!: string;
  twoWayBinding!: number;

  ngOnInit() {
    this.players = ['Kasparov', 'Carlsen', 'Fischer'];
  }

  selectPlayer( player: string ) {
    this.selectedPlayer = player;
  }

  doubleNumber() {
    this.twoWayBinding = this.twoWayBinding * 2;
  }
}
