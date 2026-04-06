import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-desktop-detail',
  standalone: false,
  templateUrl: './desktop-detail.html',
  styleUrl: './desktop-detail.css',
})
export class DesktopDetail {
  @Input() details!: any;
}
