import { Component, Input } from '@angular/core';
import { StateService } from '../../services/state-service';

@Component({
  selector: 'app-users-dumbui',
  standalone: false,
  templateUrl: './users-dumbui.html',
  styleUrl: './users-dumbui.css',
})
export class UsersDumbui {
  @Input() users: any[] = [];

  displayedColumns: string[] = ['name', 'age'];

  constructor(private _state:StateService) {

  }
  selectRow(user:any) {
    console.log(`Row selected: ${user.name} - ${user.status} - updating state`);
    this._state.updateSelectedUser(user);
    console.log(this._state);
  }
}
