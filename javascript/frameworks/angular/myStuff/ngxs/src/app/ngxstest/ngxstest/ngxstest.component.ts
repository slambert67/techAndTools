import {Component, OnDestroy, OnInit} from '@angular/core';
import {Actions, ofActionCompleted, ofActionDispatched, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {Observable, Subject, takeUntil} from "rxjs";
import {
  myNgxstestModel,
  myObjInner,
  myObjOuter,
  NgxstestAddtoMyobjs, NgxstestPatchSquoinkStr,
  NgxstestShowState,
  NgxstestUpdateMynum
} from "../ngxstest-state";
import {Ngxs2PopulateState} from "../../ngxs2/ngxs2-state";

@Component({
  selector: 'app-ngxstest',
  templateUrl: './ngxstest.component.html',
  styleUrls: ['./ngxstest.component.css']
})
export class NgxstestComponent implements OnInit, OnDestroy {

  public _state!: myNgxstestModel;
  private ngUnsubscribe = new Subject();

  constructor(private store: Store, private actions$: Actions) { }

  ngOnInit(): void {

/*    console.log('setup action lifecycle listeners')
    this.actions$.pipe(ofActionDispatched(NgxstestShowState),takeUntil(this.ngUnsubscribe)).subscribe((x)=>{console.log('ofActionDispatched');console.log(x)});
    this.actions$.pipe(ofActionCompleted(NgxstestShowState),takeUntil(this.ngUnsubscribe)).subscribe((x)=>{console.log('ofActionCompleted');console.log(x)});
    this.actions$.pipe(ofActionSuccessful(NgxstestShowState),takeUntil(this.ngUnsubscribe)).subscribe((x)=>{console.log('ofActionSuccessful');console.log(x)});

    // Dispatch an action
    console.log('dispatch action');
    this.store.dispatch( new NgxstestShowState() ).subscribe((state)=>{console.log('subscribed to dispatch');console.log(state)});
    console.log('action dispatched');*/

    // simple state update
    this.store.dispatch( new NgxstestUpdateMynum(666) ).subscribe(x=>console.log(x));
    this.store.dispatch( new NgxstestUpdateMynum(777) ).subscribe(x=>console.log(x));

    // add first (incomplete) entry to myobjs
    let inner1:myObjInner = {numkey:1, strkey:'a'};
    let outer1:myObjOuter = {singleObj:inner1, arrayofObjs:[],squoink:123,str:'123'};
    this.store.dispatch( new NgxstestAddtoMyobjs(outer1) ).subscribe(x=>console.log(x));

    // add second (incomplete) entry to myobjs
    let inner2:myObjInner = {numkey:2, strkey:'b'};
    let outer2:myObjOuter = {singleObj:inner2, arrayofObjs:[],squoink:456,str:'456'};
    this.store.dispatch( new NgxstestAddtoMyobjs(outer2) ).subscribe(x=>console.log(x));

    // patch entry where squoink = 123
    console.log('patch squoink');
    this.store.dispatch( new NgxstestPatchSquoinkStr() ).subscribe(x=>console.log(x));

  }

  ngOnDestroy() {
    // recommended way to unsubscribe
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
