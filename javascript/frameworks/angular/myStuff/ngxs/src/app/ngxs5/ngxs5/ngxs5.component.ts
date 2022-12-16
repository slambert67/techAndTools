import { Component, OnInit } from '@angular/core';
import {Select} from "@ngxs/store";
import {NavigationModel, NavigationSelectors, NavigationState} from "./ngxs5-state";
import {Observable} from "rxjs";

@Component({
  selector: 'app-ngxs5',
  templateUrl: './ngxs5.component.html',
  styleUrls: ['./ngxs5.component.css']
})
export class Ngxs5Component implements OnInit {

  // No selectors defined in state. Pass state class
  @Select(NavigationState) navigation$!: Observable<NavigationModel>;

  // Use a memoized selector
  @Select(NavigationState.getRoute) route$!: Observable<string>;

  // returns undefined as selector not defined in state class
  //@Select(NavigationSelectors.getRoute) route$!: Observable<string>;


  constructor() { }

  ngOnInit(): void {

    this.navigation$.subscribe(x=>console.log(x));
    this.route$.subscribe(x=>console.log(x));
  }

}
