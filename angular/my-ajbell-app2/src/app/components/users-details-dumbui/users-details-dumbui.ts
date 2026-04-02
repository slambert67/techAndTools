import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-users-details-dumbui',
  standalone: false,
  templateUrl: './users-details-dumbui.html',
  styleUrl: './users-details-dumbui.css',
})
export class UsersDetailsDumbui {
  @Input() userDetails: any[] = [];
}
