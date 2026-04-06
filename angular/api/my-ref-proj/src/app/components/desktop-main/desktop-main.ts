import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-desktop-main',
  standalone: false,
  templateUrl: './desktop-main.html',
  styleUrl: './desktop-main.css',
})
export class DesktopMain {
  @Input() payload: any[] = [];
}
