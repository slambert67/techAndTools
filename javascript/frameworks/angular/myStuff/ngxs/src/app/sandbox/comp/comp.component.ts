import { Component, OnInit } from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {Mutate1} from "./comp-state";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-comp',
  templateUrl: './comp.component.html',
  styleUrls: ['./comp.component.css']
})
export class CompComponent implements OnInit {


  constructor(private _store: Store) { }

  ngOnInit(): void {

  }

  onClickMutate() {

    this._store.dispatch( new Mutate1() );
  }


}
