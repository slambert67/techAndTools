import {Action, createSelector, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

export interface Ngxs4StateModel {
  myNums: number[];
  myStrings: string[];
}

// ACTIONS
/*export class Ngxs4PopulateState {
  static readonly type = '[NGXS4] Get';
  constructor() {}
}*/

@State<Ngxs4StateModel>( {
  name: 'ngxs4',
  defaults: {
    myNums: [1,2,3,4,5],
    myStrings: ['a', 'b', 'c', 'd', 'e']
  }
})
@Injectable()
export class Ngxs4State {

  constructor( private _http: HttpClient ) {}

  // Memoized selectors
  @Selector()
  static getMyNums(state: Ngxs4StateModel) {
    return state.myNums;
  }

  // Lazy selector
  @Selector()
  static getNumByIndexLazy(state: Ngxs4StateModel) {
    // return a function
    return (index:number) => {
      return state.myNums[index];
    }
  }

  // Dynamic selector
  static getNumByIndexDynamic(index: number) {
    // return a function that creates a selector
    return createSelector([Ngxs4State], (state: Ngxs4StateModel) => {
      return state.myNums[index];
    });
  }
}

// SELECTORS
export class Ngxs4Selectors {


 // basic memoized selector
/*  @Selector([Ngxs4State])
  static getMyNums(state: Ngxs4StateModel): number[] {
    return state.myNums;
  }*/

  /*
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
  }*/

}
