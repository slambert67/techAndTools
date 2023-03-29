import { Component, OnInit } from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {Ngxs4Selectors, Ngxs4State, Ngxs4StateModel} from "../../ngxs4/ngxs4-state";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-ngxs4',
  templateUrl: './ngxs4.component.html',
  styleUrls: ['./ngxs4.component.css']
})
export class Ngxs4Component implements OnInit {

  // select the whole state directly
  // Reads the name of the state from the state class
  @Select(Ngxs4State) wholeState$!: Observable<Ngxs4StateModel>;

  // select the whole state directly
  // Reads the name of the state from the parameter
  @Select() ngxs4$!: Observable<Ngxs4StateModel>;

  // select slice using memoized selector
  @Select(Ngxs4State.getMyNums) memoizedNums$!: Observable<string[]>;

  // Select state slice by passing a function like the select method
  // @Select(state => state.myNums) nums$: Observable<string[]>; TAKEN FROM NGXS SITE. DOES NOT WORK

  // parameterized lazy selector
  @Select(Ngxs4State.getNumByIndexLazy) lazy1$!: Observable<any>;


  // dynamic selector taking one parameter
  @Select(Ngxs4State.getNumByIndexDynamic(0)) dyn0$!: Observable<any>;
  @Select(Ngxs4State.getNumByIndexDynamic(1)) dyn1$!: Observable<any>;

  constructor(private _store: Store) { }


  ngOnInit() {

    this.wholeState$.subscribe( (selected) => {
      console.log('whole state selected directly using class as name');
      console.log(selected);
    });

    this.ngxs4$.subscribe( (selected) => {
      console.log('whole state selected directly using param as name');
      console.log(selected);
    });

    this.memoizedNums$.subscribe( (selected) => {
      console.log('state slice selected with memoized selector');
      console.log(selected);
    });

    // TAKEN FROM NGXS SITE. DOES NOT WORK
/*    this.nums$.subscribe( (selected) => {
      console.log('state slice selected directly by passing function');
      console.log(selected);
    });*/

    // snapshot select
    const snapshot = this._store.selectSnapshot<number[]>( (state) => state.ngxs4.myNums);
    console.log('state slice selected with snapshot');
    console.log(snapshot);

    // parameterized lazy selector
    // returns a function - memoized automatically
    // can take any number of arguments
    this.lazy1$.subscribe( (memoizedFunc:any) => {console.log('lazy');console.log(memoizedFunc(0))}).unsubscribe();
    this.lazy1$.subscribe( (memoizedFunc:any) => {console.log('lazy');console.log(memoizedFunc(1))}).unsubscribe();


    // dynamic selectors
    this.dyn0$.subscribe( x => {console.log('dyn0 = ' + x)});
    this.dyn1$.subscribe( x => {console.log('dyn1 = ' + x)});
  }
}
