import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {patch} from "@ngxs/store/operators";


export interface myNgxs3NumModel {
  myNum: number;
}


// ACTIONS
export class Ngxs3PopulateState {
  static readonly type = '[NGXS3] Get';
  constructor() {}
}


@State<myNgxs3NumModel>( {
  name: 'ngxs3',
  defaults: {
    myNum: -1
  }
})
@Injectable()
export class Ngxs3State {

  constructor( private _http: HttpClient) {}

  @Action(Ngxs3PopulateState)
  populateState( ctx: StateContext<myNgxs3NumModel>, action: Ngxs3PopulateState) {

/*    this._http.get('ngxs/assets/my-num.json').subscribe(
      (x) => {
        ctx.setState(
          patch<myNgxs3NumModel>( {myNum:888})
        );
      }
    );*/

    // how is this different to above?
    this._http.get('ngxs/assets/my-num.json').subscribe(
      (x) => {
        ctx.patchState( {myNum:999} );
      }
    );

  }
}

// SELECTORS
export class Ngxs3Selectors {

  @Selector([Ngxs3State])
  static getMyNum(state: myNgxs3NumModel): number {
    //console.log('In getMyState selector');
    // not repeatedly invoked? Must be registered with framework somehow
    return state.myNum;
  }

}
