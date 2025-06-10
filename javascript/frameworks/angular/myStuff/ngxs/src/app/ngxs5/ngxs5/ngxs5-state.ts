import {Selector, State} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

export interface Column {
  label: string;
  dataType: string;
}
export interface Grid {
  gridId: string;
  columns?: Column[];
}
export interface NavigationModel {
  route?: string;
  grids: Grid[];
}

// state handles a particular model
@State<NavigationModel>( {
  name: 'navigation',
  defaults: {
    route: 'all',
    grids: [ {gridId:'all', columns: [{label:'flightId', dataType:'string'},{label:'STA', dataType:'date'}]},
             {gridId:'other', columns: [{label:'xxx', dataType:'number'},{label:'yyy', dataType:'boolean'}]}]
  }
})
@Injectable()
export class NavigationState {

  constructor() {}

  @Selector()
  static getRoute( state: NavigationModel ): string {
    // state is populated unlike the selector defined outside this state class
    // could use arguments[0] instead of state
    return <string>state.route;
  }

  @Selector()
  static getGridColumns( state: NavigationModel ): Column[] | undefined {
    let route = this.getRoute(state);
    //return state.grids.find( (obj) => { if (obj.gridId === route) {return obj.columns} } );
    //return state.grids[0].columns;

/*    let grid = state.grids.find( (obj)=> {return obj.gridId === route});
    return grid?.columns;*/

    return state.grids.find( (obj)=> {return obj.gridId === route})?.columns;

  }
}

export class NavigationSelectors {
  // returns undefined unlike memoized selector defined in the state class
  @Selector()
  static getRoute( state: NavigationModel ): string {
    // state is not populated!
    return <string>state.route;
  }
}

