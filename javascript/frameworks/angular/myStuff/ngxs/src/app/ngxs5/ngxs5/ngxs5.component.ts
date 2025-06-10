import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {NavigationModel, NavigationSelectors, NavigationState} from "./ngxs5-state";
import {Observable} from "rxjs";

@Component({
  selector: 'app-ngxs5',
  templateUrl: './ngxs5.component.html',
  styleUrls: ['./ngxs5.component.css']
})
export class Ngxs5Component implements OnInit {

  // No selectors defined in state. Pass state class
  @Select(NavigationState) myNavigation$!: Observable<NavigationModel>;

  // read name of state from parameter
  @Select() navigation$!: Observable<NavigationModel>;

  // Use a memoized selector
  @Select(NavigationState.getRoute) route$!: Observable<string>;

  // returns undefined as selector not defined in state class
  //@Select(NavigationSelectors.getRoute) route$!: Observable<string>;

  // Pass function as per store.select. Returns undefined. Should this work???
  @Select( (state:any) => state.route ) route2$!: Observable<string>;

  @Select(NavigationState.getGridColumns) gridColumns$!: Observable<string>;

  constructor(private store: Store) {
    // can also select using store. Undefined. Why ???
    //this.store.select( (state) => state.route).subscribe(x=>console.log('store select ' + x));
  }

  ngOnInit(): void {

/*    this.myNavigation$.subscribe(x=>console.log(x));
    this.myNavigation$.subscribe(x=>console.log(x));
    this.route$.subscribe(x=>console.log(x));
    this.route2$.subscribe(x=>console.log(x));*/

    // combine selectors
    this.gridColumns$.subscribe(x=>console.log(x));

  }

}
