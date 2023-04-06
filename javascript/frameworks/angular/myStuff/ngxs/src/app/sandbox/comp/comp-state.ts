/*
Making a clone of an object is not expensive compared to traversing a mutated object in every change detection cycle to check for changes.


const state = ctx.getState();
let data =  this.service.list();
ctx.setState({
    ...state,
    feedAnimals: data
});

equivalent to

let data =  this.service.list()
ctx.patchState({
    feedAnimals: data
});

patchState is just a shorthand version of setState
Only does a shallow copy

DOES NOT WORK AS state IS IMMUTABLE. CANNOT JUST UPDATE IT
const state = context.getState();
state.permissions = action.payload;
context.setState(state);

WORKS
const state = context.getState();
state.permissions = action.payload;
context.setState({ ...state });  <- setting state to a NEW object

WORKS
const state = context.getState();
state.permissions = action.payload;
context.patchState(state);  <- shorthand of above

 */
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {append, insertItem, patch, removeItem, updateItem} from "@ngxs/store/operators";

/*export interface NumModel {
  num: number;
}

// ACTIONS
export class Mutate1 {
  static readonly type = '[Sandbox] Increment';
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

  @Action(Mutate1)
  mutate1( ctx: StateContext<NumModel> ) {
    console.log('In mutate1');
    let state!: NumModel;

    //const state = ctx.getState();
    //console.log('state'); console.log(state);
    //state.num = 1;  CANNOT DO THIS - STATE IS IMMUTABLE. NEED TO CLONE AND PATCH
    //ctx.setState(state);

    state = ctx.getState();console.log('Before setState'); console.log(state);
    const mutate1Obj1 = {num:1};
    ctx.setState( {...mutate1Obj1} );
    state = ctx.getState();console.log('After setState'); console.log(state);

    state = ctx.getState();console.log('Before patchState'); console.log(state);
    const mutate1Obj2 = {num:2};
    ctx.patchState( mutate1Obj2 );
    state = ctx.getState();console.log('After patchState'); console.log(state);
  }
}*/

/*
export interface ComplexModel {
  num: number;
  str: string;
}

// ACTIONS
export class Mutate1 {
  static readonly type = '[Sandbox] Increment';
  constructor() {}
}

@State<ComplexModel>( {
  name: 'num',
  defaults: {
    num: 1,
    str:'a'
  }
})
@Injectable()
export class ComplexState {

  constructor() {}

  @Action(Mutate1)
  mutate1( ctx: StateContext<ComplexModel> ) {
    console.log('In mutate1');
    let state!: ComplexModel;

    state = ctx.getState();console.log('Before setState'); console.log(state);
    const mutate1Obj1 = {num:2, str:'b'};  // must match structure of ComplexModel
    ctx.setState( {...mutate1Obj1} );
    state = ctx.getState();console.log('After setState'); console.log(state);

    state = ctx.getState();console.log('Before patchState'); console.log(state);
    const mutate1Obj2 = {num:3, str:'c'};
    ctx.patchState( mutate1Obj2 );
    state = ctx.getState();console.log('After patchState'); console.log(state);

    state = ctx.getState();console.log('Before partial patch1'); console.log(state);
    ctx.setState( {...mutate1Obj2, str:'x'} );
    state = ctx.getState();console.log('After partial patch1'); console.log(state);

    state = ctx.getState();console.log('Before partial patch2'); console.log(state);
    ctx.patchState( {num:4} );  // only need to pass changed properties
    state = ctx.getState();console.log('After partial patch2'); console.log(state);

    // use state operator
    state = ctx.getState();console.log('Before partial patch3'); console.log(state);
    ctx.setState( patch<ComplexModel>( {str:'z'} ));  // can specify types
    state = ctx.getState();console.log('After partial patch3'); console.log(state);
  }
}*/

/*
export interface ComplexModel {
  num: number;
  str: string;
  obj: {objnum: number, objstr: string, subobj:{subobjnum:number, subobjstr:string}};
}

// ACTIONS
export class Mutate1 {
  static readonly type = '[Sandbox] Increment';
  constructor() {}
}

@State<ComplexModel>( {
  name: 'num',
  defaults: {
    num: 1,
    str:'a',
    obj: {objnum:10, objstr:'x', subobj:{subobjnum:1, subobjstr:'a'}}
  }
})
@Injectable()
export class ComplexState {

  constructor() {}

  @Action(Mutate1)
  mutate1( ctx: StateContext<ComplexModel> ) {
    console.log('In mutate1');
    let state!: ComplexModel;

    state = ctx.getState();console.log('Before patch1'); console.log(state);
    ctx.patchState( {num:2} );  // So don't need getState
    state = ctx.getState();console.log('After patch1'); console.log(state);

    state = ctx.getState();console.log('Before patch2'); console.log(state);
    ctx.patchState( { obj:{...state.obj, objnum:11} } );
    state = ctx.getState();console.log('After patch2'); console.log(state);

    state = ctx.getState();console.log('Before patch3'); console.log(state);
    ctx.patchState( { obj:{...state.obj, subobj:{...state.obj.subobj, subobjstr:'x'} } } );
    state = ctx.getState();console.log('After patch3'); console.log(state);
  }
}*/

export interface ComplexModel {
  num: number;
  str: string;
  arr: number[];
  arr2: {num:number, str:string}[];
}

// ACTIONS
export class Mutate1 {
  static readonly type = '[Sandbox] Increment';
  constructor() {}
}

@State<ComplexModel>( {
  name: 'num',
  defaults: {
    num: 1,
    str:'a',
    arr: [1,2,3],
    arr2: [ {num:24, str:'x'} ]
  }
})
@Injectable()
export class ComplexState {

  constructor() {}

  @Action(Mutate1)
  mutate1( ctx: StateContext<ComplexModel> ) {
    let state!: ComplexModel;
    let arr: number[] = [4,5,6];

    // replace with new array
    state = ctx.getState();console.log('Before patch1'); console.log(state);
    ctx.patchState( {arr:arr} );
    state = ctx.getState();console.log('After patch1'); console.log(state);

    // setState method can be passed state operators - patch, append, insert etc

    // append an item to an array
    state = ctx.getState();console.log('Before append'); console.log(state);
    ctx.setState(
      patch<ComplexModel>(
        {
          arr:append<number>([7])
        }
      )
    );
    state = ctx.getState();console.log('After append'); console.log(state);

    // insert an item into an array
    state = ctx.getState();console.log('Before insert'); console.log(state);
    ctx.setState(
      patch<ComplexModel>(
        {
          arr:insertItem<number>(99,0)
        }
      )
    );
    state = ctx.getState();console.log('After insert'); console.log(state);

    // update an item in an array
    state = ctx.getState();console.log('Before update'); console.log(state);
    ctx.setState(
      patch<ComplexModel>(
        {
          arr:updateItem<number>(
            num => num === 5,
            55
          )
        }
      )
    );
    state = ctx.getState();console.log('After update'); console.log(state);

    // remove an item from an array
    state = ctx.getState();console.log('Before remove'); console.log(state);
    ctx.setState(
      patch<ComplexModel>(
        {
          arr:removeItem<number>(
            num => num === 99
          )
        }
      )
    );
    state = ctx.getState();console.log('After remove'); console.log(state);

    // append an object to an array of objects
    state = ctx.getState();console.log('Before obj append'); console.log(state);
    ctx.setState(
      patch<ComplexModel>(
        {
          arr2:append( [{num:25, str:'y'}] )
        }
      )
    );
    state = ctx.getState();console.log('After obj append'); console.log(state);

    // update an object in an array
    state = ctx.getState();console.log('Before update'); console.log(state);
    ctx.setState(
      patch<ComplexModel>(
        {
          arr2:updateItem(
            obj => obj?.num === 24,
            {num:26, str:'z'}  // replace. Try patching below
          )
        }
      )
    );
    state = ctx.getState();console.log('After update'); console.log(state);

    // update an object in an array
    state = ctx.getState();console.log('Before update'); console.log(state);
    ctx.setState(
      patch<ComplexModel>(
        {
          arr2:updateItem(
            obj => obj?.num === 26,
            patch( {str:'zzz'})
          )
        }
      )
    );
    state = ctx.getState();console.log('After update'); console.log(state);

  }
}
