import {Action, createSelector, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

export interface myNgxs4NumModel {
  myNums: number[];
}

// ACTIONS
/*export class Ngxs4PopulateState {
  static readonly type = '[NGXS4] Get';
  constructor() {}
}*/

@State<myNgxs4NumModel>( {
  name: 'ngxs4',
  defaults: {
    myNums: [1,2,3,4,5]
  }
})
@Injectable()
export class Ngxs4State {

  constructor( private _http: HttpClient ) {}

}

// SELECTORS
export class Ngxs4Selectors {

  // basic selector
  @Selector([Ngxs4State])
  static getMyNum(state: myNgxs4NumModel): number {
    //console.log('In getMyState selector');
    // not repeatedly invoked? Must be registered with framework somehow
    return state.myNums[2];
  }

  // dynamic selector
  static getRequestedNumDyn(index: number) {
    return createSelector([Ngxs4State], (state: myNgxs4NumModel) => {
      return state.myNums[index];
    });
  }

  // lazy selector
  @Selector([Ngxs4State])
  static getRequestedNumLazy(state: myNgxs4NumModel) {
    console.log('In getRequestedNumLazy');
    console.log(state);
    return (index: number) => {
      console.log('In returnedfn');
      console.log(state);
      return state.myNums[index];
    }
  }

}
