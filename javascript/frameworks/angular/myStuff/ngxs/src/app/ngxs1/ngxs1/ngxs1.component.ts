import { Component, OnInit } from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {myNgxs1NumModel, Ngxs1IncrementAction, Ngxs1Selectors} from "../ngxs1-state";
import {Observable} from "rxjs";

@Component({
  selector: 'app-ngxs1',
  templateUrl: './ngxs1.component.html',
  styleUrls: ['./ngxs1.component.css']
})
export class Ngxs1Component implements OnInit {

  // need to select our selectors
  @Select(Ngxs1Selectors.getMyState) myState$!: Observable<string>

  public _state!: any;
  constructor(private store: Store) { }

  ngOnInit(): void {
    // retrieve default value
/*    this.myState$.subscribe(x=>console.log(x));*/

    // increment
    this.store.dispatch( new Ngxs1IncrementAction() )
      .subscribe( ( (x)=> {this._state = x}) );  // returns state

    // returns an observable?

    // retrieve incremented value
/*    this.myState$.subscribe(x=>console.log(x));*/
  }


}
