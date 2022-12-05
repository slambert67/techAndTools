import { Component } from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {AddItemAction, ToggleItemAction} from "./actions/todo-actions";
import {TodoSelectors} from "./selectors/todo-selectors";
import {TodoModel} from "./models/TodoModel";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngxs';

  // need to select our selectors
  @Select(TodoSelectors.todoItems) todoItems$!: Observable<TodoModel[]>

  constructor( private store: Store ) {}

  addItem() {
    this.store.dispatch( new AddItemAction('de-squoink code') );
  }

  toggleItem() {
    this.store.dispatch( new ToggleItemAction(1));
  }
}
