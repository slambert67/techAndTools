import { Component, OnInit } from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {Ngxs3Selectors} from "../../ngxs3/ngxs3-state";
import {Observable} from "rxjs";
import {Ngxs3PopulateState} from "../../ngxs3/ngxs3-state";

@Component({
  selector: 'app-ngxs3',
  templateUrl: './ngxs3.component.html',
  styleUrls: ['./ngxs3.component.css']
})
export class Ngxs3Component implements OnInit {

  // need to select our selectors
  @Select(Ngxs3Selectors.getMyNum) myState$!: Observable<number>

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch( new Ngxs3PopulateState() );
  }

}
