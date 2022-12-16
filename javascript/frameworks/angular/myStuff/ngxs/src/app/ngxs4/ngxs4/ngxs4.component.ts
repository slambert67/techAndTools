import { Component, OnInit } from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {Ngxs4Selectors} from "../../ngxs4/ngxs4-state";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-ngxs4',
  templateUrl: './ngxs4.component.html',
  styleUrls: ['./ngxs4.component.css']
})
export class Ngxs4Component implements OnInit {

  // selector with no parameters
  @Select(Ngxs4Selectors.getMyNum) myState$!: Observable<number>

  // dynamic selector taking one parameter
  @Select(Ngxs4Selectors.getRequestedNumDyn(4)) myState2$!: Observable<number>

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.myState$.subscribe( (x) => console.log(x));
    this.myState2$.subscribe( (x) => console.log(x));

    this.store
      .select(Ngxs4Selectors.getRequestedNumLazy)
      .pipe( map(returnedFn => returnedFn(1)) )
      .subscribe( x => console.log(x));
  }

}
