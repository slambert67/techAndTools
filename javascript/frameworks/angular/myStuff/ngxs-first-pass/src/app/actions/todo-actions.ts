// unclear as to what static readonly type is achieving ???

export class AddItemAction {

  // type = [context] verb entity. Why needed? Used where?
  // needed by ngxs it seems. For what purpose?
  static readonly type = '[TODO page] Add Item';
/*  static readonly type = 'x';*/

  constructor( public name: string ) {
    console.log('Constructing AddItemAction');
  }  // event/action arguments
}

export class ToggleItemAction {
  static readonly type = '[TODO page] Add Item';
/*  static readonly type = 'x';*/
  constructor( public id: number ) {}
}


