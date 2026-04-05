import { Component, Input } from '@angular/core';
import { Transformation } from '../../interfaces/interface';

@Component({
  selector: 'app-desktop-main',
  standalone: false,
  templateUrl: './desktop-main.html',
  styleUrl: './desktop-main.css',
})
export class DesktopMain {
  @Input() payload: Transformation[] = [];

  selectRow(row:any) {
    console.log('row selected');
    console.log(row);
  }
}
