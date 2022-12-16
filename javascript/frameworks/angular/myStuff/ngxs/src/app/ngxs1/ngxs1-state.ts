import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";

export interface myNgxs1NumModel {
  myNum: number;
}


// ACTIONS
export class Ngxs1IncrementAction {

  static readonly type = '[NGXS1] Increment';
  constructor() {}
}


@State<myNgxs1NumModel>( {
  name: 'ngxs1',
  defaults: {
    myNum: -1
  }
})
@Injectable()
export class Ngxs1State {

  @Action(Ngxs1IncrementAction)
  increment( ctx: StateContext<myNgxs1NumModel>, action: Ngxs1IncrementAction) {
    console.log('In IncrementAction');
    const state = ctx.getState();
    let incrementedVal = state.myNum + 1;
    ctx.setState( {myNum: incrementedVal} );
  }
}


// SELECTORS
export class Ngxs1Selectors {

  @Selector([Ngxs1State])
  static getMyState(state: myNgxs1NumModel): number {
    console.log('In getMyState selector');
    // not repeatedly invoked? Must be registered with framework somehow
    return state.myNum;
  }

}
