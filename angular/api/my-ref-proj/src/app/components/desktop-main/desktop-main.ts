import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-desktop-main',
  standalone: false,
  templateUrl: './desktop-main.html',
  styleUrl: './desktop-main.css',
})
export class DesktopMain {
  @Input() payload: any[] = [];
  @Output() rowSelected = new EventEmitter<any>(); // Event to emit
  
  selectRow(row:any) {
    //console.log('row selected');
    //console.log(row);

    // emit to app.ts
    this.rowSelected.emit(row); // Emit to parent
  }
}
