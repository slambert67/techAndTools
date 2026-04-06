import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mobile',
  standalone: false,
  templateUrl: './mobile.html',
  styleUrl: './mobile.css',
})
export class Mobile {
  @Input() payload: any[] = [];
}
