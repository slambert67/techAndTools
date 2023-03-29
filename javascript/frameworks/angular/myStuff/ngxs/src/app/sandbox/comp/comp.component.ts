import { Component, OnInit } from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {DecNum, IncNum, NumState} from "./comp-state";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-comp',
  templateUrl: './comp.component.html',
  styleUrls: ['./comp.component.css']
})
export class CompComponent implements OnInit {

  //@Select(NumState.getNum) num$!: Subject<number>;
  @Select(NumState.getNum) num$!: Observable<number>;

  constructor(private _store: Store) { }

  ngOnInit(): void {

    console.log('In ngOnInit');
    this.num$.subscribe(
      (x) => console.log(x)
    );
  }

  onClickInc() {
    this._store.dispatch( new IncNum() );
  }

  onClickDec() {
    this._store.dispatch( new DecNum() );
  }
}
