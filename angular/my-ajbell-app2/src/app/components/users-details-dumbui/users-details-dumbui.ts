import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { StateService } from '../../services/state-service';
import { User, UserDetails } from '../../interfaces/interfaces';
import { tap } from 'rxjs';

@Component({
  selector: 'app-users-details-dumbui',
  standalone: false,
  templateUrl: './users-details-dumbui.html',
  styleUrl: './users-details-dumbui.css',
})
export class UsersDetailsDumbui implements OnInit {
  //@Input() userDetails: any[] = [];

  // @Input() userDetails: string | undefined;
  @Input() selectedUser: UserDetails | undefined;

  //public userDetails!: UserDetails | undefined;

  constructor() {
    //console.log(`UsersDetailsDumbui selected user - ${this.selectedUser}`);
  }

  ngOnInit() {

    // works. Now do in component
    
    /*this._state.appState$.subscribe({
      next: (state) => {
        console.log('finding user details');
        //console.log(state);
        console.log(`selected user = ${this.selectedUser}`);
        this.userDetails = state.allUserDetails.find( (user) => { return this.selectedUser === user.name});
      }
    });*/
  }

  /*ngOnChanges(changes: SimpleChanges) {
    console.log('in ngonchanges');
    if (changes['selectedUser']) {
      console.log('Previous:', changes['selectedUser'].previousValue);
      console.log('Current:', changes['selectedUser'].currentValue);
    }
  }*/
}
