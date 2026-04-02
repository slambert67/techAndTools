import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-users-dumbui',
  standalone: false,
  templateUrl: './users-dumbui.html',
  styleUrl: './users-dumbui.css',
})
export class UsersDumbui {
  @Input() users: any[] = [];
}
