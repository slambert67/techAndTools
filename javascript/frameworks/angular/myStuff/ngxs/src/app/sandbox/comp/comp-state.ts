import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {myNgxs3NumModel, Ngxs3PopulateState} from "../../ngxs3/ngxs3-state";

export interface NumModel {
  num: number;
}

// ACTIONS
export class IncNum {
  static readonly type = '[Sandbox] Increment';
  constructor() {}
}

export class DecNum {
  static readonly type = '[Sandbox] Decrement';
  constructor() {}
}

@State<NumModel>( {
  name: 'num',
  defaults: {
    num: 0
  }
})
@Injectable()
export class NumState {

  constructor() {}

  @Action(IncNum)
  incNum( ctx: StateContext<NumModel>) {

    let state = ctx.getState();
    let oldnum = state.num;
    let newnum = oldnum + 1;

    ctx.patchState( {num:newnum} );
  }

  @Action(DecNum)
  decNum( ctx: StateContext<NumModel>) {

    let state = ctx.getState();
    let oldnum = state.num;
    let newnum = oldnum - 1;

    ctx.patchState( {num:newnum} );
  }

  @Selector()
  static getNum( state: NumModel ): number {
    // state is populated unlike the selector defined outside this state class
    // could use arguments[0] instead of state
    return <number>state.num;
  }
}
