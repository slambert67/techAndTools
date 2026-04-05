import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Transformation } from '../../interfaces/interface';

@Component({
  selector: 'app-desktop-main',
  standalone: false,
  templateUrl: './desktop-main.html',
  styleUrl: './desktop-main.css',
})
export class DesktopMain implements OnChanges{
  @Input() payload: any[] = [];

  selectRow(row:any) {
    console.log('row selected');
    console.log(row);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes');
    console.log(changes);
  }
}
