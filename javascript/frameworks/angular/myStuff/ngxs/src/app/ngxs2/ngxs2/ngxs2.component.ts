import { Component, OnInit } from '@angular/core';
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {Ngxs2PopulateState, Ngxs2Selectors} from "../ngxs2-state";
import {Observable} from "rxjs";
import {Ngxs1Selectors} from "../../ngxs1/ngxs1-state";

@Component({
  selector: 'app-ngxs2',
  templateUrl: './ngxs2.component.html',
  styleUrls: ['./ngxs2.component.css']
})
export class Ngxs2Component implements OnInit {

  // need to select our selectors
  @Select(Ngxs2Selectors.getMyNum) myState$!: Observable<number>

  obs1!: Observable<any>;
  constructor(private store: Store, private actions$: Actions) { }

  ngOnInit(): void {
    console.log('in ngoninit');
    this.actions$.pipe(ofActionSuccessful(Ngxs2PopulateState)).subscribe(() => this.myState$.subscribe(x => console.log('successful action = ' + x)));
    //this.actions$.pipe(ofActionSuccessful(Ngxs2PopulateState)).subscribe( ()=> console.log('action successful'));

    //this.myState$.subscribe(x => console.log('1st subscribe num = ' + x));
    console.log('about to dispatch action');
    this.store.dispatch( new Ngxs2PopulateState() );  // so observable is returned
    console.log('dispatched action');
    //this.myState$.subscribe(x => console.log('2nd subscribe num = ' + x));
  }

}
