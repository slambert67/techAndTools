// selectors retrieve a piece of info from our state object
import {TodoModel} from "../models/TodoModel";
import {TodoState} from "../states/todo-state";
import {Selector} from "@ngxs/store";
import {TodoStateModel} from "../models/TodoStateModel";

export class TodoSelectors {

  @Selector([TodoState])
  static todoItems(state: TodoStateModel): TodoModel[] {
    return state.items;
  }
}
