import { Injectable } from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store"
import {TodoStateModel} from "../models/TodoStateModel";
import {AddItemAction, ToggleItemAction} from "../actions/todo-actions";
import {TodoModel} from "../models/TodoModel";

/*
Handles 'slice' of global state
Mutated by actions
 */
@State<TodoStateModel>({
  name: 'todo',
  defaults: {
    items: []
  }
})
@Injectable()
export class TodoState {

  @Action(AddItemAction)
  addItem( ctx: StateContext<TodoStateModel>, action: AddItemAction ) {
    // purpose of action is to mutate state, so need ctx
    // want to add new item into items array

    const {name} = action;  // destructuring assignment? Same as name in constructor
    if (!name) {return}

    const state = ctx.getState();
    console.log( ctx.getState() );

    // create new item
    const todoItem: TodoModel = {
      id: 1,
      done: false,
      task: name
    }

    // mutate the state
    // Investigate ... syntax further. Destructured copy?
    ctx.setState({
      ...state,
      items: [...state.items, todoItem]
    });

    console.log( ctx.getState() );
  }

  @Action(ToggleItemAction)
  toggleItem( ctx: StateContext<TodoStateModel>, action: ToggleItemAction ) {
    const state = ctx.getState();

    const modifiedTodoItems = state.items.map( (item) => {
      if (item.id == action.id) {
        return {
          ...item,
          done: !item.done
        }
      }

      return item;
    })

    ctx.setState( {
      items: [...modifiedTodoItems]
    })
  }
}
