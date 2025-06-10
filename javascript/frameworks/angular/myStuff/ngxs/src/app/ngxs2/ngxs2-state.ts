import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {myNgxs1NumModel, Ngxs1State} from "../ngxs1/ngxs1-state";

export interface myNgxs2NumModel {
  myNum: number;
}


// ACTIONS
export class Ngxs2PopulateState {
  static readonly type = '[NGXS2] Get';
  constructor() {}
}


@State<myNgxs2NumModel>( {
  name: 'ngxs2',
  defaults: {
    myNum: -1
  }
})
@Injectable()
export class Ngxs2State {

  constructor( private _http: HttpClient) {}

  @Action(Ngxs2PopulateState)
  populateState( ctx: StateContext<myNgxs2NumModel>, action: Ngxs2PopulateState) {
    console.log('in Ngxs2PopulateState');
    //console.log('In getnum action');
/*    this._http.get('ngxs/assets/my-num.json').subscribe(x=>console.log(x));*/  // retrieved asset correctly

    /*
    In ngxs when you do asynchronous work you should return an Observable from your @Action method that represents that asynchronous work
     */
    this._http.get('ngxs/assets/my-num.json').subscribe(
      (x) => {
        //console.log(x);
        ctx.getState();
        ctx.setState( {myNum:777} );
      }
    );
    console.log('leaving Ngxs2PopulateState');
    /*
    If you return an Observable NGXS will subscribe to the observable for you and bind the action's
    completion lifecycle event to the completion of the Observable.
     */
  }
}

// SELECTORS
export class Ngxs2Selectors {

  @Selector([Ngxs2State])
  static getMyNum(state: myNgxs2NumModel): number {
    //console.log('In getMyState selector');
    // not repeatedly invoked? Must be registered with framework somehow
    console.log('returning from selector' + state.myNum);
    return state.myNum;
  }

}
