import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {append, patch, updateItem} from "@ngxs/store/operators";

export interface myObjOuter {
  singleObj: myObjInner;
  arrayofObjs: myObjInner[];
  squoink: number;
  str: string;
}

export interface myObjInner {
  numkey: number;
  strkey: string;
}

export interface myNgxstestModel {
  myNum: number;
  myObjs: myObjOuter[];
}


// ACTIONS
export class NgxstestShowState {

  static readonly type = '[NGXSTest] Show state';
  constructor() {}
}

export class NgxstestUpdateMynum {

  static readonly type = '[NGXSTest] UpdateMyNum';
  constructor( public newnum: number ) {}
}


export class NgxstestAddtoMyobjs {

  static readonly type = '[NGXSTest] AddtoMyobjs';
  constructor( public newobj: myObjOuter ) {}
}

export class NgxstestPatchSquoinkStr {

  static readonly type = '[NGXSTest] PatchSquoinkStr';
  constructor() {}
}

@State<myNgxstestModel>( {
  name: 'ngxstest',
  defaults: {
    myNum: -1,
    myObjs: []
  }
})
@Injectable()
export class NgxstestState {

  @Action(NgxstestShowState)
  ngxstestShowState( ctx: StateContext<myNgxstestModel>) {

    console.log('In NgxstestShowState Action. State= ');
    console.log(ctx.getState());
  }

  @Action(NgxstestUpdateMynum)
  ngxstestUpdateMynum( ctx: StateContext<myNgxstestModel>, action: NgxstestUpdateMynum ) {
    //let state = ctx.getState();
    ctx.setState(
      patch({
        myNum: action.newnum
      })
    )
  }

  @Action(NgxstestAddtoMyobjs)
  ngxstestAddtoMyobjs( ctx: StateContext<myNgxstestModel>, action: NgxstestAddtoMyobjs) {
    ctx.setState(
      patch({
        myObjs: append<myObjOuter>([action.newobj])
      })
    )
  }

  @Action(NgxstestPatchSquoinkStr)
  ngxstestPatchSquoinkStr( ctx: StateContext<myNgxstestModel>, action: NgxstestPatchSquoinkStr) {

    // this loses singleObj and arrayofObjs
/*    ctx.setState( patch({
      myObjs:updateItem( entry => entry?.squoink === 123, {squoink:123, str:'321'} )
    }));*/

    // specify type + all keys - workd
/*    ctx.setState( patch({
      myObjs:updateItem<myObjOuter>( entry => entry?.squoink === 123, {singleObj:{numkey:6,strkey:'g'}, arrayofObjs:[], squoink:123, str:'321'} )
    }));*/

    // try with spread operator. ...singleObj, ...arrayofObjs NOT RECOGNIZED
/*    ctx.setState( patch({
      myObjs:updateItem<myObjOuter>( entry => entry?.squoink === 123, {...singleObj, ...arrayofObjs, squoink:123, str:'321'} )
    }));*/

    // try with patch - works
    ctx.setState( patch({
      myObjs:updateItem<myObjOuter>( entry => entry?.squoink === 123, patch<myObjOuter>({
        str:'321'
      }) )
    }));
  }
}


// SELECTORS
/*export class NgxstestSelectors {

  @Selector([NgxstestState])
  static getMyState(state: myNgxstestModel): number {
    console.log('In getMyState selector');
    console.log(state);
    return state.myNum;
  }

}*/


/*
Notes on nesting
[
   {
      name: "Main Tree",
      branches: [
        {
          name: "Branch 1",
          branches: []
        },
        {
          name: "Branch 2",
          branches: [
            {
              name: "Sub Branch 1",
              branches: []
            }
          ]
        }
      ]
   }
]

// import { append, patch, updateItem } from '@ngxs/store/operators';

interface BranchTree {
  name: string;
  branches: BranchTree[];
}

type BranchStateModel = Array<BranchTree>;

//..
@Action(UpdateSubBranch)
updateSubBranch({ setState }: StateContext<BranchStateModel>) {
  const newBranch: BranchTree = {
    name: 'Sub 1 of Sub Branch 1',
    branches: [],
  };
  setState(
    updateItem(
      (branch) => branch.name === 'Main Tree',
      patch({
        branches: updateItem<BranchTree>(
          (subBranch) => subBranch.name === 'Branch 2',
          patch({
            branches: updateItem<BranchTree>(
              (subBranch) => subBranch.name === 'Sub Branch 1',
              patch({ branches: append([newBranch]) })
            ),
          })
        ),
      })
    )
  );
}

 */


/*
More notes
Also the updateItem operator can take a function as the second argument where you can update your object. As a result the code becomes more declarative:

ctx.setState(
  patch({
    portals: updateItem(
      portal => portal.id === state.portalId,
      portal => {
        const newPortal = { ...portal };
        newPortal.style.logo = logo;
        return newPortal;
      }
    )
  })
);
 */
